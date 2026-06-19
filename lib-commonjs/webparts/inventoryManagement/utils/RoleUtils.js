"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleUtils = void 0;
exports.RoleUtils = {
    getRoleLevel: (role) => {
        switch (role) {
            case 'Admin':
                return 2;
            case 'Inventory Manager':
                return 1;
            case 'Inventory Employee':
                return 0;
            default:
                return 0;
        }
    },
    canAddAssets: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canApproveRequests: (role) => {
        return role === 'Inventory Manager' || role === 'Admin';
    },
    canViewAuditLogs: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canAssignAssets: (role) => {
        return role === 'Admin' || role === 'Inventory Manager';
    },
    canManageUsers: (role) => {
        return role === 'Admin';
    },
    canAccessReports: (role) => {
        return role === 'Admin';
    },
    canAccessConfig: (role) => {
        return role === 'Admin';
    },
    isAdmin: (role) => {
        return role === 'Admin';
    },
    isManager: (role) => {
        return role === 'Inventory Manager';
    },
    isEmployee: (role) => {
        return role === 'Inventory Employee';
    },
    hasPermission: (role, minRequiredRole) => {
        return exports.RoleUtils.getRoleLevel(role) >= exports.RoleUtils.getRoleLevel(minRequiredRole);
    },
    getRoleDisplayName: (role) => {
        return role;
    }
};
//# sourceMappingURL=RoleUtils.js.map