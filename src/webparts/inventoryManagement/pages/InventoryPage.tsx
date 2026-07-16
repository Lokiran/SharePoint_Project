import * as React from 'react';
import { PrimaryButton } from '@fluentui/react';
import { InventoryList } from '../components/InventoryList';
import { IInventoryPageProps } from '../types/Inventory.types';
import styles from '../components/InventoryManagement.module.scss';

export const InventoryPage: React.FC<IInventoryPageProps> = (props) => {
  const { state, actions } = props;
  const { items, loading, isAdmin, isInventoryManager } = state;

  return (isAdmin || isInventoryManager) ? (
    <div>
      <div className={styles.cardHeader}>
        <h3>Current Inventory Overview</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Track and manage your organizational assets efficiently within the SharePoint Framework.
      </p>
      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <PrimaryButton
              text={isAdmin ? "Add New Asset" : "Assign / Manage Assets"}
              onClick={actions.onOpenAssetForm}
              iconProps={{ iconName: 'Add' }}
            />
          </div>
          <InventoryList items={items} isAdmin={isAdmin} enablePagination={true} />
        </div>
      )}
    </div>
  ) : null;
};
