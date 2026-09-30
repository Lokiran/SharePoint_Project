import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from './LocalizationUtils';
import { INotification } from '../models/INotification';

export type NotificationDateGroup = 'today' | 'yesterday' | 'week' | 'older';

/** Notification timestamps are local "YYYY-MM-DD HH:mm" strings (see getNotifications). */
export const parseNotificationTime = (timestamp: string): Date | undefined => {
  if (!timestamp) return undefined;
  const d = new Date(timestamp.indexOf('T') > 0 ? timestamp : timestamp.replace(' ', 'T'));
  return isNaN(d.getTime()) ? undefined : d;
};

const startOfDay = (d: Date): number => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

export const getDateGroup = (timestamp: string, now: Date = new Date()): NotificationDateGroup => {
  const d = parseNotificationTime(timestamp);
  if (!d) return 'older';
  const days = Math.round((startOfDay(now) - startOfDay(d)) / DAY_MS);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return 'week';
  return 'older';
};

export const getDateGroupLabel = (group: NotificationDateGroup): string => {
  const n = strings.Notifications;
  switch (group) {
    case 'today': return n.GroupToday;
    case 'yesterday': return n.GroupYesterday;
    case 'week': return n.GroupThisWeek;
    default: return n.GroupOlder;
  }
};

/** "Just now", "5 min ago", "3 h ago", "Yesterday", then a short date. */
export const formatRelativeTime = (timestamp: string, now: Date = new Date()): string => {
  const d = parseNotificationTime(timestamp);
  if (!d) return timestamp;
  const n = strings.Notifications;
  const minutes = Math.floor((now.getTime() - d.getTime()) / 60000);
  const group = getDateGroup(timestamp, now);
  if (minutes >= 0 && minutes < 1) return n.TimeJustNow;
  if (minutes >= 0 && minutes < 60) return formatString(n.TimeMinutesAgo, minutes);
  if (group === 'today' && minutes >= 0) return formatString(n.TimeHoursAgo, Math.floor(minutes / 60));
  if (group === 'yesterday') return n.TimeYesterday;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};

export const formatFullTime = (timestamp: string): string => {
  const d = parseNotificationTime(timestamp);
  return d
    ? d.toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : timestamp;
};

// actionLink values written by getNotifications -> navigation keys in InventoryManagement.
const ACTION_LINK_TO_PAGE: { [actionLink: string]: string } = {
  'Approvals': 'Approvals',
  'AssetAssignmentQueue': 'AssetAssignmentQueue',
  'AssetReturns': 'AssetReturns',
  'Inventory': 'Inventory',
  'Asset Tracking': 'Inventory',
  'My Requests': 'MyWorkspace',
  'MyRequests': 'MyWorkspace',
  'My Assets': 'MyWorkspace'
};

export interface INotificationPage {
  key: string;
  text: string;
}

/** The page this notification relates to, if the current user can open it. */
export const getNotificationPage = (
  notification: INotification,
  availablePages: INotificationPage[] | undefined
): INotificationPage | undefined => {
  if (!availablePages) return undefined;
  const key = ACTION_LINK_TO_PAGE[notification.actionLink];
  return key ? availablePages.find(p => p.key === key) : undefined;
};

export const getCategoryLabel = (category: INotification['category']): string => {
  const n = strings.Notifications;
  switch (category) {
    case 'Request': return n.TabRequests;
    case 'Assignment': return n.TabAssignments;
    default: return n.TabSystemAlerts;
  }
};

export interface INotificationTone {
  icon: string;
  color: string;
  soft: string;
}

export const getNotificationTone = (type: INotification['type']): INotificationTone => {
  switch (type) {
    case 'success': return { icon: 'CheckMark', color: '#107c10', soft: 'rgba(16, 124, 16, 0.12)' };
    case 'warning': return { icon: 'Warning', color: '#bc4b09', soft: 'rgba(188, 75, 9, 0.12)' };
    case 'error': return { icon: 'ErrorBadge', color: '#c50f1f', soft: 'rgba(197, 15, 31, 0.12)' };
    default: return { icon: 'Info', color: '#0f6cbd', soft: 'rgba(15, 108, 189, 0.12)' };
  }
};
