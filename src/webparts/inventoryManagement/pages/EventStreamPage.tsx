import * as React from 'react';
import { EventStream } from '../components/EventStream';
import { IEventStreamPageProps } from '../types/EventStream.types';

export const EventStreamPage: React.FC<IEventStreamPageProps> = (props) => {
  const { state } = props;

  return (
    <EventStream
      logs={state.auditLogs}
      loading={state.auditLogsLoading}
      errorMessage={undefined}
      currentUserRole={state.effectiveRole}
      currentUserName={state.activeUserDisplayName}
      refreshTrigger={state.auditLogsRefreshTrigger}
    />
  );
};
