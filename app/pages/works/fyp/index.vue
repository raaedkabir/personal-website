<template>
  <main class="container pt-12 fyp">
    <p class="date text-center">2021 · Final year project</p>
    <h1 class="heading__primary text-center">Face Recognition Attendance System <span>_</span></h1>
    <p class="subtitle text-center">
      My Electrical &amp; Electronic Engineering thesis at Universiti Putra Malaysia: an automatic employee attendance and
      COVID-19 SOP compliance system using face recognition
    </p>

    <section class="prose">
      <p>
        During the pandemic, getting into an office meant queuing for a guard to take your temperature and check your mask
        before you clocked in on a shared fingerprint scanner. My final year project replaced all of it with one contactless
        terminal. It checks that you're wearing a mask, recognizes you with the mask on, scans your temperature and records
        your attendance, and administrators manage the records from a web dashboard.
      </p>
      <p>Both halves run here in your browser, with the same neural networks as in 2021.</p>
    </section>

    <div class="demos">
      <NuxtLink class="demo" to="/works/fyp/terminal">
        <FypIcon :path="mdiCctv" class="demo__icon" />
        <h2 class="demo__title">Access terminal</h2>
        <p>Check in with your webcam: mask detection, masked face recognition and a simulated temperature scan.</p>
        <span class="demo__cta">Try the terminal <span aria-hidden="true">→</span></span>
      </NuxtLink>
      <NuxtLink class="demo" to="/works/fyp/login">
        <FypIcon :path="mdiViewDashboard" class="demo__icon" />
        <h2 class="demo__title">Admin dashboard</h2>
        <p>Manage employees and photos, and review attendance and SOP alerts, as the administrator or an employee.</p>
        <span class="demo__cta">Open the dashboard <span aria-hidden="true">→</span></span>
      </NuxtLink>
    </div>

    <section class="prose">
      <h2 class="heading__sub-section">How it worked <span>_</span></h2>
      <ol class="steps">
        <li>
          When the Raspberry Pi powered on, the terminal downloaded every employee's photo from S3 and computed a face
          encoding for each.
        </li>
        <li>
          An SSD object detector found the faces in each camera frame and classified each as masked or not. Without a mask,
          the speaker said "Please put your mask on".
        </li>
        <li>
          A FaceNet network compared the masked face with the employees' encodings. The closest one within a distance of 0.8
          was the match.
        </li>
        <li>An AMG8833 thermal camera read their temperature. Over 37 °C, the speaker warned them.</li>
        <li>
          Otherwise it said "Verified" and wrote the employee's ID, temperature and the time to a PostgreSQL database.
        </li>
      </ol>
      <p>
        Administrators added employees, and employees uploaded their photos, in a Vue 3 and TypeScript dashboard served
        from S3 and CloudFront. It talked to PostgreSQL on RDS through an Express API on AWS Lambda. The terminal itself was
        Python, with OpenCV and TensorFlow.
      </p>
    </section>

    <section class="prose">
      <h2 class="heading__sub-section">Recognizing faces behind masks <span>_</span></h2>
      <p>
        Face recognition systems of the time relied on features like the nose, mouth and jawline, and often failed once a
        mask covered them. Few photos of masked faces existed, so I made my own: using facial landmarks from Dlib, I
        superimposed face masks on photos from CASIA-WebFace, a public dataset of 494,414 photos of 10,575 people. Then I
        retrained FaceNet's Inception-ResNet-v1 network on a mix of masked and unmasked faces.
      </p>
      <div class="table-wrapper">
        <table>
          <caption>
            Correct matches for 10,000 faces with masks, against the same people's unmasked photos
          </caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col">Trained on</th>
              <th scope="col">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">My retrained FaceNet</th>
              <td>CASIA-WebFace, with and without masks</td>
              <td>99.9%</td>
            </tr>
            <tr>
              <th scope="row">FaceNet 20180402-114759</th>
              <td>VGGFace2</td>
              <td>60.7%</td>
            </tr>
            <tr>
              <th scope="row">FaceNet 20180408-102900</th>
              <td>CASIA-WebFace</td>
              <td>45.2%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The test faces had the same synthetic masks as the training data and no changes in lighting, so real-world accuracy
        is lower. It still recognized me with and without a mask, as in this recording from August 2021:
      </p>
      <figure>
        <video :src="recording" controls muted playsinline preload="metadata" />
        <figcaption>
          The terminal's preview window: my name and embedding distance above each box, then the mask class and its
          confidence. The box turns green when the mask goes on. The clip has no sound.
        </figcaption>
      </figure>
      <p>Mask detection used AIZOOTech's open-source SSD model. Not everything held up:</p>
      <ul>
        <li>
          The mask detector looks for something mask-sized over the lower half of the face, so a hand over your mouth passes
          too.
        </li>
        <li>
          The thermal camera read 28.5–30.5 °C for foreheads a thermometer put at 36.4–36.7 °C, too far off to screen for a
          fever.
        </li>
        <li>The terminal recomputed every face encoding each time it started, instead of storing them.</li>
      </ul>
    </section>

    <section class="prose">
      <h2 class="heading__sub-section">Rebuilding it for the web <span>_</span></h2>
      <p>The demo runs on this static site, so a few parts changed:</p>
      <ul>
        <li>
          Both networks are the originals. I stripped the training-only operations from the face recognition graph,
          converted both TensorFlow 1 graphs to TensorFlow.js and quantized their weights, from 102 MB to 25 MB. On frames
          from the recording above, the browser finds the same faces, mask classes and matches as the original Python code,
          with boxes within a pixel and match distances within 0.02.
        </li>
        <li>
          The Lambda API and PostgreSQL database are replaced by a copy in your browser's storage, with the same tables,
          routes and error messages. Your photo and check-ins never leave your device.
        </li>
        <li>
          The temperature is simulated, and the branch map uses OpenStreetMap instead of Google Maps. The terminal also
          caches face encodings now.
        </li>
        <li>
          I finished what the 2021 dashboard left as to-dos: an attendance and SOP compliance log, deleting employees, and
          links from each branch on the map to its terminal. I also fixed its accessibility problems, like low-contrast text
          and controls that only worked with a mouse.
        </li>
      </ul>
      <p>
        <AppLink href="https://github.com/raaedkabir/FYP-Dashboard-App" target="_blank" rel="noopener noreferrer">
          The 2021 dashboard's source on GitHub
        </AppLink>
      </p>
    </section>
  </main>
