import * as React from 'react';
import { ApprovalInbox } from '../components/approvals/ApprovalInbox';
import { IApprovalsPageProps } from '../types/Approvals.types';

export const ApprovalsPage: React.FC<IApprovalsPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <ApprovalInbox
      requests={state.managerQueueRequests}
      items={state.items}
      search={state.requestSearchId}
      onSearchChange={actions.onSearchChange}
      onApproveRequest={actions.onApproveRequest}
      onRejectRequest={actions.onRejectRequest}
      actionInProgressId={state.requestActionInProgressId}
    />
  );
};
