export type UserRole = 'Admin' | 'Inventory Manager' | 'Inventory Employee';
export declare const RoleUtils: {
    getRoleLevel: (role: UserRole) => number;
    canAddAssets: (role: UserRole) => boolean;
    canApproveRequests: (role: UserRole) => boolean;
    canViewAuditLogs: (role: UserRole) => boolean;
    canAssignAssets: (role: UserRole) => boolean;
    canManageUsers: (role: UserRole) => boolean;
    canAccessReports: (role: UserRole) => boolean;
    canAccessConfig: (role: UserRole) => boolean;
    isAdmin: (role: UserRole) => boolean;
    isManager: (role: UserRole) => boolean;
    isEmployee: (role: UserRole) => boolean;
    hasPermission: (role: UserRole, minRequiredRole: UserRole) => boolean;
    getRoleDisplayName: (role: UserRole) => string;
};
//# sourceMappingURL=RoleUtils.d.ts.map