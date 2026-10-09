// whether the fullscreen navigation menu is open, shared by every navbar instance
export const useNav = () => {
  const displayNav = useState('displayNav', () => false);

  const toggleNav = () => {
    displayNav.value = !displayNav.value;
  };

  const closeNav = () => {
    displayNav.value = false;
  };

  return { displayNav, toggleNav, closeNav };
};
