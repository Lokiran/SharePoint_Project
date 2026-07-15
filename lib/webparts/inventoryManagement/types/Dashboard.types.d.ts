import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
export interface IDashboardState {
    items: IInventoryItem[];
    requests: IRequest[];
    isAdmin: boolean;
    isInventoryManager: boolean;
}
export interface IDashboardActions {
    onNavigate: (key: string) => void;
}
export interface IDashboardPageProps {
    state: IDashboardState;
    actions: IDashboardActions;
}
//# sourceMappingURL=Dashboard.types.d.ts.map