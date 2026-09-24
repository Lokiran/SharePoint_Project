import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { InventoryList } from '../components/InventoryList';
import styles from '../components/InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
export const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    return (isAdmin || isInventoryManager) ? (React.createElement("div", null,
        React.createElement("div", { className: styles.cardHeader },
            React.createElement("h3", null, strings.InventoryPage.Title)),
        React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, strings.InventoryPage.Description),
        loading ? (React.createElement("p", null, strings.InventoryPage.LoadingInventory)) : (React.createElement("div", null,
            React.createElement("div", { style: { marginBottom: '15px' } },
                React.createElement(PrimaryButton, { text: isAdmin ? strings.InventoryPage.ButtonAddNewAsset : strings.InventoryPage.ButtonAssignManageAssets, onClick: actions.onOpenAssetForm, iconProps: { iconName: 'Add' } })),
            React.createElement(InventoryList, { items: items, isAdmin: isAdmin, enablePagination: true }))))) : null;
};
//# sourceMappingURL=InventoryPage.js.map