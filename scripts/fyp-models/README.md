# FYP demo models

The access terminal demo at `/works/fyp/terminal` runs the two neural networks from my final year project in the browser with TensorFlow.js. `convert.py` turns the original TensorFlow 1 frozen graphs into the TensorFlow.js graph models the demo loads.

| Model | Original | Converted | Output |
| --- | --- | --- | --- |
| Face and mask detection (AIZOOTech's SSD, 260×260 input) | `face_mask_detection.pb`, 4.1 MB | float16 weights, 2.1 MB | `face-mask-detection/` |
| Masked face recognition (FaceNet Inception-ResNet-v1, 112×112 input, 128-d embeddings) | `pb_model_select_num=15.pb`, 98.5 MB | uint8 convolution kernels and float16 for the rest, 23.3 MB | `masked-facenet/` |

The originals aren't in this repo. They're in my FYP backup, under `Temp_FYP/Final Code`.

## What the conversion does

- The FaceNet graph was frozen during training, so it still has a `phase_train` and a `keep_prob` input and a batch-norm `Switch`/`Merge` pair in every layer. The script applies the same `RefSwitch`/`AssignSub` patch the FYP's `tools.py` did, bakes in `phase_train=False` and `keep_prob=1`, and lets Grappler remove the dead branches. That leaves a plain inference graph of 1,130 nodes instead of 5,914, which TensorFlow.js can run without its slow control-flow executor.
- Given a folder of face images, it checks that the inference graph's embeddings match the original graph's.
- Plain uint8 quantization of FaceNet also quantizes its biases, folded batch-norm offsets and bottleneck layer, which shifted embeddings by up to 0.23. That's a lot next to the 0.8 match threshold. Keeping those in float16 costs under 1 MB and cuts the shift to 0.05.

On frames from my 2021 recording, the converted models with `app/utils/fyp/vision.js` gave the same faces, mask classes and matches as the original Python pipeline, with boxes within a pixel and match distances within 0.02.

## Running it

TensorFlow.js's converter needs TensorFlow 2, and it can't be installed with its full dependency tree on Python 3.12 (TensorFlow Decision Forests has no wheels for it). The script stubs out the two modules it imports but doesn't use for frozen graphs, so install it without dependencies:

```bash
uv venv -p 3.12 .venv
VIRTUAL_ENV=.venv uv pip install "tensorflow==2.18.*" "tf-keras==2.18.*" tensorflow-hub packaging six importlib_resources pillow "setuptools<81"
VIRTUAL_ENV=.venv uv pip install --no-deps "tensorflowjs==4.22.0"
.venv/bin/python convert.py face_mask_detection.pb "pb_model_select_num=15.pb" out/v1 "Final Code/test_small"
```

## Hosting

The models are served from the `raaedkabir-assets` S3 bucket, which allows public `GET`s from any origin. Each version gets its own folder, so the files can be cached forever:

```bash
aws s3 cp out/v1 s3://raaedkabir-assets/fyp/models/v1 --recursive \
  --cache-control "public, max-age=31536000, immutable"
```

The site reads the base URL from `runtimeConfig.public.fypModelBase` in `nuxt.config.ts`. To test changes before uploading, serve the folder locally and point the site at it:

```bash
pnpm exec sirv out --cors --port 4180
NUXT_PUBLIC_FYP_MODEL_BASE=http://localhost:4180/v1 pnpm dev
```

A new conversion goes in a new folder (`v2`), with `fypModelBase` updated to match.
