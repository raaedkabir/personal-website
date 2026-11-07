<template>
  <main class="container pt-12 terminal-page">
    <AppLink to="/works/fyp"><span aria-hidden="true">←</span> Back to the project</AppLink>
    <h1 class="heading__primary mt-2">Access Terminal <span>_</span></h1>
    <p class="lead">
      The Raspberry Pi terminal from my final year project, running in your browser. It checks for a face mask, recognizes
      you even with the mask on, takes your temperature and records your attendance. The two neural networks are the
      originals, converted to TensorFlow.js, and your camera feed never leaves this device.
    </p>

    <div class="terminal">
      <div class="screen" :style="{ aspectRatio: `${frameSize.width} / ${frameSize.height}` }">
        <video ref="video" class="screen__video" playsinline muted aria-hidden="true" />
        <canvas
          ref="overlay"
          class="screen__overlay"
          :width="frameSize.width"
          :height="frameSize.height"
          role="img"
          aria-label="Your camera, with each face the terminal detects outlined in green (mask) or red (no mask)"
        />
        <div v-if="phase !== 'running'" class="screen__cover">
          <template v-if="phase === 'idle'">
            <p>The terminal uses your camera. Its models (25 MB) download once and run on this device.</p>
            <AppButton type="button" @click="start">Start the terminal</AppButton>
          </template>
          <template v-else-if="phase === 'loading'">
            <p>{{ loadingText }}</p>
            <progress v-if="downloading" :value="progress" max="1" aria-label="Model download" />
            <progress v-else aria-label="Starting" />
          </template>
          <template v-else>
            <p role="alert">{{ error }}</p>
            <AppButton type="button" @click="start">Try again</AppButton>
          </template>
        </div>
      </div>

      <div class="panel">
        <p class="prompt" :class="`prompt--${prompt.tone}`" role="status">{{ prompt.text }}</p>

        <ol class="checks" aria-label="Checks">
          <li v-for="check in checks" :key="check.label" class="check" :class="`check--${check.state}`">
            <FypIcon :path="check.icon" />
            <span class="check__label">{{ check.label }}</span>
            <span class="check__value">{{ check.value }}</span>
          </li>
        </ol>

        <div class="settings">
          <label class="setting">
            <span>Branch</span>
            <select v-model="branch">
              <option v-for="option in BRANCHES" :key="option.id" :value="option.id">{{ option.name }}</option>
            </select>
          </label>
          <label class="setting">
            <input v-model="fever" type="checkbox" />
            <span>Simulate a fever</span>
          </label>
          <label class="setting">
            <input v-model="voice" type="checkbox" />
            <span>Voice prompts</span>
          </label>
        </div>

        <form class="enroll" @submit.prevent="requestEnroll">
          <h2 class="panel__heading">Register your face</h2>
          <p class="enroll__hint">{{ enrollHint }}</p>
          <div class="enroll__row">
            <label for="enroll-name" class="visually-hidden">Your name</label>
            <input
              id="enroll-name"
              v-model="enrollName"
              type="text"
              placeholder="Your name"
              maxlength="40"
              autocomplete="given-name"
              required
            />
            <AppButton type="submit" :disabled="!canEnroll">Register</AppButton>
          </div>
        </form>

        <section class="log" aria-labelledby="log-title">
          <h2 id="log-title" class="panel__heading">Recorded here</h2>
          <ul v-if="log.length">
            <li v-for="entry in log" :key="entry.id">
              {{ formatTime(entry.datetime) }} · {{ entry.name }} · {{ formatTemperature(entry.temperature) }} ·
              {{ entry.mask ? 'mask' : 'no mask' }}
            </li>
          </ul>
          <p v-else>Nothing yet.</p>
          <AppLink to="/works/fyp/dashboard/attendance">See every check-in in the dashboard</AppLink>
        </section>

        <AppButton v-if="phase === 'running'" type="button" flat class="stop" @click="stop">Stop the terminal</AppButton>
      </div>
    </div>

    <section class="how">
      <h2 class="heading__sub-section">How to try it <span>_</span></h2>
      <ol>
        <li>Start the terminal and allow camera access.</li>
        <li>
          Take off your mask if you have one on, type your name and select Register. The terminal saves a crop of your face to
          the demo's database in this browser, like the profile photos it matched against in the original.
        </li>
        <li>
          Put on a mask. No mask handy? Cover your mouth and nose with your hand: as my thesis found, the detector accepts
          anything mask-sized over the lower half of the face.
        </li>
        <li>
          Hold still for a moment. The terminal recognizes you, takes your temperature and records your attendance. The
          temperature is simulated, since there's no thermal camera; tick "Simulate a fever" to see a failed check.
        </li>
        <li>
          Open the <AppLink to="/works/fyp/dashboard">dashboard</AppLink> to see the record. You're its administrator.
        </li>
      </ol>
      <p v-if="backend === 'cpu'" class="warning">
        Your browser couldn't use WebGL, so the models are running on the CPU and the terminal will be slow.
      </p>
    </section>
  </main>
