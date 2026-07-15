export interface IEventLog {
    id: string;
    title: string;
    action: string;
    entityType: 'Asset' | 'Request';
    entityId: string;
    assetName?: string;
    details: string;
    user: string;
    timestamp: string;
}
export interface IAuditLogFilters {
    searchQuery: string;
    dateRangeType: 'All' | 'Today' | 'Yesterday' | 'Last7' | 'Last15' | 'Last30' | 'Last60' | 'Last90' | 'ThisWeek' | 'ThisMonth' | 'Custom';
    startDate?: Date;
    endDate?: Date;
    action: string;
    module: string;
    assetType: string;
    user: string;
    status: string;
    sortOrder: 'NewestFirst' | 'OldestFirst' | 'AssetNameAZ' | 'AssetNameZA' | 'UserAZ' | 'UserZA';
}
//# sourceMappingURL=IEventLog.d.ts.map