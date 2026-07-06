import { IInventoryItem } from "../models/IInventoryItem";
export declare class InventoryItemService {
    private static _resolvedListName;
    static getInventoryList(): Promise<any>;
    static getItems(): Promise<IInventoryItem[]>;
    static addItem(item: Omit<IInventoryItem, 'id'>, userDisplayName?: string): Promise<void>;
    static deleteItem(id: number, itemTitle?: string, userDisplayName?: string): Promise<void>;
    static updateAssetStatus(requestId: number, assetStatus: 'Approved' | 'Pending', approverName?: string, comment?: string): Promise<void>;
}
//# sourceMappingURL=InventoryItemService.d.ts.map