</template>

<script setup>
import { mdiAccountQuestion, mdiFaceMask, mdiFaceRecognition, mdiThermometer } from '@mdi/js';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';
import {
  BRANCHES,
  FEVER_THRESHOLD,
  fullName,
  getFaces,
  recordAttendance,
  saveEmbedding,
  updateUser,
  visitorId,
} from '~/utils/fyp/db';
import { formatTemperature, formatTime } from '~/utils/fyp/format';
import {
  cameraErrorMessage,
  disposeModels,
  encodePhoto,
  loadModels,
  startCamera,
  stopCamera,
  toPixels,
} from '~/utils/fyp/terminal';
import { FRAME_WIDTH, detectFaces, embedFaces, matchFace } from '~/utils/fyp/vision';

useHead({ title: 'Access Terminal – Final Year Project' });

// a face's mask and identity must hold this long before the terminal acts on them
const STABLE_MS = 700;
// how long a face can drop out of view before the terminal starts over
const LOST_MS = 1200;
// the same result for the same person is recorded at most this often
const RECORD_COOLDOWN_MS = 30_000;
const MAX_FACES = 3;
const IDLE_PROMPT = { text: 'Look at the camera.', tone: 'neutral' };

const { fypModelBase } = useRuntimeConfig().public;
const route = useRoute();

const video = ref(null);
const overlay = ref(null);
const phase = ref('idle');
const loadingText = ref('');
const downloading = ref(false);
const progress = ref(0);
const error = ref('');
const backend = ref('');
const frameSize = ref({ width: 640, height: 480 });
const prompt = ref({ text: 'Start the terminal to begin.', tone: 'neutral' });
// the largest face in the latest frame; replaced every frame, so not deeply reactive
const subject = shallowRef(null);
const registered = ref(0);
const temperature = ref(null);
const branch = ref(BRANCHES[0].id);
const fever = ref(false);
const voice = ref(true);
const enrollName = ref('');
const log = ref([]);

// TensorFlow.js models, camera and loop state stay out of Vue's reactivity
let models = null;
let stream = null;
let frameId = 0;
let pendingFrame = null;
let running = false;
let isUnmounted = false;
let known = [];
let work = null;
let pendingEnroll = null;
let candidate = null;
let decided = null;
let lastSeen = 0;
const lastRecorded = new Map();

const checks = computed(() => {
  const face = subject.value;
  const identity = () => {
    if (!registered.value) return { state: 'waiting', value: 'Nobody registered yet' };
    return face.name
      ? { state: 'pass', value: `${face.name} (${face.distance.toFixed(2)})` }
      : { state: 'fail', value: `Unknown (${face.distance.toFixed(2)})` };
  };
  return [
    {
      label: 'Face',
      icon: mdiFaceRecognition,
      ...(face ? { state: 'pass', value: 'Detected' } : { state: 'waiting', value: '—' }),
    },
    {
      label: 'Mask',
      icon: mdiFaceMask,
      ...(face
        ? { state: face.mask ? 'pass' : 'fail', value: `${face.mask ? 'On' : 'Off'} (${face.confidence.toFixed(2)})` }
        : { state: 'waiting', value: '—' }),
    },
    { label: 'Identity', icon: mdiAccountQuestion, ...(face ? identity() : { state: 'waiting', value: '—' }) },
    {
      label: 'Temperature',
      icon: mdiThermometer,
      ...(face && temperature.value !== null
        ? {
            state: temperature.value > FEVER_THRESHOLD ? 'fail' : 'pass',
            value: `${formatTemperature(temperature.value)} (simulated)`,
          }
        : { state: 'waiting', value: '—' }),
    },
  ];
});

const canEnroll = computed(
  () => phase.value === 'running' && subject.value && !subject.value.mask && enrollName.value.trim() !== '',
);

const enrollHint = computed(() => {
  if (phase.value !== 'running') return 'Start the terminal first.';
  if (!subject.value) return 'Face the camera.';
  if (subject.value.mask) return 'Take your mask off for the photo.';
  return 'Ready when you are.';
});

const setPrompt = (next) => {
  // the prompt is a live region, so only touch it when the message changes
  if (next.text !== prompt.value.text || next.tone !== prompt.value.tone) prompt.value = next;
};

