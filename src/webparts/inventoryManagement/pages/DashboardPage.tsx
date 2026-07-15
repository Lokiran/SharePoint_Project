import * as React from 'react';
import { Dashboard } from '../components/Dashboard';
import { IDashboardPageProps } from '../types/Dashboard.types';

export const DashboardPage: React.FC<IDashboardPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <Dashboard
      items={state.items}
      requests={state.requests}
      isAdmin={state.isAdmin}
      isInventoryManager={state.isInventoryManager}
      onNavigate={actions.onNavigate}
    />
  );
};
