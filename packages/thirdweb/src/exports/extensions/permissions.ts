//--------------------------------------------------
// Permissions
// --------------------------------------------------------

// READ
export {
  hasRole,
  type HasRoleParams,
  isHasRoleSupported,
} from "../../extensions/permissions/read/hasRole.js";
export {
  getRoleAdmin,
  type GetRoleAdminParams,
  isGetRoleAdminSupported,
} from "../../extensions/permissions/read/getRoleAdmin.js";

// WRITE
export {
  grantRole,
  type GrantRoleParams,
  isGrantRoleSupported,
} from "../../extensions/permissions/write/grantRole.js";
export {
  revokeRole,
  type RevokeRoleParams,
  isRevokeRoleSupported,
} from "../../extensions/permissions/write/revokeRole.js";
export {
  renounceRole,
  type RenounceRoleParams,
  isRenounceRoleSupported,
} from "../../extensions/permissions/write/renounceRole.js";

// EVENTS
export {
  roleGrantedEvent,
  type RoleGrantedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleGranted.js";
export {
  roleRevokedEvent,
  type RoleRevokedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleRevoked.js";
export {
  roleAdminChangedEvent,
  type RoleAdminChangedEventFilters,
} from "../../extensions/permissions/__generated__/IPermissions/events/RoleAdminChanged.js";

// --------------------------------------------------------
// PermissionsEnumerable
// --------------------------------------------------------

// READ
export {
  getRoleMember,
  type GetRoleMemberParams,
  isGetRoleMemberSupported,
} from "../../extensions/permissions/read/getRoleMember.js";
export {
  getRoleMemberCount,
  type GetRoleMemberCountParams,
  isGetRoleMemberCountSupported,
} from "../../extensions/permissions/read/getRoleMemberCount.js";
export {
  getAllRoleMembers,
  type GetAllRoleMembersParams,
  isGetAllRoleMembersSupported,
} from "../../extensions/permissions/read/getAllMembers.js";

// --------------------------------------------------------
// Utils
// --------------------------------------------------------
export { roleMap, getRoleHash } from "../../extensions/permissions/utils.js";
