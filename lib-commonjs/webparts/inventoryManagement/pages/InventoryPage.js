"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const InventoryExplorer_1 = require("../components/inventory/InventoryExplorer");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    if (!isAdmin && !isInventoryManager)
        return null;
    if (loading && items.length === 0) {
        return (React.createElement("div", { "aria-busy": "true", "aria-label": strings.InventoryPage.LoadingInventory }, Array.from({ length: 6 }).map((_, i) => React.createElement(react_1.Shimmer, { key: i, styles: { root: { marginBottom: 14 } } }))));
    }
    return (React.createElement(InventoryExplorer_1.InventoryExplorer, { items: items, addLabel: isAdmin ? strings.InventoryPage.ButtonAddNewAsset : strings.InventoryPage.ButtonAssignManageAssets, onAdd: actions.onOpenAssetForm, auditLogs: state.auditLogs, returnRequests: state.returnRequests, spContext: state.spContext }));
};
exports.InventoryPage = InventoryPage;
//# sourceMappingURL=InventoryPage.js.map