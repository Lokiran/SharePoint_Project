import * as React from 'react';
import { INotification } from '../models/INotification';
export interface INotificationCenterProps {
    notifications: INotification[];
    clearedNotificationIds: string[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string, tab: string) => void;
    onClearAllNotifications: () => void;
    onClearNotifications?: (ids: string[], tab: string) => void;
    onNotificationAction: (actionLink: string, notificationId: string) => void;
}
export declare const NotificationCenter: React.FC<INotificationCenterProps>;
//# sourceMappingURL=NotificationCenter.d.ts.map