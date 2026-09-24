import * as React from 'react';
import { IncidentHistory } from '../components/IncidentHistory/IncidentHistory';
import styles from '../components/InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
export const IncidentHistoryPage = (props) => {
    const { state, actions, ...rest } = props;
    return (React.createElement("div", null,
        React.createElement("div", { className: styles.cardHeader },
            React.createElement("h3", null, strings.IncidentHistoryPage.Title)),
        React.createElement(IncidentHistory, { ...rest, userDisplayName: state.userDisplayName, userEmail: state.userEmail, userRole: state.userRole, setIsLoading: actions.setIsLoading })));
};
//# sourceMappingURL=IncidentHistoryPage.js.map