"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const InventoryList_1 = require("../components/InventoryList");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("../components/InventoryManagement.module.scss"));
const InventoryPage = (props) => {
    const { state, actions } = props;
    const { items, loading, isAdmin, isInventoryManager } = state;
    return (isAdmin || isInventoryManager) ? (React.createElement("div", null,
        React.createElement("div", { className: InventoryManagement_module_scss_1.default.cardHeader },
            React.createElement("h3", null, "Current Inventory Overview")),
        React.createElement("p", { style: { color: 'var(--text-muted)', marginBottom: '20px' } }, "Track and manage your organizational assets efficiently within the SharePoint Framework."),
        loading ? (React.createElement("p", null, "Loading inventory...")) : (React.createElement("div", null,
            React.createElement("div", { style: { marginBottom: '15px' } },
                React.createElement(react_1.PrimaryButton, { text: isAdmin ? "Add New Asset" : "Assign / Manage Assets", onClick: actions.onOpenAssetForm, iconProps: { iconName: 'Add' } })),
            React.createElement(InventoryList_1.InventoryList, { items: items, isAdmin: isAdmin, enablePagination: true }))))) : null;
};
exports.InventoryPage = InventoryPage;
//# sourceMappingURL=InventoryPage.js.map