<template>
  <div class="home">
    <h2 class="welcome">Welcome {{ fullName(user) }}!</h2>

    <div class="cards">
      <section class="card">
        <h3>Your last check-in</h3>
        <p v-if="lastCheckIn" class="big">{{ formatDateTime(lastCheckIn.datetime) }}</p>
        <p v-else class="big">None yet</p>
        <p v-if="lastCheckIn">
          {{ formatTemperature(lastCheckIn.temperature) }}, {{ lastCheckIn.mask ? 'mask on' : 'no mask' }}
        </p>
      </section>

      <template v-if="user.is_admin">
        <section class="card">
          <h3>Checked in today</h3>
          <p class="big">{{ checkedInToday }} of {{ employeeCount }}</p>
          <NuxtLink to="/works/fyp/dashboard/attendance">Attendance log</NuxtLink>
        </section>
        <section class="card">
          <h3>SOP alerts this week</h3>
          <p class="big">{{ alerts }}</p>
          <NuxtLink to="/works/fyp/dashboard/notifications">Notifications</NuxtLink>
        </section>
      </template>
    </div>

    <section class="card next">
      <h3>Try the access terminal</h3>
      <p v-if="!user.image && user.email === VISITOR_EMAIL">
        The terminal recognizes employees from their profile photos. Register your face at the terminal, or add a photo on
        your <NuxtLink to="/works/fyp/dashboard/user">User Profile</NuxtLink>, then check in with a mask on.
      </p>
      <p v-else-if="!user.image">
        The terminal recognizes employees from their profile photos. Add one on your
        <NuxtLink to="/works/fyp/dashboard/user">User Profile</NuxtLink>, then check in with a mask on.
      </p>
      <p v-else>Check in at the terminal with a mask on, and the record shows up here.</p>
      <NuxtLink to="/works/fyp/terminal">Open the access terminal</NuxtLink>
    </section>
  </div>
</template>

<script setup>
import { VISITOR_EMAIL, fullName, getAttendance, getUsers } from '~/utils/fyp/db';
import { formatDateTime, formatTemperature, isToday } from '~/utils/fyp/format';

definePageMeta({ title: 'Home' });

const { user, notifications } = useFypUser();
const lastCheckIn = ref(null);
const checkedInToday = ref(0);
const employeeCount = ref(0);
const alerts = computed(() => notifications.value.filter(({ type }) => type === 'sop').length);

onMounted(async () => {
  const [mine] = await getAttendance({ userId: user.value.user_id });
  lastCheckIn.value = mine ?? null;
  if (user.value.is_admin) {
    const [rows, users] = await Promise.all([getAttendance(), getUsers()]);
    checkedInToday.value = new Set(rows.filter((row) => row.user_id !== null && isToday(row.datetime)).map((row) => row.user_id)).size;
    employeeCount.value = users.length;
  }
});
</script>

<style lang="scss" scoped>
.welcome {
  padding: 0;
  font-size: 2.6rem;
  font-weight: 400;
  font-family: inherit;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  padding: 2rem;
  border-radius: 6px;
  background: var(--clr-neutral-100);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);

  h3 {
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--clr-neutral-500);
  }

  .big {
    font-size: 2.6rem;
    font-weight: 300;
  }

  a {
    color: var(--clr-primary-600);
  }
}

.next {
  max-width: 70rem;
  margin-top: 2rem;

  p {
    margin: 0.5rem 0 1rem;
  }
}
</style>
