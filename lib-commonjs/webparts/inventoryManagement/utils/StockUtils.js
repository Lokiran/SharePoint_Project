"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableStock = getAvailableStock;
exports.hasEnoughStock = hasEnoughStock;
function getAvailableStock(inventoryItems, request) {
    const requestedAsset = (request.assetTitle || "").trim().toLowerCase();
    return inventoryItems.filter(item => {
        const assetType = (item.assetType || "").trim().toLowerCase();
        const isMatchingAsset = assetType === requestedAsset;
        const isAvailable = item.status === "In Stock" ||
            item.status === "Yes";
        return isMatchingAsset && isAvailable;
    }).length;
}
function hasEnoughStock(inventoryItems, request) {
    const availableStock = getAvailableStock(inventoryItems, request);
    return availableStock >= Number(request.quantity || 0);
}
//# sourceMappingURL=StockUtils.js.map