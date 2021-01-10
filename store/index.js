export const state = () => ({
  displayNav: false,
});

export const mutations = {
  toggleNav(state) {
    state.displayNav = !state.displayNav;
  },

  closeNav(state) {
    state.displayNav = false;
  },
};
