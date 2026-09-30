import { INotification } from '../models/INotification';
import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';
import { INotificationPage } from '../utils/NotificationUtils';

export interface INotificationDetailsState {
  selectedNotification: INotification | undefined;
  isNotificationDetailsOpen: boolean;
  items: IInventoryItem[];
  requests: IRequest[];
  /** Pages the current user can open, for the "Open ..." button. */
  availablePages?: INotificationPage[];
}

export interface INotificationDetailsActions {
  onDismiss: () => void;
  onOpenPage?: (pageKey: string) => void;
  onMarkAsUnread?: (id: string) => void;
  onDismissNotification?: (id: string) => void;
}

export interface INotificationDetailsPanelProps {
  state: INotificationDetailsState;
  actions: INotificationDetailsActions;
}
