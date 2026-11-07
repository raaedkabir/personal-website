// Set-up for the FYP access terminal demo: TensorFlow.js, the two models, the camera, and the face encodings of
// everyone with a photo, which the original terminal computed from the S3 photos each time it started.
import { FACE_MODEL_SIZE, FRAME_WIDTH, detectFaces, embedFaceImage, embedFaces } from './vision';

const MASK_MODEL = 'face-mask-detection/model.json';
const FACE_MODEL = 'masked-facenet/model.json';
// download sizes, to weight the two models' progress
const MASK_MODEL_BYTES = 2.1;
const FACE_MODEL_BYTES = 23.4;

/**
 * Loads TensorFlow.js (WebGL, or the much slower CPU backend) and both models, then runs them once so the
 * WebGL shaders are compiled before the camera starts.
 * @param {(fraction: number) => void} onProgress
 */
export const loadModels = async (baseUrl, onProgress) => {
  const [tf, { loadGraphModel }] = await Promise.all([
    import('@tensorflow/tfjs-core'),
    import('@tensorflow/tfjs-converter'),
    import('@tensorflow/tfjs-backend-cpu'),
    import('@tensorflow/tfjs-backend-webgl'),
  ]);
  const webgl = await tf.setBackend('webgl').catch(() => false);
  if (!webgl) await tf.setBackend('cpu');
  await tf.ready();

  const progress = [0, 0];
  const track = (i) => (fraction) => {
    progress[i] = fraction;
    onProgress((progress[0] * MASK_MODEL_BYTES + progress[1] * FACE_MODEL_BYTES) / (MASK_MODEL_BYTES + FACE_MODEL_BYTES));
  };
  const [maskModel, faceModel] = await Promise.all([
    loadGraphModel(`${baseUrl}/${MASK_MODEL}`, { onProgress: track(0) }),
    loadGraphModel(`${baseUrl}/${FACE_MODEL}`, { onProgress: track(1) }),
  ]);

  const frame = tf.zeros([480, FRAME_WIDTH, 3]);
  const face = tf.zeros([FACE_MODEL_SIZE, FACE_MODEL_SIZE, 3]);
  await detectFaces(tf, maskModel, frame);
  await embedFaceImage(tf, faceModel, face);
  tf.dispose([frame, face]);

  return { tf, maskModel, faceModel, backend: tf.getBackend() };
};

export const disposeModels = (models) => {
  models?.maskModel.dispose();
  models?.faceModel.dispose();
};

/** float32 RGB tensor scaled to 0..1, as the Python code fed its models */
export const toPixels = (tf, source) => tf.tidy(() => tf.div(tf.cast(tf.browser.fromPixels(source), 'float32'), 255));

export const largestFace = (faces) => faces.toSorted((a, b) => b.width * b.height - a.width * a.height)[0];

/**
 * The FaceNet embedding of a profile photo: of its largest face if one is found, otherwise of the whole image,
 * which is how app.py treated the already-cropped faces in its database folder.
 */
export const encodePhoto = async ({ tf, maskModel, faceModel }, src) => {
  const image = new Image();
  image.src = src;
  await image.decode();
  const pixels = toPixels(tf, image);
  try {
    const face = largestFace(await detectFaces(tf, maskModel, pixels));
    if (face) return (await embedFaces(tf, faceModel, pixels, [face]))[0];
    return await embedFaceImage(tf, faceModel, pixels);
  } finally {
    pixels.dispose();
  }
};

export const startCamera = async (video) => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw Object.assign(new Error('This browser has no camera access here.'), { name: 'NoCameraAPI' });
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
  });
  video.srcObject = stream;
  await video.play();
  return stream;
};

export const stopCamera = (stream) => stream?.getTracks().forEach((track) => track.stop());

export const cameraErrorMessage = (error) => {
  switch (error?.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Camera access was blocked. Allow it for this site in your browser, then try again.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'No camera was found. Plug one in, then try again.';
    case 'NotReadableError':
      return 'The camera is in use by another app. Close it, then try again.';
    case 'NoCameraAPI':
      return "This browser can't use a camera on this page.";
    default:
      return null;
  }
};
