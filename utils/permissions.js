import { config } from '../config.js';

export const isAdmin = (member) => {
  if (!member) return false;
  return member.roles.cache.has(config.adminRoleId) || member.permissions.has('Administrator');
};

export const isSeller = (member) => {
  if (!member) return false;
  return member.roles.cache.has(config.sellerRoleId) || isAdmin(member);
};

export const isMember = (member) => {
  return member && !member.user.bot;
};

export const checkPermission = (member, requiredRole = 'member') => {
  if (requiredRole === 'admin') {
    return isAdmin(member);
  }
  if (requiredRole === 'seller') {
    return isSeller(member);
  }
  return isMember(member);
};

export default {
  isAdmin,
  isSeller,
  isMember,
  checkPermission,
};
