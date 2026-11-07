// TensorFlow.js port of the FYP access terminal's inference code: face and mask detection from
// face_alignment.py (an SSD model) and masked face recognition from app.py (FaceNet, Inception-ResNet-v1).
// tf is passed in rather than imported so TensorFlow.js stays out of the prerender and the page bundle.

export const MASK_MODEL_SIZE = 260;
export const FACE_MODEL_SIZE = 112;
// frames are processed at the terminal's 640x480, which the 40px crop margin was tuned for
export const FRAME_WIDTH = 640;
// FaceNet embeddings closer than this are the same person (app.py)
export const MATCH_THRESHOLD = 0.8;

const MASK_INPUT = 'data_1';
const MASK_OUTPUTS = ['loc_branch_concat_1/concat', 'cls_branch_concat_1/concat'];
const FACE_OUTPUT = 'embeddings';

const CONFIDENCE_THRESHOLD = 0.8;
const IOU_THRESHOLD = 0.7;
const MARGIN = 40;
const FEATURE_MAP_SIZES = [33, 17, 9, 5, 3];
const ANCHOR_SIZES = [
  [0.04, 0.056],
  [0.08, 0.11],
  [0.16, 0.22],
  [0.32, 0.45],
  [0.64, 0.72],
];
const ANCHOR_RATIOS = [1, 0.62, 0.42];
const VARIANCES = [0.1, 0.1, 0.2, 0.2];

// [xmin, ymin, xmax, ymax] per anchor, normalized, in the order the model predicts them:
// feature map, then row, then column, then anchor shape
const generateAnchors = () => {
  const anchors = [];
  FEATURE_MAP_SIZES.forEach((size, i) => {
    const [firstSize] = ANCHOR_SIZES[i];
    const shapes = [
      ...ANCHOR_SIZES[i].map((scale) => [scale, ANCHOR_RATIOS[0]]),
      ...ANCHOR_RATIOS.slice(1).map((ratio) => [firstSize, ratio]),
    ].map(([scale, ratio]) => [scale * Math.sqrt(ratio), scale / Math.sqrt(ratio)]);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const cx = (col + 0.5) / size;
        const cy = (row + 0.5) / size;
        for (const [width, height] of shapes) {
          anchors.push(cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2);
        }
      }
    }
  });
  return Float32Array.from(anchors);
};

const ANCHORS = generateAnchors();

const decodeBox = (raw, i) => {
  const a = i * 4;
  const anchorWidth = ANCHORS[a + 2] - ANCHORS[a];
  const anchorHeight = ANCHORS[a + 3] - ANCHORS[a + 1];
  const cx = raw[a] * VARIANCES[0] * anchorWidth + (ANCHORS[a] + ANCHORS[a + 2]) / 2;
  const cy = raw[a + 1] * VARIANCES[1] * anchorHeight + (ANCHORS[a + 1] + ANCHORS[a + 3]) / 2;
  const width = Math.exp(raw[a + 2] * VARIANCES[2]) * anchorWidth;
  const height = Math.exp(raw[a + 3] * VARIANCES[3]) * anchorHeight;
  return [cx - width / 2, cy - height / 2, cx + width / 2, cy + height / 2];
};

