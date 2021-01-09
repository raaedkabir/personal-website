export const state = () => ({
  displayNav: false,
});

export const mutations = {
  toggleNav(state) {
    state.displayNav = !state.displayNav;
  },
};
