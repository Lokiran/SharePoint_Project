import * as React from 'react';
import { Shimmer } from '@fluentui/react';
import { InventoryExplorer } from '../components/inventory/InventoryExplorer';
import * as strings from 'InventoryManagementWebPartStrings';
export const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    if (!isAdmin && !isInventoryManager)
        return null;
    if (loading && items.length === 0) {
        return (React.createElement("div", { "aria-busy": "true", "aria-label": strings.InventoryPage.LoadingInventory }, Array.from({ length: 6 }).map((_, i) => React.createElement(Shimmer, { key: i, styles: { root: { marginBottom: 14 } } }))));
    }
    return (React.createElement(InventoryExplorer, { items: items, addLabel: isAdmin ? strings.InventoryPage.ButtonAddNewAsset : strings.InventoryPage.ButtonAssignManageAssets, onAdd: actions.onOpenAssetForm, auditLogs: state.auditLogs, returnRequests: state.returnRequests, spContext: state.spContext }));
};
//# sourceMappingURL=InventoryPage.js.map