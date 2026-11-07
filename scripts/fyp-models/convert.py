"""Convert the FYP access terminal's TensorFlow 1 models to the TensorFlow.js models the demo loads.

Usage: python convert.py <face_mask_detection.pb> <facenet.pb> <output dir> [dir of face images to verify with]

See README.md for the environment and where the output is hosted.
"""
import collections
import os
import sys
import types

# tensorflowjs imports two packages it only needs for other model types: TensorFlow Decision Forests (no wheels
# for Python 3.12) and its JAX converter (which pulls in JAX and Flax). Empty modules stand in for both.
sys.modules['tensorflow_decision_forests'] = types.ModuleType('tensorflow_decision_forests')
sys.modules['tensorflowjs.converters.jax_conversion'] = types.ModuleType('jax_conversion')
sys.modules['tensorflowjs.converters.jax_conversion'].convert_jax = None

import numpy as np  # noqa: E402
import tensorflow.compat.v1 as tf  # noqa: E402
from tensorflow.core.protobuf import config_pb2, rewriter_config_pb2  # noqa: E402
from tensorflow.python.grappler import tf_optimizer  # noqa: E402
from tensorflowjs import quantization  # noqa: E402
from tensorflowjs.converters import tf_saved_model_conversion_v2 as tfjs  # noqa: E402

tf.disable_v2_behavior()

MASK_OUTPUTS = 'loc_branch_concat_1/concat,cls_branch_concat_1/concat'
FACE_OUTPUT = 'embeddings'
TRAINING_OPS = {'Switch', 'Merge', 'RefSwitch', 'AssignSub', 'RandomUniform', 'Floor'}


def load(path):
    graph_def = tf.GraphDef()
    with open(path, 'rb') as f:
        graph_def.ParseFromString(f.read())
    return graph_def


def patch_ref_ops(graph_def):
    # the patch the FYP's tools.py applied before importing the graph: the batch-norm moving averages are frozen
    # constants, so the ref-typed training ops that update them can't be imported as they are
    for node in graph_def.node:
        if node.op == 'RefSwitch':
            node.op = 'Switch'
            for i, name in enumerate(node.input):
                if 'moving_' in name:
                    node.input[i] = name + '/read'
        elif node.op == 'AssignSub':
            node.op = 'Sub'
            node.attr.pop('use_locking', None)
    return graph_def


def const_node(name, dtype, value):
    node = tf.NodeDef(name=name, op='Const')
    node.attr['dtype'].type = dtype.as_datatype_enum
    node.attr['value'].tensor.CopyFrom(tf.make_tensor_proto(value, dtype=dtype))
    return node


def inference_graph(graph_def):
    """FaceNet with phase_train=False and keep_prob=1 baked in and every training branch removed."""
    baked = tf.GraphDef()
    for node in graph_def.node:
        if node.name == 'phase_train':
            baked.node.append(const_node('phase_train', tf.bool, False))
        elif node.name == 'keep_prob':
            baked.node.append(const_node('keep_prob', tf.float32, 1.0))
        else:
            baked.node.append(node)
    baked = tf.graph_util.extract_sub_graph(baked, [FACE_OUTPUT])

    graph = tf.Graph()
    with graph.as_default():
        tf.import_graph_def(baked, name='')
        tf.add_to_collection('train_op', graph.get_operation_by_name(FACE_OUTPUT))
        meta_graph = tf.train.export_meta_graph(graph_def=graph.as_graph_def(), graph=graph)
    rewriter = rewriter_config_pb2.RewriterConfig()
    # 'loop' removes the dead branch of each Switch whose predicate is now a constant
    rewriter.optimizers.extend(['pruning', 'constfold', 'loop', 'dependency', 'arithmetic', 'pruning', 'constfold', 'loop', 'dependency'])
    rewriter.meta_optimizer_iterations = rewriter_config_pb2.RewriterConfig.TWO
    config = config_pb2.ConfigProto()
    config.graph_options.rewrite_options.CopyFrom(rewriter)
    optimized = tf.graph_util.extract_sub_graph(tf_optimizer.OptimizeGraph(config, meta_graph), [FACE_OUTPUT])

    ops = collections.Counter(node.op for node in optimized.node)
    leftover = TRAINING_OPS & set(ops)
    if leftover:
        sys.exit(f'training ops survived: {sorted(leftover)}')
    print(f'FaceNet inference graph: {len(optimized.node)} nodes, from {len(graph_def.node)}')
    return optimized


def embeddings(graph_def, images, feeds=None):
    with tf.Graph().as_default() as graph, tf.Session(graph=graph) as sess:
        tf.import_graph_def(graph_def, name='')
        feed = {graph.get_tensor_by_name(name): value for name, value in (feeds or {}).items()}
        feed[graph.get_tensor_by_name('input:0')] = images
        return sess.run(graph.get_tensor_by_name(FACE_OUTPUT + ':0'), feed_dict=feed)


def verify(original, cleaned, image_dir):
    from PIL import Image

    paths = sorted(os.path.join(image_dir, f) for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.png')))
    images = np.stack([np.asarray(Image.open(p).convert('RGB').resize((112, 112)), np.float32) / 255 for p in paths])
    expected = embeddings(original, images, {'phase_train:0': False, 'keep_prob:0': 1.0})
    difference = np.abs(expected - embeddings(cleaned, images)).max()
    print(f'largest embedding difference from the original graph over {len(paths)} images: {difference:.2e}')
    if difference > 1e-4:
        sys.exit('the inference graph does not match the original')


def to_tfjs(graph_def, outputs, out_dir, quantization_map):
    path = out_dir + '.pb'
    with open(path, 'wb') as f:
        f.write(graph_def.SerializeToString())
    tfjs.convert_tf_frozen_model(
        path, outputs, out_dir, quantization_dtype_map=quantization_map, weight_shard_size_bytes=4 * 1024 * 1024
    )
    os.remove(path)
    size = sum(os.path.getsize(os.path.join(out_dir, f)) for f in os.listdir(out_dir))
    print(f'{out_dir}: {size / 1e6:.1f} MB')


def main(mask_path, face_path, out_dir, image_dir=None):
    os.makedirs(out_dir, exist_ok=True)

    # the mask detector has no training ops; float16 weights halve it with no measurable change
    to_tfjs(
        load(mask_path),
        MASK_OUTPUTS,
        os.path.join(out_dir, 'face-mask-detection'),
        {quantization.QUANTIZATION_DTYPE_FLOAT16: True},
    )

    original = patch_ref_ops(load(face_path))
    cleaned = inference_graph(original)
    if image_dir:
        verify(original, cleaned, image_dir)
    # uint8 for the convolution kernels, which hold nearly all the weights, and float16 for the rest: uint8 biases,
    # batch-norm offsets and bottleneck layer shift the embeddings five times as much for under 1 MB of savings
    to_tfjs(
        cleaned,
        FACE_OUTPUT,
        os.path.join(out_dir, 'masked-facenet'),
        {
            quantization.QUANTIZATION_DTYPE_UINT8: ['*Conv2D_weights', '*Conv2d_1x1/weights'],
            quantization.QUANTIZATION_DTYPE_FLOAT16: True,
        },
    )


if __name__ == '__main__':
    if len(sys.argv) not in (4, 5):
        sys.exit(__doc__)
    main(*sys.argv[1:])