// the original played these through a speaker with gTTS
const say = (text) => {
  if (!text || !voice.value || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  speechSynthesis.speak(new SpeechSynthesisUtterance(text));
};

const identify = (embedding) => {
  if (!known.length) return { name: null, userId: null, distance: Infinity };
  const { entry, distance } = matchFace(embedding, known);
  return { name: entry?.name ?? null, userId: entry?.user_id ?? null, distance };
};

// face encodings of everyone with a photo; new photos are encoded once and cached in the database
const loadKnownFaces = async () => {
  const faces = [];
  for (const account of await getFaces()) {
    let embedding = account.embedding;
    if (!embedding) {
      embedding = await encodePhoto(models, account.image);
      await saveEmbedding(account.user_id, account.image, embedding);
    }
    faces.push({ user_id: account.user_id, name: fullName(account) || account.email, embedding });
  }
  known = faces;
  registered.value = faces.length;
};

const draw = (faces) => {
  const ctx = overlay.value?.getContext('2d');
  if (!ctx) return;
  const { width } = frameSize.value;
  ctx.clearRect(0, 0, width, frameSize.value.height);
  ctx.font = '600 18px system-ui, sans-serif';
  ctx.lineWidth = 3;
  for (const face of faces) {
    // the video is mirrored like a selfie camera, so the boxes are too
    const x = width - face.x - face.width;
    // dark enough for the white labels to pass WCAG AA, which axe can't check inside a canvas
    const color = face.mask ? '#188038' : '#c62828';
    // the labels from app.py: name and embedding distance, then mask class and confidence
    const lines = [`${face.mask ? 'Mask' : 'NoMask'}: ${face.confidence.toFixed(2)}`];
    if (Number.isFinite(face.distance)) lines.unshift(`${face.name ?? 'Unknown'}: ${face.distance.toFixed(2)}`);
    const lineHeight = 22;
    const labelWidth = Math.max(...lines.map((line) => ctx.measureText(line).width)) + 10;
    const labelTop = Math.max(0, face.y - lineHeight * lines.length);

    ctx.strokeStyle = color;
    ctx.strokeRect(x, face.y, face.width, face.height);
    ctx.fillStyle = color;
    ctx.fillRect(x - 1.5, labelTop, labelWidth, lineHeight * lines.length);
    ctx.fillStyle = '#fff';
    lines.forEach((line, i) => ctx.fillText(line, x + 4, labelTop + lineHeight * (i + 1) - 6));
  }
};

const record = async (face, reading, tone) => {
  const who = face.userId ?? 'visitor';
  const last = lastRecorded.get(who);
  const now = Date.now();
  if (last && last.tone === tone && now - last.time < RECORD_COOLDOWN_MS) return;
  lastRecorded.set(who, { tone, time: now });
  const row = await recordAttendance({ userId: face.userId, temperature: reading, mask: face.mask, branch: branch.value });
  log.value = [{ ...row, name: face.name ?? 'Visitor' }, ...log.value].slice(0, 5);
};

// the hardware flowchart: mask, then identity, then temperature
const decide = (face) => {
  const reading = Math.round((fever.value ? 37.8 + Math.random() * 0.8 : 36.2 + Math.random() * 0.6) * 10) / 10;
  temperature.value = reading;
  let outcome;
  if (!known.length) {
    // a fresh demo: nobody to recognize and nothing worth recording yet
    temperature.value = null;
    setPrompt({ text: 'Nobody is registered yet. Register your face below to get started.', tone: 'warn' });
    return;
  }
  if (!face.mask) {
    outcome = { text: 'Please put your mask on.', tone: 'bad', speech: 'Please put your mask on' };
  } else if (face.userId === null) {
    outcome = { text: `Face not recognized, so this was recorded as a visitor.`, tone: 'warn' };
  } else if (reading > FEVER_THRESHOLD) {
    outcome = {
      text: `Your temperature is over ${FEVER_THRESHOLD} °C.`,
      tone: 'bad',
      speech: `Your temperature is over ${FEVER_THRESHOLD} degrees`,
    };
  } else {
    outcome = { text: `Verified. Welcome, ${face.name}!`, tone: 'good', speech: 'Verified' };
  }
  setPrompt(outcome);
  say(outcome.speech);
  record(face, reading, outcome.tone).catch((error) => setPrompt({ text: error.message, tone: 'bad' }));
};

const update = (face) => {
  const now = performance.now();
  subject.value = face ?? null;
  if (!face) {
    if (now - lastSeen > LOST_MS && (candidate || decided)) {
      candidate = null;
      decided = null;
      temperature.value = null;
      setPrompt(IDLE_PROMPT);
    }
    return;
  }
  lastSeen = now;
  // until someone is registered there is no identity to wait for
  const key = `${face.mask}:${known.length ? face.userId : ''}`;
  if (candidate?.key !== key) {
    candidate = { key, since: now };
    if (decided !== key) {
      temperature.value = null;
      setPrompt({ text: 'Scanning, hold still…', tone: 'neutral' });
    }
  }
  if (decided !== key && now - candidate.since >= STABLE_MS) {
    decided = key;
    decide(face);
  }
};

// saves the registering face from the frame it was detected in
const enroll = async (face) => {
  const crop = document.createElement('canvas');
  crop.width = face.width;
  crop.height = face.height;
  crop.getContext('2d').drawImage(work, face.x, face.y, face.width, face.height, 0, 0, face.width, face.height);
  const image = crop.toDataURL('image/jpeg', 0.9);
  const name = enrollName.value.trim();
  const userId = await visitorId();
  await updateUser(userId, { first_name: name, last_name: '', image });
  await saveEmbedding(userId, image, face.embedding);
  await loadKnownFaces();
  candidate = null;
  decided = null;
  setPrompt({ text: `Registered, ${name}. Now put on a mask and look at the camera.`, tone: 'good' });
};

// registering waits for the next frame with an unmasked face, for up to this long
const ENROLL_TIMEOUT_MS = 5000;

const requestEnroll = () => {
  if (!canEnroll.value) return;
  pendingEnroll = { since: performance.now() };
  setPrompt({ text: 'Registering, hold still without a mask…', tone: 'neutral' });
};

const handleEnroll = async (face) => {
  if (face && !face.mask) {
    pendingEnroll = null;
    try {
      await enroll(face);
    } catch (error) {
      // most likely a full localStorage
      setPrompt({ text: error.message, tone: 'bad' });
    }
  } else if (performance.now() - pendingEnroll.since > ENROLL_TIMEOUT_MS) {
    pendingEnroll = null;
    setPrompt({ text: "Couldn't see your face without a mask. Face the camera and try again.", tone: 'warn' });
  }
};

const processFrame = async () => {
  const { width, height } = frameSize.value;
  work.getContext('2d').drawImage(video.value, 0, 0, width, height);
  const { tf, maskModel, faceModel } = models;
  const pixels = toPixels(tf, work);
  let faces;
  try {
    faces = (await detectFaces(tf, maskModel, pixels))
      .toSorted((a, b) => b.width * b.height - a.width * a.height)
      .slice(0, MAX_FACES);
    const embeddings = await embedFaces(tf, faceModel, pixels, faces);
    faces = faces.map((face, i) => ({ ...face, embedding: embeddings[i], ...identify(embeddings[i]) }));
  } finally {
    pixels.dispose();
  }
  if (!running) return;

  draw(faces);
  const [face] = faces;
  if (pendingEnroll) {
    // the face must come from this frame, which is still on the work canvas
    await handleEnroll(face);
    return;
  }
  update(face);
};

const loop = async () => {
  if (!running) return;
  if (video.value?.readyState >= 2) {
    pendingFrame = processFrame();
    try {
      await pendingFrame;
    } catch (err) {
      // a frame cut short by stopping isn't an error
      if (running) console.error(err);
    } finally {
      pendingFrame = null;
    }
  }
  if (running) frameId = requestAnimationFrame(loop);
};

const sizeFrame = () => {
  const { videoWidth, videoHeight } = video.value;
  // process at the 640px width the original terminal ran at
  const width = FRAME_WIDTH;
  const height = Math.round((FRAME_WIDTH * videoHeight) / videoWidth) || 480;
  frameSize.value = { width, height };
  work = document.createElement('canvas');
  work.width = width;
  work.height = height;
};

const start = async () => {
  phase.value = 'loading';
  error.value = '';
  try {
    if (!models) {
      loadingText.value = 'Downloading the models…';
      downloading.value = true;
      progress.value = 0;
      const loaded = await loadModels(fypModelBase, (fraction) => (progress.value = fraction));
      downloading.value = false;
      if (isUnmounted) return disposeModels(loaded);
      models = loaded;
      backend.value = loaded.backend;
    }
    loadingText.value = 'Encoding the registered faces…';
    await loadKnownFaces();
    if (isUnmounted) return;

    loadingText.value = 'Starting the camera…';
    stream = await startCamera(video.value);
    if (isUnmounted) return stopCamera(stream);

    sizeFrame();
    phase.value = 'running';
    setPrompt(IDLE_PROMPT);
    running = true;
    loop();
  } catch (err) {
    console.error(err);
    downloading.value = false;
    if (isUnmounted) return;
    phase.value = 'error';
    error.value =
      cameraErrorMessage(err) ?? "Sorry, the terminal couldn't start. Check your internet connection and try again.";
  }
};

const stop = () => {
  running = false;
  cancelAnimationFrame(frameId);
  stopCamera(stream);
  stream = null;
  if (video.value) video.value.srcObject = null;
  if ('speechSynthesis' in globalThis) speechSynthesis.cancel();
  subject.value = null;
  candidate = null;
  decided = null;
  temperature.value = null;
  draw([]);
  phase.value = 'idle';
  setPrompt({ text: 'Start the terminal to begin.', tone: 'neutral' });
};

// the map links to each branch's terminal with ?branch=; the page is prerendered without it, so read it once mounted
onMounted(() => {
  if (BRANCHES.some(({ id }) => id === route.query.branch)) branch.value = route.query.branch;
});

onBeforeUnmount(() => {
  // free the camera and the GPU memory the models hold; the page may also be left while they load
  isUnmounted = true;
  const loaded = models;
  models = null;
  stop();
  // a frame may still be running on the models, so free them once it finishes
  Promise.resolve(pendingFrame)
    .catch(() => {})
    .finally(() => disposeModels(loaded));
});
</script>

<style lang="scss" scoped>
.terminal-page {
  padding-bottom: 6rem;
}

.lead {
  max-width: 75rem;
  margin-top: 1.5rem;
}

.terminal {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 2.5rem;
  margin-top: 3rem;

  @include respond(tab-port) {
    grid-template-columns: 1fr;
  }
}

.screen {
  position: relative;
  align-self: start;
  width: 100%;
  overflow: hidden;
  border: 2px solid var(--clr-dark-2);
  border-radius: 6px;
  background: #000;

  &__video,
  &__overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__video {
    object-fit: cover;
    transform: scaleX(-1);
  }

  &__cover {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 3rem;
    text-align: center;
    background: var(--clr-dark-2);

    p {
      max-width: 40rem;
    }

    progress {
      width: min(30rem, 100%);
      accent-color: var(--clr-primary);
    }
  }
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  font-size: 1.5rem;

  &__heading {
    padding: 0;
    font-size: 1.8rem;
    font-weight: 500;
  }
}

.prompt {
  min-height: 7rem;
  padding: 1.2rem 1.5rem;
  border-left: 4px solid currentColor;
  font-size: 2rem;
  line-height: 1.4;
  background: var(--clr-dark-2);

  &--neutral {
    color: var(--clr-text);
  }

  &--good {
    color: #7ee2a8;
  }

  &--warn {
    color: #ffd166;
  }

  &--bad {
    color: #ff8a80;
  }
}

.checks {
  display: grid;
  gap: 0.6rem;
  list-style: none;
}

.check {
  display: grid;
  grid-template-columns: auto 10rem 1fr;
  align-items: center;
  gap: 1rem;

  &__label {
    font-weight: 600;
  }

  &--waiting {
    color: var(--clr-grey);
  }

  &--pass .fyp-icon {
    color: #7ee2a8;
  }

  &--fail .fyp-icon,
  &--fail .check__value {
    color: #ff8a80;
  }
}

.settings {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.5rem;
}

.setting {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;

  input {
    width: 1.8rem;
    height: 1.8rem;
    accent-color: var(--clr-primary);
  }

  select {
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--clr-grey);
    border-radius: 3px;
    color: var(--clr-text);
    font: inherit;
    background: var(--clr-dark);
  }
}

.enroll {
  &__hint {
    margin: 0.4rem 0 1rem;
    color: var(--clr-grey);
  }

  &__row {
    display: flex;
    gap: 1rem;

    input {
      flex: 1;
      min-width: 0;
      padding: 0.8rem 1rem;
      border: 1px solid var(--clr-grey);
      border-radius: 3px;
      color: var(--clr-text);
      font: inherit;
      background: var(--clr-dark);

      &::placeholder {
        color: var(--clr-grey);
      }
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
}

.log ul {
  margin: 0.5rem 0 1rem;
  list-style: none;
}

.log p {
  margin: 0.5rem 0 1rem;
  color: var(--clr-grey);
}

.stop {
  align-self: flex-start;
}

.how {
  max-width: 75rem;
  margin-top: 6rem;

  ol {
    margin: 2rem 0 0 2.5rem;
  }

  li + li {
    margin-top: 1rem;
  }
}

.warning {
  margin-top: 2rem;
  color: #ffd166;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
