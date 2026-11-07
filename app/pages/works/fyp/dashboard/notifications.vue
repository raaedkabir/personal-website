<template>
  <div class="page">
    <p v-if="!notifications.length" class="empty">No notifications.</p>
    <ul v-else class="alerts">
      <li v-for="item in notifications" :key="item.id" class="alert" :class="`alert--${item.type}`">
        <FypIcon :path="item.type === 'photo' ? mdiAlertCircle : item.row.mask ? mdiThermometerAlert : mdiFaceMaskOutline" />
        <div v-if="item.type === 'photo'">
          <p class="alert__text">Missing Photo</p>
          <p>
            The access terminal can't recognize you without one. Add it on your
            <NuxtLink to="/works/fyp/dashboard/user">User Profile</NuxtLink> or register at the
            <NuxtLink to="/works/fyp/terminal">access terminal</NuxtLink>.
          </p>
        </div>
        <div v-else>
          <p class="alert__text">
            {{ item.name ?? 'A visitor' }}:
            {{ item.row.mask ? `temperature of ${formatTemperature(item.row.temperature)}` : 'no mask' }}
          </p>
          <p>{{ formatDateTime(item.row.datetime) }} at {{ item.row.branch }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { mdiAlertCircle, mdiFaceMaskOutline, mdiThermometerAlert } from '@mdi/js';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';
import { formatDateTime, formatTemperature } from '~/utils/fyp/format';

definePageMeta({ title: 'Notifications' });

const { notifications } = useFypUser();
</script>

<style lang="scss" scoped>
.page {
  max-width: 80rem;
}

.alerts {
  display: grid;
  gap: 1rem;
  list-style: none;
}

.alert {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  border-radius: 3px;
  color: var(--clr-neutral-700);

  &__text {
    font-size: 1.8rem;
    font-weight: 600;
  }

  a {
    color: inherit;
  }

  .fyp-icon {
    margin-top: 0.4rem;
  }

  // the original's alert colours
  &--photo {
    background: #ffb3b3;
  }

  &--sop {
    background: #ffff99;
  }
}
</style>
