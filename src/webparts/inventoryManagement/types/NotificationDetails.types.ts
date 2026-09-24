import { INotification } from '../models/INotification';
import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';

export interface INotificationDetailsState {
  selectedNotification: INotification | undefined;
  isNotificationDetailsOpen: boolean;
  items: IInventoryItem[];
  requests: IRequest[];
}

export interface INotificationDetailsActions {
  onDismiss: () => void;
}

export interface INotificationDetailsPanelProps {
  state: INotificationDetailsState;
  actions: INotificationDetailsActions;
}
