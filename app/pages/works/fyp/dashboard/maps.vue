<template>
  <div class="page">
    <section class="map-card" aria-labelledby="branches-title">
      <h2 id="branches-title" class="map-card__title">Branches</h2>
      <div ref="map" class="map" />
    </section>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Branch</th>
            <th scope="col">Check-ins today</th>
            <th scope="col">Access terminal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="branch in BRANCHES" :key="branch.id">
            <td>{{ branch.name }}</td>
            <td>{{ checkIns[branch.id] ?? 0 }}</td>
            <td>
              <NuxtLink :to="terminalLink(branch)">View the {{ branch.name }} terminal</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// the original showed the branches on Google Maps; this uses Leaflet and OpenStreetMap tiles, which need no API key
import { BRANCHES, getAttendance } from '~/utils/fyp/db';
import { isToday } from '~/utils/fyp/format';

definePageMeta({ title: 'Maps', admin: true });

const map = ref(null);
const checkIns = ref({});
let leafletMap = null;
let isUnmounted = false;

const terminalLink = (branch) => `/works/fyp/terminal?branch=${branch.id}`;

onMounted(async () => {
  const counts = {};
  for (const row of await getAttendance()) {
    if (isToday(row.datetime)) counts[row.branch] = (counts[row.branch] ?? 0) + 1;
  }
  checkIns.value = counts;

  // Leaflet needs window, so it is loaded in the browser only
  const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
  if (isUnmounted) return;

  leafletMap = L.map(map.value, { scrollWheelZoom: false }).setView([BRANCHES[0].lat, BRANCHES[0].lng], 10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(leafletMap);

  for (const branch of BRANCHES) {
    // lettered markers, like the original's
    const icon = L.divIcon({ className: 'branch-marker', html: `<span>${branch.id}</span>`, iconSize: [32, 32], iconAnchor: [16, 32] });
    const popup = document.createElement('div');
    const title = document.createElement('p');
    title.className = 'branch-popup__title';
    title.textContent = branch.name;
    const link = document.createElement('a');
    link.href = terminalLink(branch);
    link.textContent = 'View access terminal';
    // navigate inside the app instead of reloading the page
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigateTo(terminalLink(branch));
    });
    popup.append(title, link);
    L.marker([branch.lat, branch.lng], { icon, title: branch.name, alt: branch.name }).bindPopup(popup).addTo(leafletMap);
  }
});

onBeforeUnmount(() => {
  isUnmounted = true;
  leafletMap?.remove();
  leafletMap = null;
});
</script>

<style lang="scss" scoped>
.page {
  max-width: 100rem;
}

.map-card {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);

  &__title {
    position: absolute;
    top: 1rem;
    left: 50%;
    z-index: 1000;
    padding: 0.2rem 1.5rem;
    border-radius: 3px;
    font-size: 2.2rem;
    font-weight: 600;
    font-family: inherit;
    background: rgb(255 255 255 / 90%);
    transform: translateX(-50%);
    pointer-events: none;
  }
}

.map {
  height: 45rem;
  background: var(--clr-neutral-200);

  // OpenStreetMap's tiles are light, so the default link blue on white is fine, but keep it dark enough for AA
  :deep(.leaflet-control-attribution a) {
    color: #0050a0;
  }

  :deep(.branch-marker) {
    display: grid;
    place-items: center;
    border: 2px solid #fff;
    border-radius: 50% 50% 50% 0;
    font-weight: 700;
    color: #fff;
    background: var(--clr-danger);
    box-shadow: 0 2px 6px rgb(0 0 0 / 35%);
    transform: rotate(-45deg);

    span {
      font-size: 1.5rem;
      transform: rotate(45deg);
    }
  }

  :deep(.branch-popup__title) {
    margin: 0 0 0.4rem;
    font-size: 1.6rem;
    font-weight: 700;
  }
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

  a {
    color: var(--clr-primary-600);
  }
}
</style>
