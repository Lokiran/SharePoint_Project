import * as React from 'react';
import { Dashboard } from '../components/Dashboard';
export const DashboardPage = (props) => {
    const { state, actions } = props;
    return (React.createElement(Dashboard, { items: state.items, requests: state.requests, isAdmin: state.isAdmin, isInventoryManager: state.isInventoryManager, onNavigate: actions.onNavigate }));
};
//# sourceMappingURL=DashboardPage.js.map