import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';

export function getAvailableStock(items: IInventoryItem[] = [], request?: IRequest): number {
  if (!items || items.length === 0) return 0;
  if (!request) return 0;

  const reqAssetTitle = (request.assetTitle || '').toLowerCase().trim();
  if (!reqAssetTitle) return 0;

  const inStockItems = items.filter(item => {
    const itemTitle = (item.title || item.assetName || item.assetType || '').toLowerCase().trim();
    const itemType = (item.assetType || '').toLowerCase().trim();
    const matchesTitle = itemTitle === reqAssetTitle || itemType === reqAssetTitle;
    const statusLower = (item.status || '').toLowerCase().trim();
    const isAvailable = statusLower === 'in stock' || statusLower === 'instock' || statusLower === 'available' || statusLower === 'yes';

    return matchesTitle && isAvailable;
  });

  return inStockItems.length;
}
