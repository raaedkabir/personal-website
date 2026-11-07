<template>
  <div class="page">
    <FypLoading :loading="loading" />
    <p class="intro">
      {{ user.is_admin ? 'Every check-in' : 'Your check-ins' }} recorded by the access terminals, newest first. Entries with no
      mask or a temperature over {{ FEVER_THRESHOLD }} °C are flagged.
    </p>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th v-if="user.is_admin" scope="col">Employee</th>
            <th scope="col">Branch</th>
            <th scope="col">Temperature</th>
            <th scope="col">Mask</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td data-th="Time">{{ formatDateTime(row.datetime) }}</td>
            <td v-if="user.is_admin" data-th="Employee">{{ names.get(row.user_id) ?? 'Visitor' }}</td>
            <td data-th="Branch">{{ row.branch }}</td>
            <td data-th="Temperature" :class="{ bad: isFever(row) }">{{ formatTemperature(row.temperature) }}</td>
            <td data-th="Mask" :class="{ bad: !row.mask }">{{ row.mask ? 'Yes' : 'No' }}</td>
            <td data-th="Status">
              <span class="status" :class="isCompliant(row) ? 'status--ok' : 'status--flagged'">
                {{ isCompliant(row) ? 'Verified' : 'Flagged' }}
              </span>
            </td>
          </tr>
          <tr v-if="!loading && !rows.length">
            <td :colspan="user.is_admin ? 6 : 5">No check-ins yet. Use the access terminal to add one.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import FypLoading from '~/components/Pages/Fyp/FypLoading.vue';
import { FEVER_THRESHOLD, fullName, getAttendance, getUsers, isCompliant, isFever } from '~/utils/fyp/db';
import { formatDateTime, formatTemperature } from '~/utils/fyp/format';

definePageMeta({ title: 'Attendance' });

const { user } = useFypUser();
const loading = ref(true);
const rows = ref([]);
const names = ref(new Map());

onMounted(async () => {
  try {
    const admin = user.value.is_admin;
    const [attendance, users] = await Promise.all([
      getAttendance(admin ? {} : { userId: user.value.user_id }),
      admin ? getUsers() : [],
    ]);
    rows.value = attendance;
    names.value = new Map(users.map((account) => [account.user_id, fullName(account) || account.email]));
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.page {
  max-width: 100rem;
}

.intro {
  max-width: 70rem;
}

.table-wrapper {
  margin-top: 2rem;
  overflow-x: auto;
  border-radius: 6px;
  background: var(--clr-neutral-100);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
}

.table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 1rem 1.5rem;
    text-align: left;
  }

  th {
    font-weight: 600;
    color: #fff;
    background: var(--clr-primary-600);
  }

  tbody tr {
    border-top: 1px solid var(--clr-neutral-300);
  }

  .bad {
    font-weight: 600;
    color: var(--clr-danger);
  }

  @include respond(phone) {
    thead {
      display: none;
    }

    tr {
      display: block;
      padding: 1rem 0;
    }

    td {
      display: block;
      padding: 0.2rem 1.5rem;

      &[data-th]::before {
        content: attr(data-th) ': ';
        font-weight: 600;
        color: var(--clr-neutral-700);
      }
    }
  }
}

.status {
  padding: 0.2rem 0.8rem;
  border-radius: 3px;
  font-size: 1.4rem;
  color: #fff;

  &--ok {
    background: var(--clr-success);
  }

  &--flagged {
    background: var(--clr-danger);
  }
}
</style>
