<template>
  <div class="page">
    <FypLoading :loading="loading" />
    <form class="user-form" @submit.prevent="submitForm">
      <div class="form-header">
        <h2>Edit Profile</h2>
      </div>
      <label class="photo">
        <img :src="image || placeholder" alt="" />
        <span class="photo__hint">{{ image ? 'Change photo' : 'Add photo' }}</span>
        <input class="visually-hidden" type="file" accept="image/*" @change="loadImage" />
      </label>
      <div class="spacer">
        <FypFormInput id="email" v-model="email" label="Email address" type="email" disabled />
        <FypFormInput id="fname" v-model="firstName" label="First Name" type="text" autocomplete="given-name" />
        <FypFormInput id="lname" v-model="lastName" label="Last Name" type="text" autocomplete="family-name" />
        <p class="note">
          The access terminal recognizes you from this photo, so use a clear, front-on photo of your face without a mask.
        </p>
        <p v-if="message" class="message" :class="{ error: isError }" role="status">{{ message }}</p>
        <FypFormButton>Update Profile</FypFormButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import FypFormButton from '~/components/Pages/Fyp/FypFormButton.vue';
import FypFormInput from '~/components/Pages/Fyp/FypFormInput.vue';
import FypLoading from '~/components/Pages/Fyp/FypLoading.vue';
import { updateUser } from '~/utils/fyp/db';

definePageMeta({ title: 'User Profile' });

// the upload icon from the original's public folder, inlined
const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23f2f2f2'/%3E%3Cpath fill='%235c5c5c' d='M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m8 3a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z' transform='translate(4 4) scale(.67)'/%3E%3C/svg%3E";
const MAX_PHOTO_SIZE = 480;

const { user, refresh } = useFypUser();
const loading = ref(false);
const email = ref(user.value.email);
const firstName = ref(user.value.first_name);
const lastName = ref(user.value.last_name);
const image = ref(user.value.image);
const message = ref('');
const isError = ref(false);

// the original uploaded the file to S3; here it's shrunk and kept as a data URL
const loadImage = async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_PHOTO_SIZE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    image.value = canvas.toDataURL('image/jpeg', 0.85);
    message.value = '';
  } catch {
    isError.value = true;
    message.value = "That file couldn't be read as an image.";
  }
};

const submitForm = async () => {
  loading.value = true;
  try {
    await updateUser(user.value.user_id, { first_name: firstName.value, last_name: lastName.value, image: image.value });
    await refresh();
    isError.value = false;
    message.value = 'Profile updated.';
  } catch (error) {
    isError.value = true;
    message.value = error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page {
  max-width: 70rem;
  padding-top: 3rem;
}

.user-form {
  position: relative;
  border-radius: 6px;
  background: var(--clr-neutral-100);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);

  .form-header {
    position: absolute;
    top: 0;
    left: 1em;
    right: 1em;
    padding: 1em;
    border-radius: 3px;
    color: #fff;
    background: linear-gradient(60deg, var(--clr-primary-600) 50%, var(--clr-primary-800));
    box-shadow:
      0 4px 20px 0 rgb(0 0 0 / 14%),
      0 7px 10px -5px rgb(156 39 176 / 40%);
    transform: translateY(-50%);

    h2 {
      padding: 0;
      font-size: 2.2rem;
      font-weight: 600;
      font-family: inherit;
      line-height: 1.3;
    }
  }

  .spacer {
    display: flex;
    flex-direction: column;
    padding: 4rem calc(var(--spacer) * 1.2) calc(var(--spacer) * 1.2);
  }
}

.photo {
  position: absolute;
  top: 0;
  right: 3rem;
  z-index: 1;
  width: 110px;
  height: 110px;
  border: 4px solid var(--clr-neutral-100);
  border-radius: 50%;
  overflow: hidden;
  background: var(--clr-neutral-200);
  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
  cursor: pointer;
  transform: translateY(-30%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__hint {
    position: absolute;
    inset: auto 0 0;
    padding: 0.2rem 0 0.6rem;
    font-size: 1.2rem;
    text-align: center;
    color: #fff;
    background: rgb(0 0 0 / 70%);
  }

  &:focus-within {
    outline: 3px solid var(--clr-focus);
    outline-offset: 2px;
  }
}

.note {
  margin-top: var(--spacer);
  font-size: 1.4rem;
  color: var(--clr-neutral-500);
}

.message {
  margin-top: var(--spacer);
  color: var(--clr-success);

  &.error {
    color: var(--clr-danger);
  }
}
</style>
