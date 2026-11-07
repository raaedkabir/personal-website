import { getNotifications, getSession, getUser } from '~/utils/fyp/db';

// the FYP dashboard's logged-in user, shared by its shell and pages
export const useFypUser = () => {
  const user = useState('fyp-user', () => null);
  const notifications = useState('fyp-notifications', () => []);

  // reads the session from localStorage, so only call it in the browser
  const refresh = async () => {
    const userId = getSession();
    user.value = userId === null ? null : await getUser(userId);
    notifications.value = user.value ? await getNotifications(user.value) : [];
    return user.value;
  };

  return { user, notifications, refresh };
};
