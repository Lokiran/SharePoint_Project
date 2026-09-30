import * as React from 'react';
import { Panel, PanelType, MessageBar, MessageBarType, PrimaryButton, DefaultButton, Icon } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as strings from 'InventoryManagementWebPartStrings';
import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';
import { INotificationDetailsPanelProps } from '../types/NotificationDetails.types';
import { RequestAnalysisPanel } from './RequestAnalysisPanel';
import { AssetAnalysisPanel } from './AssetAnalysisPanel';
import { formatString } from '../utils/LocalizationUtils';
import {
  formatFullTime,
  formatRelativeTime,
  getCategoryLabel,
  getNotificationPage,
  getNotificationTone
} from '../utils/NotificationUtils';

const css = mergeStyleSets({
  header: { display: 'flex', gap: 14, alignItems: 'flex-start', margin: '4px 0 20px' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 20
  },
  meta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13, color: '#616161' },
  pill: { fontSize: 11, fontWeight: 600, padding: '1px 8px', borderRadius: 999, border: '1px solid rgba(0, 0, 0, 0.12)' },
  message: {
    margin: '8px 0 0',
    fontSize: 15,
    lineHeight: '22px',
    color: '#242424'
  },
  sectionTitle: {
    margin: '0 0 12px',
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#242424',
    borderBottom: '1px solid #e0e0e0'
  },
  footer: { display: 'flex', gap: 8, flexWrap: 'wrap' }
});

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

  const n = strings.Notifications;
  const tone = getNotificationTone(selectedNotification.type);
  const page = getNotificationPage(selectedNotification, state.availablePages);

  return (
    <Panel
      isOpen={isNotificationDetailsOpen}
      onDismiss={actions.onDismiss}
      type={PanelType.medium}
      headerText={selectedNotification.title}
      closeButtonAriaLabel={strings.Common.Close}
      isFooterAtBottom={true}
      onRenderFooterContent={() => (
        <div className={css.footer}>
          {page && actions.onOpenPage && (
            <PrimaryButton
              text={formatString(n.OpenPage, page.text)}
              iconProps={{ iconName: 'OpenInNewTab' }}
              onClick={() => { actions.onDismiss(); actions.onOpenPage!(page.key); }}
            />
          )}
          {actions.onMarkAsUnread && (
            <DefaultButton
              text={n.MarkAsUnread}
              iconProps={{ iconName: 'Mail' }}
              onClick={() => { actions.onMarkAsUnread!(selectedNotification.id); actions.onDismiss(); }}
            />
          )}
          {actions.onDismissNotification && (
            <DefaultButton
              text={n.DismissNotification}
              iconProps={{ iconName: 'Cancel' }}
              onClick={() => { actions.onDismissNotification!(selectedNotification.id); actions.onDismiss(); }}
            />
          )}
        </div>
      )}
    >
      <div className={css.header}>
        <span className={css.iconWrap} style={{ backgroundColor: tone.soft, color: tone.color }} aria-hidden="true">
          <Icon iconName={tone.icon} />
        </span>
        <div>
          <div className={css.meta}>
            <span className={css.pill}>{getCategoryLabel(selectedNotification.category)}</span>
            <span title={formatFullTime(selectedNotification.timestamp)}>
              {strings.NotificationDetailsPanel.LabelReceived} {formatRelativeTime(selectedNotification.timestamp)} · {formatFullTime(selectedNotification.timestamp)}
            </span>
          </div>
          <p className={css.message}>{selectedNotification.message}</p>
        </div>
      </div>

      {associatedRequest && <RequestAnalysisPanel request={associatedRequest} items={items} />}
      {associatedAsset && <AssetAnalysisPanel asset={associatedAsset} />}

      {!associatedRequest && !associatedAsset && (
        <div>
          <h4 className={css.sectionTitle}>{strings.NotificationDetailsPanel.SystemAlertTitle}</h4>
          <MessageBar messageBarType={MessageBarType.info}>
            {strings.NotificationDetailsPanel.GeneralNotificationText}
          </MessageBar>
        </div>
      )}
    </Panel>
  );
};
