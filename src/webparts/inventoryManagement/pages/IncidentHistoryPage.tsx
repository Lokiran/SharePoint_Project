import * as React from 'react';
import { IncidentHistory } from '../components/IncidentHistory/IncidentHistory';
import { IIncidentHistoryPageProps } from '../types/IncidentHistory.types';

export const IncidentHistoryPage: React.FC<IIncidentHistoryPageProps> = (props) => {
  const { state, actions, ...rest } = props;

  return (
    <div>
      <IncidentHistory
        {...rest}
        userDisplayName={state.userDisplayName}
        userEmail={state.userEmail}
        userRole={state.userRole}
        setIsLoading={actions.setIsLoading}
      />
    </div>
  );
};
