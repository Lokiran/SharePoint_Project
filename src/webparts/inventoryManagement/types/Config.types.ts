import { MessageBarType } from '@fluentui/react';

export interface IConfigState {
  configSelectedTab: 'operations' | 'connections' | 'rbac' | 'schema' | string;
  syncInProgress?: boolean;
  syncMessage?: string;
  syncMessageType?: MessageBarType;
  diagnosticInfo?: string;
  connectionStatuses: Record<string, string>;
  connectionErrorMessages: Record<string, string>;
  loadingGroupUsers: Record<string, boolean>;
  groupUsersList: Record<string, string[]>;
}

export interface IConfigActions {
  onSyncAssignedAssets: () => void;
  onRunDiagnostics: () => void;
  onTestListConnection: (listTitle: string, internalTitle: string) => void;
  onLoadGroupUsers: (groupName: string) => void;
  onDismissSyncMessage: () => void;
  onTabChange: (tabKey: 'operations' | 'connections' | 'rbac' | 'schema' | string) => void;
}

export interface IConfigPageProps {
  state: IConfigState;
  actions: IConfigActions;
}
