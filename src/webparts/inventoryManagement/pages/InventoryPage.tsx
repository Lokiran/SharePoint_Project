import * as React from 'react';
import { Shimmer } from '@fluentui/react';
import { InventoryExplorer } from '../components/inventory/InventoryExplorer';
import { IInventoryPageProps } from '../types/Inventory.types';
import * as strings from 'InventoryManagementWebPartStrings';

export const InventoryPage: React.FC<IInventoryPageProps> = (props) => {
  const { state, actions } = props;
  const { items, loading, isAdmin, isInventoryManager } = state;

  if (!isAdmin && !isInventoryManager) return null;

  if (loading && items.length === 0) {
    return (
      <div aria-busy="true" aria-label={strings.InventoryPage.LoadingInventory}>
        {Array.from({ length: 6 }).map((_, i) => <Shimmer key={i} styles={{ root: { marginBottom: 14 } }} />)}
      </div>
    );
  }

  return (
    <InventoryExplorer
      items={items}
      addLabel={isAdmin ? strings.InventoryPage.ButtonAddNewAsset : strings.InventoryPage.ButtonAssignManageAssets}
      onAdd={actions.onOpenAssetForm}
      auditLogs={state.auditLogs}
      returnRequests={state.returnRequests}
      spContext={state.spContext}
    />
  );
};
