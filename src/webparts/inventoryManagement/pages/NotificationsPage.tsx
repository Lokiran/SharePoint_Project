import * as React from 'react';
import { NotificationCenter } from '../components/NotificationCenter';
import { INotificationsPageProps } from '../types/Notifications.types';

export const NotificationsPage: React.FC<INotificationsPageProps> = (props) => {
  const { state, actions } = props;

  return (
    <NotificationCenter
      notifications={state.notifications}
      onMarkAsRead={actions.onMarkAsRead}
      onMarkAllAsRead={actions.onMarkAllAsRead}
      onClearNotification={actions.onClearNotification}
      onClearAllNotifications={actions.onClearAllNotifications}
      onNotificationAction={actions.onNotificationAction}
      isAllCleared={state.isAllNotificationsCleared}
    />
  );
};
