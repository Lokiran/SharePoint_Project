import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';

export interface IReportsState {
  reportsSelectedTab: string;
  reportsAssetTypeFilter: string;
  reportsStatusFilter: string;
  items: IInventoryItem[];
  requests: IRequest[];
}

export interface IReportsActions {
  onTabChange: (tabKey: string) => void;
  onAssetTypeFilterChange: (type: string) => void;
  onStatusFilterChange: (status: string) => void;
  onExportDetailedReportToExcel: (filteredItems: IInventoryItem[]) => void;
  onExportDetailedReportToPDF: (filteredItems: IInventoryItem[]) => void;
  onExportWarrantyReportToExcel: () => void;
  onExportWarrantyReportToPDF: () => void;
}

export interface IReportsPageProps {
  state: IReportsState;
  actions: IReportsActions;
}
