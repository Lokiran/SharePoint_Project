import * as React from 'react';
import { INotification } from '../models/INotification';
import { INotificationPage } from '../utils/NotificationUtils';
export interface INotificationCenterProps {
    notifications: INotification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onClearNotification: (id: string) => void;
    /** Legacy bulk dismiss by category; used only when onClearNotifications isn't provided. */
    onClearAllNotifications: (filterTab?: string) => void;
    onNotificationAction: (actionLink: string, notificationId: string) => void;
    isAllCleared?: boolean;
    onMarkAsUnread?: (id: string) => void;
    /** Dismisses exactly these notifications (the ones currently shown). */
    onClearNotifications?: (ids: string[]) => void;
    /** Undo for a dismiss. */
    onRestoreNotifications?: (ids: string[]) => void;
    /** Navigates to a page of the app. */
    onOpenPage?: (pageKey: string) => void;
    /** Pages the current user can open, used for the "Open ..." links. */
    availablePages?: INotificationPage[];
}
export declare const NotificationCenter: React.FC<INotificationCenterProps>;
//# sourceMappingURL=NotificationCenter.d.ts.map