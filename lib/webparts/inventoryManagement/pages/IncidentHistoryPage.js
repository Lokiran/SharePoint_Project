import * as React from 'react';
import { IncidentHistory } from '../components/IncidentHistory/IncidentHistory';
export const IncidentHistoryPage = (props) => {
    const { state, actions, ...rest } = props;
    return (React.createElement("div", null,
        React.createElement(IncidentHistory, { ...rest, userDisplayName: state.userDisplayName, userEmail: state.userEmail, userRole: state.userRole, setIsLoading: actions.setIsLoading })));
};
//# sourceMappingURL=IncidentHistoryPage.js.map