import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    meta: { title: 'Welcome!' },
    name: 'Home',
    component: Home
  },
  {
    path: '/components',
    meta: { title: 'Component Library' },
    name: 'Components',
    component: () => import('../views/Components.vue')
  },
  {
    path: '/works',
    meta: { title: 'My Works' },
    name: 'Works',
    component: () => import('../views/Works.vue')
  },
  {
    path: '/works/genarative_art',
    meta: { title: 'Genarative Art' },
    component: () => import('../components/Project/GenerativeArt.vue')
  },
  {
    path: '/:notFound(.*)',
    meta: { title: "Oops! Nothing's here :(" },
    component: () => import('../views/404.vue')
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // if previous position exits when pressing back button
    if (savedPosition) {
      return savedPosition;
    }

    return {
      left: 0,
      top: 0
    };
  }
});

const DEFAULT_TITLE = 'Raaed M. Kabir';

router.afterEach(to => {
  document.title = to.meta.title ? to.meta.title + ' | ' + DEFAULT_TITLE : DEFAULT_TITLE;
});

export default router;