// single-class NMS over each anchor's best class, as face_alignment.py does it
const nonMaxSuppression = (boxes, scores) => {
  const area = ([xmin, ymin, xmax, ymax]) => (xmax - xmin + 1e-3) * (ymax - ymin + 1e-3);
  let candidates = boxes
    .map((box, i) => ({ box, score: scores[i], index: i }))
    .filter(({ score }) => score > CONFIDENCE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  const picked = [];
  while (candidates.length) {
    const [best, ...rest] = candidates;
    picked.push(best.index);
    candidates = rest.filter(({ box }) => {
      const overlapWidth = Math.max(0, Math.min(best.box[2], box[2]) - Math.max(best.box[0], box[0]));
      const overlapHeight = Math.max(0, Math.min(best.box[3], box[3]) - Math.max(best.box[1], box[1]));
      const overlap = overlapWidth * overlapHeight;
      return overlap / (area(box) + area(best.box) - overlap) <= IOU_THRESHOLD;
    });
  }
  return picked;
};

// bilinear resize with OpenCV's pixel mapping, which the Python code used for every resize
const resize = (tf, image, size) => tf.image.resizeBilinear(image, [size, size], false, true);

/**
 * Finds faces and whether each is wearing a mask.
 * @param frame float32 RGB tensor [height, width, 3] scaled to 0..1
 * @returns {Promise<{ x: number, y: number, width: number, height: number, mask: boolean, confidence: number }[]>}
 *   boxes in frame pixels, padded by the margin the recognition model expects
 */
export const detectFaces = async (tf, maskModel, frame) => {
  const [frameHeight, frameWidth] = frame.shape;
  const outputs = tf.tidy(() => {
    const input = tf.expandDims(resize(tf, frame, MASK_MODEL_SIZE), 0);
    return maskModel.execute({ [MASK_INPUT]: input }, MASK_OUTPUTS);
  });
  const [raw, classes] = await Promise.all(outputs.map((tensor) => tensor.data()));
  tf.dispose(outputs);

  const anchorCount = ANCHORS.length / 4;
  const boxes = [];
  const scores = [];
  const masked = [];
  for (let i = 0; i < anchorCount; i++) {
    boxes.push(decodeBox(raw, i));
    const [mask, noMask] = [classes[i * 2], classes[i * 2 + 1]];
    scores.push(Math.max(mask, noMask));
    masked.push(mask >= noMask);
  }

  return nonMaxSuppression(boxes, scores)
    .map((i) => {
      const [xmin, ymin, xmax, ymax] = boxes[i];
      const left = Math.max(0, xmin * frameWidth - MARGIN / 2);
      const top = Math.max(0, ymin * frameHeight - MARGIN / 2);
      const right = Math.min(xmax * frameWidth + MARGIN / 2, frameWidth);
      const bottom = Math.min(ymax * frameHeight + MARGIN / 2, frameHeight);
      return {
        x: Math.trunc(left),
        y: Math.trunc(top),
        width: Math.trunc(right - left),
        height: Math.trunc(bottom - top),
        mask: masked[i],
        confidence: scores[i],
      };
    })
    .filter(({ width, height }) => width > 0 && height > 0);
};

const embed = async (tf, faceModel, batch) => {
  const output = tf.tidy(() => faceModel.execute(batch(), FACE_OUTPUT));
  const embeddings = await output.array();
  output.dispose();
  return embeddings;
};

/**
 * FaceNet embeddings for faces found by detectFaces.
 * @param frame the same float32 RGB tensor the faces were detected in
 * @returns {Promise<number[][]>} one 128-d embedding per face
 */
export const embedFaces = (tf, faceModel, frame, faces) => {
  if (!faces.length) return Promise.resolve([]);
  return embed(tf, faceModel, () =>
    tf.stack(faces.map(({ x, y, width, height }) => resize(tf, tf.slice(frame, [y, x, 0], [height, width, 3]), FACE_MODEL_SIZE))),
  );
};

/**
 * FaceNet embedding of an image that is already a face crop, like the reference photos app.py loaded.
 * @param image float32 RGB tensor [height, width, 3] scaled to 0..1
 */
export const embedFaceImage = async (tf, faceModel, image) => {
  const [embedding] = await embed(tf, faceModel, () => tf.expandDims(resize(tf, image, FACE_MODEL_SIZE), 0));
  return embedding;
};

export const distance = (a, b) => Math.sqrt(a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0));

/**
 * The closest known face, if it is within the match threshold.
 * @param {{ embedding: number[] }[]} known
 */
export const matchFace = (embedding, known) => {
  let best = null;
  for (const entry of known) {
    const d = distance(embedding, entry.embedding);
    if (!best || d < best.distance) best = { entry, distance: d };
  }
  return best && best.distance < MATCH_THRESHOLD ? best : { entry: null, distance: best?.distance ?? Infinity };
};
