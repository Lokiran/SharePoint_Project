// AUTO-EXTRACTED from InventoryManagement.tsx (structural refactor split).
// Pure derived-data builder: computes the notification feed from current
// requests/items/returnRequests + read/cleared id sets. Recomputed fresh
// on every call (no memoization) to preserve existing behavior exactly.
import { INotification } from '../models/INotification';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IReturnRequest } from '../models/IReturnRequest';

type UserRole = "Admin" | "Inventory Manager" | "Inventory Employee";

export interface IGetNotificationsParams {
  items: IInventoryItem[];
  requests: IRequest[];
  returnRequests: IReturnRequest[];
  activeUserDisplayName: string;
  previewRole?: UserRole;
  userRole: UserRole;
  readNotificationIds: string[];
  clearedNotificationIds: string[];
}

export function getNotifications(params: IGetNotificationsParams): INotification[] {
  const { items, requests, activeUserDisplayName, previewRole, userRole, readNotificationIds, clearedNotificationIds, returnRequests: allReturnRequests } = params;
    const currentUser = activeUserDisplayName;
    const effectiveRole = previewRole || userRole;
    const isAdminOrManager = effectiveRole === 'Admin' || effectiveRole === 'Inventory Manager';
    const isAdmin = effectiveRole === 'Admin';
    const isManager = effectiveRole === 'Inventory Manager';

    const notifications: INotification[] = [];
    const readIds = new Set(readNotificationIds);
    const clearedIds = new Set(clearedNotificationIds);

    const normalize = (value: string | undefined): string => (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const activeUserNorm = normalize(currentUser);

    const formatTime = (isoString: string | undefined): string => {
      if (!isoString) return '';
      try {
        const d = new Date(isoString);
        const pad = (n: number) => n < 10 ? '0' + n : '' + n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch {
        return isoString;
      }
    };

    // 1. Generate Asset Request Notifications
    requests.forEach(req => {
      const requesterNorm = normalize(req.requesterName);
      const isMyRequest = requesterNorm && (requesterNorm === activeUserNorm || activeUserNorm.includes(requesterNorm) || requesterNorm.includes(activeUserNorm));

      if (isAdminOrManager) {
        // Pending requests notify Admins & Managers
        if (req.status === 'Pending') {
          const id = `req-pending-${req.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Request Pending",
              message: `${req.requesterName} requested ${req.quantity}x ${req.assetTitle} (Reason: ${req.reason || "None"})`,
              type: 'info',
              timestamp: formatTime(req.requestDate),
              isRead: readIds.has(id),
              actionLink: 'Approvals',
              category: 'Request'
            });
          }
        }
      }

      if (isMyRequest) {
        // Approved/Declined requests notify the Employee
        if (req.status === 'Approved' || req.status === 'Declined') {
          const id = `req-resolved-${req.id}-${req.status}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: req.status === 'Approved' ? "Request Approved" : "Request Declined",
              message: req.status === 'Approved'
                ? `Your request for ${req.quantity}x ${req.assetTitle} has been approved.`
                : `Your request for ${req.quantity}x ${req.assetTitle} has been declined.`,
              type: req.status === 'Approved' ? 'success' : 'error',
              timestamp: formatTime(req.requestDate),
              isRead: readIds.has(id),
              actionLink: 'My Requests',
              category: 'Request'
            });
          }
        }
      }

      if (isAdmin && req.status === 'Approved' && req.assetStatus === 'Pending') {
        const id = `req-assign-admin-${req.id}`;
        if (!clearedIds.has(id)) {
          notifications.push({
            id,
            title: "Asset Ready for Assignment",
            message: `${req.requesterName}'s request for ${req.quantity}x ${req.assetTitle} is approved and ready for assignment.`,
            type: 'info',
            timestamp: formatTime(req.requestDate),
            isRead: readIds.has(id),
            actionLink: 'AssetAssignmentQueue',
            category: 'Request'
          });
        }
      }
    });

    // 2. Generate Asset Assignment & Audit Notifications
    items.forEach(item => {
      const assignedNorm = normalize(item.assignedTo);
      const isMyAsset = assignedNorm && (assignedNorm === activeUserNorm || activeUserNorm.includes(assignedNorm) || assignedNorm.includes(activeUserNorm));

      const isNotedMyAsset = (item.note || '').toLowerCase().includes('assigned to:') && normalize(item.note).includes(activeUserNorm);

      if (isMyAsset || isNotedMyAsset) {
        // Asset Assignment notifies the Employee
        const id = `asset-assigned-${item.id}`;
        if (!clearedIds.has(id)) {
          notifications.push({
            id,
            title: "Asset Assigned",
            message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) has been assigned to you.`,
            type: 'success',
            timestamp: formatTime(item.assignedDate || item.purchaseDate),
            isRead: readIds.has(id),
            actionLink: 'My Assets',
            category: 'Assignment'
          });
        }
      }

      if (isAdminOrManager) {
        // When status is 'Assigned', notify Admin/Manager of assignments
        if (item.status === 'Assigned') {
          const id = `asset-assigned-admin-${item.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Assigned to Employee",
              message: `Asset '${item.assetName || item.title}' (${item.serialNumber || 'N/A'}) is assigned to ${item.assignedTo || "Employee"}.`,
              type: 'info',
              timestamp: formatTime(item.assignedDate || item.purchaseDate),
              isRead: readIds.has(id),
              actionLink: 'Asset Tracking',
              category: 'Assignment'
            });
          }
        }

        // Audit/Maintenance warnings
        if (item.status === 'Under Maintenance' || item.condition === 'Damaged' || item.condition === 'Poor') {
          const id = `asset-maintenance-${item.id}-${item.status}-${item.condition}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Status Alert",
              message: `Asset '${item.assetName || item.title}' is in ${item.condition} condition and marked as ${item.status}.`,
              type: 'warning',
              timestamp: formatTime(item.purchaseDate),
              isRead: readIds.has(id),
              actionLink: 'Inventory',
              category: 'Audit'
            });
          }
        }
      }
    });

    // 3. Generate Asset Return Notifications
    const returnRequests = allReturnRequests || [];
    returnRequests.forEach(ret => {
      const isMyReturn = normalize(ret.requesterName) === activeUserNorm || activeUserNorm.includes(normalize(ret.requesterName)) || normalize(ret.requesterName).includes(activeUserNorm);

      if (isAdminOrManager) {
        if (isManager && (ret.status === 'Pending Manager Approval' || ret.status === 'Pending')) {
          const id = `ret-pending-mgr-${ret.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Return Pending Manager Approval",
              message: `${ret.requesterName} requested to return ${ret.assetName} (Reason: ${ret.returnReason || "None"})`,
              type: 'info',
              timestamp: formatTime(ret.requestDate),
              isRead: readIds.has(id),
              actionLink: 'AssetReturns',
              category: 'Request'
            });
          }
        } else if (isAdmin && ret.status === 'Pending Admin Verification') {
          const id = `ret-pending-adm-${ret.id}`;
          if (!clearedIds.has(id)) {
            notifications.push({
              id,
              title: "Asset Return Pending Admin Verification",
              message: `Manager approved return of ${ret.assetName} by ${ret.requesterName}. Awaiting Admin verification.`,
              type: 'info',
              timestamp: formatTime(ret.requestDate),
              isRead: readIds.has(id),
              actionLink: 'AssetReturns',
              category: 'Request'
            });
          }
        }
      }

      if (isMyReturn) {
        if (ret.status === 'Approved' || ret.status === 'Rejected' || ret.status === 'Completed' || ret.status === 'Pending Admin Verification') {
          const id = `ret-resolved-${ret.id}-${ret.status}`;
          if (!clearedIds.has(id)) {
            let titleText = "Return Request Manager Approved";
            let type: 'info' | 'success' | 'warning' | 'error' = 'info';
            let messageText = `Your return request for ${ret.assetName} has been approved by your manager. Awaiting Admin verification.`;

            if (ret.status === 'Rejected') {
              titleText = "Return Request Rejected";
              type = 'error';
              messageText = `Your return request for ${ret.assetName} was rejected. Note: ${ret.managerComment || ""}`;
            } else if (ret.status === 'Completed' || ret.status === 'Approved') {
              titleText = "Asset Return Completed";
              type = 'success';
              messageText = `Your return of ${ret.assetName} is complete and has been checked back into stock.`;
            }

            notifications.push({
              id,
              title: titleText,
              message: messageText,
              type,
              timestamp: formatTime(ret.completedDate || ret.requestDate),
              isRead: readIds.has(id),
              actionLink: 'MyRequests',
              category: 'Assignment'
            });
          }
        }
      }
    });

    // Sort notifications by timestamp descending
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return notifications;
}
