export declare class AssetAssignmentService {
    private static _resolvedMappingListName;
    private static _mappingListFieldsEnsured;
    static getMappingList(): Promise<any>;
    private static _ensureMappingListFields;
    private static _resolveMappingPayload;
    private static _writeToMappingList;
    static assignAssetsToEmployee(assetIds: string[], employeeName: string, employeeEmail: string, adminName: string, employeeId?: string, comment?: string): Promise<void>;
    static syncExistingAssignmentsToMappingList(adminName: string): Promise<{
        checkedCount: number;
        syncedCount: number;
    }>;
    static diagnoseMappingListFields(): Promise<string>;
}
//# sourceMappingURL=AssetAssignmentService.d.ts.map