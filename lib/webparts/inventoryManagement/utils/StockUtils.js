export function getAvailableStock(inventoryItems, request) {
    const requestedAsset = (request.assetTitle || "").trim().toLowerCase();
    return inventoryItems.filter(item => {
        const assetType = (item.assetType || "").trim().toLowerCase();
        const isMatchingAsset = assetType === requestedAsset;
        const isAvailable = item.status === "In Stock" ||
            item.status === "Yes";
        return isMatchingAsset && isAvailable;
    }).length;
}
export function hasEnoughStock(inventoryItems, request) {
    const availableStock = getAvailableStock(inventoryItems, request);
    return availableStock >= Number(request.quantity || 0);
}
//# sourceMappingURL=StockUtils.js.map