</template>

<script setup>
import { mdiCctv, mdiViewDashboard } from '@mdi/js';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';

useHead({ title: 'Face Recognition Attendance System' });

const recording = 'https://raaedkabir-assets.s3.amazonaws.com/fyp/terminal-2021.mp4';
</script>

<style lang="scss" scoped>
.fyp {
  padding-bottom: 8rem;
}

.date {
  margin-bottom: 2rem;
  text-transform: uppercase;
}

.subtitle {
  max-width: 70rem;
  margin: 2rem auto 0;
  color: var(--clr-grey);
}

.prose {
  max-width: 75rem;
  margin: 5rem auto 0;
  font-size: 1.8rem;

  > * + * {
    margin-top: 2rem;
  }

  ul,
  ol {
    margin-left: 2.5rem;
  }

  li + li {
    margin-top: 1rem;
  }

  ul li {
    list-style-image: url("data:image/svg+xml,%3Csvg width='8' height='8' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle fill='%2366fcf1' cx='4' cy='4' r='4'/%3E%3C/svg%3E");
  }

  .steps li::marker {
    color: var(--clr-primary);
    font-weight: 600;
  }
}

.demos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
  gap: 3rem;
  max-width: 90rem;
  margin: 5rem auto 0;
}

.demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem;
  border: 2px solid var(--clr-dark-2);
  color: inherit;
  text-decoration: none;
  background: var(--clr-dark-2);
  transition: all 0.2s ease;

  &:hover,
  &:focus-visible {
    border-color: var(--clr-primary);
    transform: scale(1.02);
  }

  &__icon {
    width: 4.8rem;
    height: 4.8rem;
    color: var(--clr-primary);
  }

  &__title {
    padding: 0;
    font-size: 2.8rem;
    font-weight: 400;
  }

  &__cta {
    margin-top: auto;
    padding-top: 1rem;
    font-weight: 600;
    color: var(--clr-primary);
  }
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.6rem;

  caption {
    margin-bottom: 1rem;
    color: var(--clr-grey);
    text-align: left;
  }

  th,
  td {
    padding: 1rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid var(--clr-dark-2);
  }

  thead th {
    color: var(--clr-primary);
  }

  tbody tr:first-child {
    background: var(--clr-dark-2);
  }

  td:last-child {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
}

figure {
  video {
    display: block;
    width: 100%;
    max-width: 64rem;
    margin: 0 auto;
    aspect-ratio: 4 / 3;
    background: #000;
  }

  figcaption {
    max-width: 64rem;
    margin: 1rem auto 0;
    font-size: 1.5rem;
    color: var(--clr-grey);
  }
}
</style>
