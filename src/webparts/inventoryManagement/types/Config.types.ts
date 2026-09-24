import { MessageBarType } from '@fluentui/react';

export type ConfigTabKey = 'overview' | 'connections' | 'schema' | 'rbac' | 'operations';

export interface IConfigState {
  configSelectedTab: ConfigTabKey | string;
  syncInProgress?: boolean;
  syncMessage?: string;
  syncMessageType?: MessageBarType;
  diagnosticInfo?: string;
}

export interface IConfigActions {
  onSyncAssignedAssets: () => void;
  onRunDiagnostics: () => void;
  onDismissSyncMessage: () => void;
  onTabChange: (tabKey: ConfigTabKey | string) => void;
}

export interface IConfigPageProps {
  state: IConfigState;
  actions: IConfigActions;
}
