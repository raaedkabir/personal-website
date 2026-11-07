<template>
  <FypApp>
    <FypLoading :loading="loading" />
    <main class="page">
      <form class="login-form" @submit.prevent="logIn()">
        <div class="form-header">
          <h1>Log In</h1>
        </div>
        <div class="spacer">
          <FypFormInput id="email" v-model="email" label="Email Address" type="email" autocomplete="username" required />
          <FypFormInput
            id="password"
            v-model="password"
            label="Password"
            type="password"
            autocomplete="current-password"
            required
          />
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <FypFormButton>Log In</FypFormButton>

          <div class="demo-accounts">
            <h2>Demo accounts</h2>
            <p>
              The password for both is <code>{{ DEMO_PASSWORD }}</code
              >.
            </p>
            <div class="demo-accounts__buttons">
              <FypFormButton type="button" @click="logIn(VISITOR_EMAIL)">You (administrator)</FypFormButton>
              <FypFormButton type="button" variant="secondary" @click="logIn(EMPLOYEE_EMAIL)">
                Daniel (employee)
              </FypFormButton>
            </div>
          </div>
        </div>
      </form>
    </main>
  </FypApp>
</template>

<script setup>
import FypApp from '~/components/Pages/Fyp/FypApp.vue';
import FypFormButton from '~/components/Pages/Fyp/FypFormButton.vue';
import FypFormInput from '~/components/Pages/Fyp/FypFormInput.vue';
import FypLoading from '~/components/Pages/Fyp/FypLoading.vue';
import { DEMO_PASSWORD, EMPLOYEE_EMAIL, VISITOR_EMAIL, getSession, login } from '~/utils/fyp/db';

definePageMeta({ layout: 'empty' });
useHead({ title: 'Log In – FYP Dashboard' });

const route = useRoute();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const next = () => {
  const redirect = String(route.query.redirect ?? '');
  return redirect.startsWith('/works/fyp/dashboard') ? redirect : '/works/fyp/dashboard';
};

// skip the form if already logged in
onMounted(() => {
  if (getSession() !== null) navigateTo(next(), { replace: true });
});

const logIn = async (demoEmail) => {
  if (demoEmail) {
    email.value = demoEmail;
    password.value = DEMO_PASSWORD;
  }
  loading.value = true;
  error.value = '';
  try {
    await login(email.value, password.value);
    await navigateTo(next(), { replace: true });
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 4rem);
  padding: 6rem 2rem 4rem;
  background: url('~/assets/images/works/fyp/login-bg.jpg') center / cover no-repeat;
}

.login-form {
  position: relative;
  width: 100%;
  max-width: 500px;
  border-radius: 6px;
  background: var(--clr-neutral-100);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);

  .spacer {
    display: flex;
    flex-direction: column;
    padding: calc(var(--spacer) * 1.2);
    padding-top: 4rem;
  }

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

    h1 {
      font-size: 2.4rem;
      font-weight: 600;
      line-height: 1.3;
    }
  }
}

.error {
  margin-top: var(--spacer);
  color: var(--clr-danger);
}

.demo-accounts {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--clr-neutral-300);

  h2 {
    padding: 0;
    font-size: 1.8rem;
    font-weight: 600;
  }

  code {
    padding: 0 0.4rem;
    border-radius: 3px;
    background: var(--clr-neutral-200);
  }

  &__buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0 1.5rem;
  }
}
</style>
