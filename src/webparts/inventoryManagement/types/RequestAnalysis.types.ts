import { IRequest } from '../models/IRequest';
import { IInventoryItem } from '../models/IInventoryItem';

export interface IRequestAnalysisPanelProps {
  request: IRequest;
  items: IInventoryItem[];
}
