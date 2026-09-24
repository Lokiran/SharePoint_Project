import * as React from 'react';
import * as strings from 'InventoryManagementWebPartStrings';
import { ReturnRequestList } from '../components/ReturnRequestList';
import styles from '../components/InventoryManagement.module.scss';
import { IAssetReturnsPageProps } from '../types/AssetReturns.types';

export const AssetReturnsPage: React.FC<IAssetReturnsPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{strings.AssetReturnsPage.Title}</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {strings.AssetReturnsPage.Description}
      </p>
      <ReturnRequestList
        items={state.returnRequests}
        isAdmin={state.isAdmin}
        isManager={state.isManager}
        onUpdateStatus={actions.onUpdateStatus}
        loading={state.returnRequestsLoading}
      />
    </div>
  );
};
