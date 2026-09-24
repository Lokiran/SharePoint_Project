import * as React from 'react';
import { TextField } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { RequestList } from '../components/RequestList';
import styles from '../components/InventoryManagement.module.scss';
import { IAssetAssignmentQueuePageProps } from '../types/AssetAssignmentQueue.types';

export const AssetAssignmentQueuePage: React.FC<IAssetAssignmentQueuePageProps> = (props) => {
  const { state, actions } = props;

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{strings.AssetAssignmentQueuePage.Title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {strings.AssetAssignmentQueuePage.Description}
      </p>
      <TextField
        label={strings.ApprovalsPage.SearchLabel}
        placeholder={strings.ApprovalsPage.SearchPlaceholder}
        value={state.requestSearchId}
        onChange={(_, value) => actions.onSearchChange(value || '')}
        styles={{ root: { marginBottom: '12px', maxWidth: 320 } }}
      />
      <RequestList
        items={state.visibleAdminRequests}
        inventoryItems={state.items}
        canApproveReject={false}
        canApproveAsset={true}
        hideStatusColumn={true}
        showResponseColumns={false}
        onSelectRequestForAssignment={actions.onSelectRequestForAssignment}
        actionInProgressId={state.requestActionInProgressId}
      />
    </div>
  );
};
