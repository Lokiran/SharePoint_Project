import { INotification } from '../models/INotification';

export interface INotificationsState {
  notifications: INotification[];
  isAllNotificationsCleared: boolean;
}

export interface INotificationsActions {
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  onClearAllNotifications: (filterTab?: string) => void;
  onNotificationAction: (actionLink: string, notificationId: string) => void;
}

export interface INotificationsPageProps {
  state: INotificationsState;
  actions: INotificationsActions;
}
