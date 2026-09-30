import { INotification } from '../models/INotification';
import { INotificationPage } from '../utils/NotificationUtils';

export interface INotificationsState {
  notifications: INotification[];
  isAllNotificationsCleared: boolean;
  availablePages?: INotificationPage[];
}

export interface INotificationsActions {
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAllNotifications: (filterTab?: string) => void;
  onNotificationAction: (actionLink: string, notificationId: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onClearNotifications?: (ids: string[]) => void;
  onRestoreNotifications?: (ids: string[]) => void;
  onOpenPage?: (pageKey: string) => void;
}

export interface INotificationsPageProps {
  state: INotificationsState;
  actions: INotificationsActions;
}
