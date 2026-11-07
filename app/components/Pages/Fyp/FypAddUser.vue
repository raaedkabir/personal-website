<template>
  <dialog ref="dialog" class="dialog" aria-labelledby="add-user-title" @close="$emit('close')">
    <FypLoading :loading="loading" />
    <form @submit.prevent="submit">
      <div class="dialog__header">
        <h2 id="add-user-title">Add Employee</h2>
        <button type="button" class="close" aria-label="Close" @click="dialog.close()">
          <FypIcon :path="mdiClose" />
        </button>
      </div>
      <div class="spacer">
        <FypFormInput id="new-email" v-model="email" label="Email Address" type="email" autocomplete="off" required />
        <FypFormInput
          id="new-password"
          v-model="password"
          label="Temporary Password"
          type="password"
          autocomplete="new-password"
          minlength="8"
          required
        />
        <FypFormInput id="new-fname" v-model="firstName" label="First Name (Optional)" type="text" autocomplete="off" />
        <FypFormInput id="new-lname" v-model="lastName" label="Last Name (Optional)" type="text" autocomplete="off" />
        <div class="checkbox">
          <input id="new-admin" v-model="isAdmin" type="checkbox" />
          <label for="new-admin">Administrator</label>
        </div>
        <p v-if="error" class="error" role="alert">Error adding user: {{ error }}</p>
        <FypFormButton>Submit</FypFormButton>
      </div>
    </form>
  </dialog>
</template>

<script setup>
// the original AddUser modal, as a native <dialog> so focus and Escape are handled
import { mdiClose } from '@mdi/js';
import FypFormButton from '~/components/Pages/Fyp/FypFormButton.vue';
import FypFormInput from '~/components/Pages/Fyp/FypFormInput.vue';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';
import FypLoading from '~/components/Pages/Fyp/FypLoading.vue';
import { newUser } from '~/utils/fyp/db';

const emit = defineEmits(['close', 'added']);

const dialog = ref(null);
const loading = ref(false);
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const isAdmin = ref(false);
const error = ref('');

onMounted(() => dialog.value.showModal());

const submit = async () => {
  loading.value = true;
  error.value = '';
  try {
    await newUser({
      email: email.value,
      password: password.value,
      is_admin: isAdmin.value,
      first_name: firstName.value,
      last_name: lastName.value,
    });
    emit('added');
    dialog.value.close();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.dialog {
  width: min(500px, calc(100% - 4rem));
  margin: auto;
  border: none;
  border-radius: 6px;
  color: inherit;
  background: var(--clr-neutral-100);
  box-shadow: 0 10px 40px rgb(0 0 0 / 30%);

  &::backdrop {
    background: rgb(0 0 0 / 60%);
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem calc(var(--spacer) * 1.2) 0;

    h2 {
      padding: 0;
      font-size: 2.2rem;
      font-weight: 600;
      font-family: inherit;
    }
  }
}

.close {
  display: grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border: none;
  border-radius: 50%;
  background: none;
  color: inherit;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 8%);
  }
}

.spacer {
  display: flex;
  flex-direction: column;
  padding: 0 calc(var(--spacer) * 1.2) var(--spacer);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: var(--spacer);

  input {
    width: 1.8rem;
    height: 1.8rem;
    accent-color: var(--clr-primary-600);
  }

  label {
    color: var(--clr-neutral-500);
    font-size: 1.4rem;
  }
}

.error {
  margin-top: var(--spacer);
  color: var(--clr-danger);
}
</style>
