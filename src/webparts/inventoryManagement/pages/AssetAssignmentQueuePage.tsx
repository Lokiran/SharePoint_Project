import * as React from 'react';
import { AssignmentQueue } from '../components/assignment/AssignmentQueue';
import { IAssetAssignmentQueuePageProps } from '../types/AssetAssignmentQueue.types';

export const AssetAssignmentQueuePage: React.FC<IAssetAssignmentQueuePageProps> = (props) => {
  const { state, actions } = props;

  return (
    <AssignmentQueue
      requests={state.allAdminRequests || state.visibleAdminRequests}
      items={state.items}
      actionInProgressId={state.requestActionInProgressId}
      onAssign={actions.onSelectRequestForAssignment}
    />
  );
};
