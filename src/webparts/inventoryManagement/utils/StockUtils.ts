import { IInventoryItem } from "../models/IInventoryItem";
import { IRequest } from "../models/IRequest";

export function getAvailableStock(
    inventoryItems: IInventoryItem[],
    request: IRequest
): number {
    const requestedAsset = (request.assetTitle || "").trim().toLowerCase();

    return inventoryItems.filter(item => {
        const assetType = (item.assetType || "").trim().toLowerCase();

        const isMatchingAsset = assetType === requestedAsset;

        const isAvailable =
            item.status === "In Stock" ||
            item.status === "Yes";

        return isMatchingAsset && isAvailable;
    }).length;
}

export function hasEnoughStock(
    inventoryItems: IInventoryItem[],
    request: IRequest
): boolean {
    const availableStock = getAvailableStock(inventoryItems, request);

    return availableStock >= Number(request.quantity || 0);
}