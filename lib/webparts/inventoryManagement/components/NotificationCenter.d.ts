import * as React from 'react';
import { INotification } from '../models/INotification';
export interface INotificationCenterProps {
    notifications: INotification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string) => void;
    onClearAllNotifications: (filterTab?: string) => void;
    onNotificationAction: (actionLink: string, notificationId: string) => void;
    isAllCleared?: boolean;
}
export declare const NotificationCenter: React.FC<INotificationCenterProps>;
//# sourceMappingURL=NotificationCenter.d.ts.map