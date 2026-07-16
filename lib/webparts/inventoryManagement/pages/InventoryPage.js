import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { InventoryList } from '../components/InventoryList';
import styles from '../components/InventoryManagement.module.scss';
export const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    return (isAdmin || isInventoryManager) ? (React.createElement("div", null,
        React.createElement("div", { className: styles.cardHeader },
            React.createElement("h3", null, "Current Inventory Overview")),
        React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage your organizational assets efficiently within the SharePoint Framework."),
        loading ? (React.createElement("p", null, "Loading inventory...")) : (React.createElement("div", null,
            React.createElement("div", { style: { marginBottom: '15px' } },
                React.createElement(PrimaryButton, { text: isAdmin ? "Add New Asset" : "Assign / Manage Assets", onClick: actions.onOpenAssetForm, iconProps: { iconName: 'Add' } })),
            React.createElement(InventoryList, { items: items, isAdmin: isAdmin, enablePagination: true }))))) : null;
};
//# sourceMappingURL=InventoryPage.js.map