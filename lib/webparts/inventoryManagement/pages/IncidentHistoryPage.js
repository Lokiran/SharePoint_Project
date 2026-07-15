import * as React from 'react';
import { IncidentHistory } from '../components/IncidentHistory/IncidentHistory';
import styles from '../components/InventoryManagement.module.scss';
export const IncidentHistoryPage = (props) => {
    const { state, actions, ...rest } = props;
    return (React.createElement("div", null,
        React.createElement("div", { className: styles.cardHeader },
            React.createElement("h3", null, "Incident History")),
        React.createElement(IncidentHistory, { ...rest, userDisplayName: state.userDisplayName, userEmail: state.userEmail, userRole: state.userRole, setIsLoading: actions.setIsLoading })));
};
//# sourceMappingURL=IncidentHistoryPage.js.map