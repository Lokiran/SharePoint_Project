import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEventLog } from '../models/IEventLog';
import { IReturnRequest } from '../models/IReturnRequest';
export interface IReportsState {
    reportsSelectedTab: string;
    reportsAssetTypeFilter: string;
    /** 'All' or a status bucket key (inStock, assigned, pendingReturn, maintenance, retired, other). */
    reportsStatusFilter: string;
    items: IInventoryItem[];
    requests: IRequest[];
    /** For the asset details panel opened from a report row. */
    auditLogs: IEventLog[];
    returnRequests: IReturnRequest[];
    spContext: WebPartContext;
}
export interface IReportsActions {
    onTabChange: (tabKey: string) => void;
    onAssetTypeFilterChange: (type: string) => void;
    onStatusFilterChange: (status: string) => void;
    onExportDetailedReportToExcel: (filteredItems: IInventoryItem[]) => void;
    onExportDetailedReportToPDF: (filteredItems: IInventoryItem[]) => void;
    /** Exports the given rows; every asset when called without any. */
    onExportWarrantyReportToExcel: (filteredItems?: IInventoryItem[]) => void;
    onExportWarrantyReportToPDF: (filteredItems?: IInventoryItem[]) => void;
}
export interface IReportsPageProps {
    state: IReportsState;
    actions: IReportsActions;
}
//# sourceMappingURL=Reports.types.d.ts.map