"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardPage = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const Dashboard_1 = require("../components/Dashboard");
const DashboardPage = (props) => {
    const { state, actions } = props;
    return (React.createElement(Dashboard_1.Dashboard, { items: state.items, requests: state.requests, isAdmin: state.isAdmin, isInventoryManager: state.isInventoryManager, onNavigate: actions.onNavigate }));
};
exports.DashboardPage = DashboardPage;
//# sourceMappingURL=DashboardPage.js.map