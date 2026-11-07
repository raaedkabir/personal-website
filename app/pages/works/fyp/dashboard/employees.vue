<template>
  <div class="page">
    <FypLoading :loading="loading" />
    <FypAddUser v-if="addingUser" @close="addingUser = false" @added="loadUsers" />
    <FypFormButton type="button" variant="secondary" class="add-new" @click="addingUser = true">Add Employee</FypFormButton>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th scope="col"><span class="visually-hidden">Photo</span></th>
            <th scope="col">Email Address</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Last Checked In</th>
            <th scope="col"><span class="visually-hidden">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.user_id">
            <td>
              <img v-if="row.image" class="avatar" :src="row.image" :alt="`Photo of ${fullName(row) || row.email}`" />
              <span v-else class="avatar avatar--empty" role="img" aria-label="No photo">?</span>
            </td>
            <td data-th="Email Address">
              {{ row.email }}
              <span v-if="row.is_admin" class="tag">Admin</span>
            </td>
            <td data-th="First Name">{{ row.first_name }}</td>
            <td data-th="Last Name">{{ row.last_name }}</td>
            <td data-th="Last Checked In">{{ lastCheckIns.get(row.user_id) ?? 'Never' }}</td>
            <td class="actions">
              <button
                v-if="row.user_id !== user.user_id"
                type="button"
                class="delete"
                :aria-label="`Delete ${row.email}`"
                @click="remove(row)"
              >
                <FypIcon :path="mdiDelete" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { mdiDelete } from '@mdi/js';
import FypAddUser from '~/components/Pages/Fyp/FypAddUser.vue';
import FypFormButton from '~/components/Pages/Fyp/FypFormButton.vue';
import FypIcon from '~/components/Pages/Fyp/FypIcon.vue';
import FypLoading from '~/components/Pages/Fyp/FypLoading.vue';
import { deleteUser, fullName, getAttendance, getUsers } from '~/utils/fyp/db';
import { formatDateTime } from '~/utils/fyp/format';

definePageMeta({ title: 'Employees', admin: true });

const { user, refresh } = useFypUser();
const loading = ref(false);
const rows = ref([]);
const lastCheckIns = ref(new Map());
const addingUser = ref(false);

const loadUsers = async () => {
  loading.value = true;
  try {
    const [users, attendance] = await Promise.all([getUsers(), getAttendance()]);
    rows.value = users;
    // attendance comes newest first, so the first row per user is their latest
    const latest = new Map();
    for (const row of attendance) {
      if (row.user_id !== null && !latest.has(row.user_id)) latest.set(row.user_id, formatDateTime(row.datetime));
    }
    lastCheckIns.value = latest;
  } finally {
    loading.value = false;
  }
};

const remove = async (row) => {
  if (!confirm(`Delete ${row.email} and their attendance records?`)) return;
  loading.value = true;
  await deleteUser(row.user_id);
  await Promise.all([loadUsers(), refresh()]);
};

onMounted(loadUsers);
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  max-width: 100rem;
}

.add-new {
  align-self: flex-end;
  margin-top: 0;
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
    vertical-align: middle;
  }

  th {
    font-weight: 600;
    color: #fff;
    background: var(--clr-primary-600);
  }

  tbody tr {
    border-top: 1px solid var(--clr-neutral-300);
  }

  // the original's responsive table: one card per employee on phones
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
      }
    }
  }
}

.avatar {
  display: block;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;

  &--empty {
    display: grid;
    place-items: center;
    font-weight: 600;
    color: var(--clr-neutral-500);
    background: var(--clr-neutral-200);
  }
}

.tag {
  margin-left: 0.5rem;
  padding: 0 0.6rem;
  border-radius: 3px;
  font-size: 1.2rem;
  color: #fff;
  background: var(--clr-secondary-400);
}

.actions {
  text-align: right;
}

.delete {
  display: inline-grid;
  place-items: center;
  width: 4rem;
  height: 4rem;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--clr-danger);
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 8%);
  }
}
</style>
