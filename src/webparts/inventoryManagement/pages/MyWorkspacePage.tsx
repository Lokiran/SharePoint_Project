import * as React from 'react';
import { Pivot, PivotItem, PrimaryButton } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { MyAssignedAssetsView } from '../components/MyAssignedAssetsView';
import { MyRequestsView } from '../components/MyRequestsView';
import styles from '../components/InventoryManagement.module.scss';
import { IMyWorkspacePageProps } from '../types/MyWorkspace.types';

export const MyWorkspacePage: React.FC<IMyWorkspacePageProps> = (props) => {
  const { state, actions } = props;

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{strings.MyWorkspacePage.Title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {strings.MyWorkspacePage.Description}
      </p>
      <Pivot aria-label={strings.MyWorkspacePage.TabsAriaLabel}>
        <PivotItem headerText={strings.MyWorkspacePage.TabAssets}>
          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <PrimaryButton
                text={strings.MyWorkspacePage.ButtonRequestAsset}
                onClick={actions.onRequestAsset}
                iconProps={{ iconName: 'Send' }}
              />
            </div>
            <MyAssignedAssetsView
              items={state.myAssets}
              onReturnAsset={actions.onReturnAsset}
              onRaiseIncident={actions.onRaiseIncident}
              onAssetReplacement={actions.onAssetReplacement}
            />
          </div>
        </PivotItem>
        <PivotItem headerText={strings.MyWorkspacePage.TabRequests}>
          <div style={{ marginTop: '20px' }}>
            <MyRequestsView
              requests={state.myRequests}
              returnRequests={state.myReturnRequests}
            />
          </div>
        </PivotItem>
      </Pivot>
    </div>
  );
};
