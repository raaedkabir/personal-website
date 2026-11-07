<template>
  <FypApp>
    <div class="layout">
      <nav class="sidebar" aria-label="Dashboard">
        <p class="sidebar__title">FYP Project</p>
        <hr />
        <ul v-if="user">
          <li v-for="link in links" :key="link.to">
            <NuxtLink class="list-item" :to="link.to">
              <FypIcon :path="link.icon" />
              <span>{{ link.label }}</span>
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink class="list-item terminal-link" to="/works/fyp/terminal">
          <FypIcon :path="mdiCctv" />
          <span>Access terminal</span>
        </NuxtLink>
      </nav>

      <div class="content">
        <header class="topbar">
          <h1 class="topbar__title">{{ route.meta.title }}</h1>
          <div v-if="user" class="topbar__actions">
            <NuxtLink
              class="action"
              to="/works/fyp/dashboard/notifications"
              :aria-label="`Notifications (${notifications.length})`"
            >
              <FypIcon :path="mdiBell" />
              <span v-if="notifications.length" class="badge" aria-hidden="true">{{ notifications.length }}</span>
            </NuxtLink>
            <button type="button" class="action" aria-label="Log out" @click="logout">
              <FypIcon :path="mdiLogout" />
            </button>
          </div>
        </header>
        <main class="main">
          <NuxtPage v-if="ready" />
          <p v-else class="checking">Checking your session…</p>
        </main>
      </div>
    </div>
  </FypApp>
</template>

<script setup>
import { mdiAccount, mdiAccountGroup, mdiBell, mdiCctv, mdiClipboardText, mdiLogout, mdiMapMarker, mdiViewDashboard } from '@mdi/js';
import FypApp from '~/components/Pages/Fyp/FypApp.vue';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';
import { clearSession } from '~/utils/fyp/db';

definePageMeta({ layout: 'empty' });

const route = useRoute();
const { user, notifications, refresh } = useFypUser();
const ready = ref(false);

useHead({ title: () => `${route.meta.title ?? 'Dashboard'} – FYP Dashboard` });

const links = computed(() =>
  [
    { to: '/works/fyp/dashboard', label: 'Home', icon: mdiViewDashboard },
    { to: '/works/fyp/dashboard/user', label: 'User Profile', icon: mdiAccount },
    { to: '/works/fyp/dashboard/employees', label: 'Employees', icon: mdiAccountGroup, admin: true },
    { to: '/works/fyp/dashboard/attendance', label: 'Attendance', icon: mdiClipboardText },
    { to: '/works/fyp/dashboard/notifications', label: 'Notifications', icon: mdiBell },
    { to: '/works/fyp/dashboard/maps', label: 'Maps', icon: mdiMapMarker, admin: true },
  ].filter((link) => !link.admin || user.value?.is_admin),
);

// the original's router guards: logged-out users go to the login page, employees can't open admin pages.
// The pages are prerendered without a user, so this runs in the browser once the session can be read.
const guard = async () => {
  const current = await refresh();
  if (!current) {
    ready.value = false;
    return navigateTo({ path: '/works/fyp/login', query: { redirect: route.fullPath } }, { replace: true });
  }
  if (route.meta.admin && !current.is_admin) return navigateTo('/works/fyp/dashboard', { replace: true });
  ready.value = true;
};

onMounted(guard);
watch(() => route.path, guard);

const logout = async () => {
  clearSession();
  await navigateTo('/works/fyp/login');
  // after leaving, so the page being left never renders without a user
  user.value = null;
};
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: calc(100vh - 4rem);

  @include respond(tab-port) {
    flex-direction: column;
  }
}

.sidebar {
  flex-shrink: 0;
  padding: 1em 2em;
  color: #fff;
  background: rgb(0 0 0 / 80%);

  &__title {
    font-size: 2.2rem;
    font-weight: 600;
  }

  hr {
    margin: 0.5em -0.75em 1em;
    border: 1px solid #fff;
  }

  ul {
    list-style: none;
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 10px;
    padding: 10px 35px 10px 15px;
    border-radius: 3px;
    color: currentColor;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background: rgb(255 255 255 / 10%);
    }

    &.router-link-exact-active {
      background: var(--clr-primary-600);
      box-shadow:
        0 12px 20px -10px rgb(0 172 193 / 28%),
        0 4px 20px 0 rgb(0 0 0 / 12%),
        0 7px 8px -5px rgb(0 172 193 / 20%);
    }

    &:focus-visible {
      outline-color: #fff;
    }
  }

  .terminal-link {
    margin-top: 3rem;
    border: 1px solid rgb(255 255 255 / 40%);
  }

  // a scrolling strip of links on narrow screens
  @include respond(tab-port) {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    overflow-x: auto;

    &__title,
    hr {
      display: none;
    }

    ul {
      display: flex;
      gap: 0.5rem;
    }

    .list-item {
      margin: 0;
      padding: 0.6rem 1.2rem;
      white-space: nowrap;
    }

    .terminal-link {
      margin: 0 0 0 auto;
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem 2rem;
  margin-bottom: 3rem;

  &__title {
    padding: 0;
    font-size: 3.2rem;
    font-weight: 300;
    font-family: inherit;
  }

  &__actions {
    display: flex;
    gap: 1rem;
  }
}

.action {
  position: relative;
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--clr-neutral-700);
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 8%);
  }
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 10px;
  font-size: 1.2rem;
  line-height: 20px;
  text-align: center;
  color: #fff;
  background: var(--clr-danger);
}

.main {
  flex: 1;
  min-height: 0;
  padding: 0 2rem 4rem;
}

.checking {
  color: var(--clr-neutral-500);
}
</style>
