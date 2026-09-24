import * as React from 'react';
import { Panel, PanelType, MessageBar, MessageBarType } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';
import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';
import { INotificationDetailsPanelProps } from '../types/NotificationDetails.types';
import { RequestAnalysisPanel } from './RequestAnalysisPanel';
import { AssetAnalysisPanel } from './AssetAnalysisPanel';

export const NotificationDetailsPanel: React.FC<INotificationDetailsPanelProps> = (props) => {
  const { state, actions } = props;
  const { selectedNotification, isNotificationDetailsOpen, items, requests } = state;
  if (!selectedNotification) return null;

  const notifId = selectedNotification.id || "";
  let associatedRequest: IRequest | undefined;
  let associatedAsset: IInventoryItem | undefined;

  if (notifId.startsWith("req-pending-")) {
    const id = notifId.replace("req-pending-", "");
    associatedRequest = requests.find(r => r.id === id);
  } else if (notifId.startsWith("req-resolved-")) {
    const parts = notifId.split("-");
    const id = parts[2];
    associatedRequest = requests.find(r => r.id === id);
  } else if (notifId.startsWith("req-assign-admin-")) {
    const id = notifId.replace("req-assign-admin-", "");
    associatedRequest = requests.find(r => r.id === id);
  } else if (notifId.startsWith("asset-assigned-admin-")) {
    const id = notifId.replace("asset-assigned-admin-", "");
    associatedAsset = items.find(a => a.id === id);
  } else if (notifId.startsWith("asset-assigned-")) {
    const id = notifId.replace("asset-assigned-", "");
    associatedAsset = items.find(a => a.id === id);
  } else if (notifId.startsWith("asset-maintenance-")) {
    const parts = notifId.replace("asset-maintenance-", "").split("-");
    const id = parts[0];
    associatedAsset = items.find(a => a.id === id);
  }

  return (
    <Panel
      isOpen={isNotificationDetailsOpen}
      onDismiss={actions.onDismiss}
      type={PanelType.medium}
      headerText={selectedNotification.title}
      closeButtonAriaLabel="Close"
    >
      <div style={{ marginTop: '10px' }}>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
          <strong>{strings.NotificationDetailsPanel.LabelReceived}</strong> {selectedNotification.timestamp}
        </p>

        <div style={{ padding: '12px 15px', backgroundColor: '#f1f5f9', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #64748b' }}>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: '1.5' }}>
            {selectedNotification.message}
          </p>
        </div>

        {associatedRequest && <RequestAnalysisPanel request={associatedRequest} items={items} />}
        {associatedAsset && <AssetAnalysisPanel asset={associatedAsset} />}

        {!associatedRequest && !associatedAsset && (
          <div>
            <h4 style={{ color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '12px' }}>{strings.NotificationDetailsPanel.SystemAlertTitle}</h4>
            <MessageBar messageBarType={MessageBarType.info}>
              {strings.NotificationDetailsPanel.GeneralNotificationText}
            </MessageBar>
          </div>
        )}
      </div>
    </Panel>
  );
};
