export const checkAuth = (accessUserRole, permission) => {
  console.log(accessUserRole);
  if (
    !accessUserRole.includes(permission) &&
    !accessUserRole.includes('ADMIN') &&
    !accessUserRole.includes('SUPERADMIN')
  ) {
    throw Error('You dont have permission for this action.');
  }
};
