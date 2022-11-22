export const signOut = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '/sign-in';
};
