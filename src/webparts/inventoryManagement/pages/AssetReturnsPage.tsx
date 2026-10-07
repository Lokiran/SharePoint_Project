import * as React from 'react';
import * as strings from 'InventoryManagementWebPartStrings';
import { ReturnRequestList } from '../components/ReturnRequestList';
import { IAssetReturnsPageProps } from '../types/AssetReturns.types';

export const AssetReturnsPage: React.FC<IAssetReturnsPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <div>
      <ReturnRequestList
        title={strings.AssetReturnsPage.Title}
        subtitle={strings.AssetReturnsPage.Description}
        items={state.returnRequests}
        isAdmin={state.isAdmin}
        isManager={state.isManager}
        onUpdateStatus={actions.onUpdateStatus}
        loading={state.returnRequestsLoading}
      />
    </div>
  );
};
