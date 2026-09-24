import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';
import { IDropdownOption } from '@fluentui/react';

export interface IAdminAssignmentPanelState {
  selectedAdminRequest?: IRequest;
  isAdminPanelOpen?: boolean;
  items: IInventoryItem[];
  requestActionInProgressId?: string;
  adminSelectedAssetId?: string;
  adminComment?: string;
  isDarkTheme: boolean;
}

export interface IAdminAssignmentPanelActions {
  onDismiss: () => void;
  onAssetChange: (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => void;
  onCommentChange: (value: string) => void;
  onAssignAndApprove: () => void;
  onReject: () => void;
}

export interface IAdminAssignmentPanelProps {
  state: IAdminAssignmentPanelState;
  actions: IAdminAssignmentPanelActions;
}
