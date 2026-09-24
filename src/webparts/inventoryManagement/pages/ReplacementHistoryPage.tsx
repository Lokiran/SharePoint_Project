import * as React from 'react';
import { ReplacementHistory } from '../components/ReplacementHistory/ReplacementHistory';
import { IReplacementHistoryPageProps } from '../types/ReplacementHistory.types';

export const ReplacementHistoryPage: React.FC<IReplacementHistoryPageProps> = (props) => {
  const { state, actions, ...rest } = props;

  return (
    <div>
      <ReplacementHistory
        {...rest}
        userDisplayName={state.userDisplayName}
        userEmail={state.userEmail}
        userRole={state.userRole}
        setIsLoading={actions.setIsLoading}
      />
    </div>
  );
};
