import * as strings from 'InventoryManagementWebPartStrings';

/** Maps a raw IRequest.status value to its localized display text. */
export function getAssetRequestStatusDisplayText(rawStatus: string | undefined): string {
  const val = rawStatus || 'Pending';
  if (val === 'Approved by Manager' || val === 'Approved') return strings.Dropdowns.AssetRequestStatus.ApprovedByManager;
  if (val === 'Asset Assigned') return strings.Dropdowns.AssetRequestStatus.AssetAssigned;
  if (val === 'Rejected' || val === 'Declined') return strings.Dropdowns.AssetRequestStatus.Rejected;
  return strings.RequestList.StatusPendingManagerApproval;
}

/** Maps a raw IReturnRequest.status value to its localized display text. */
export function getReturnRequestStatusDisplayText(rawStatus: string | undefined): string {
  switch (rawStatus) {
    case 'Pending':
    case 'Pending Manager Approval':
      return strings.RequestList.StatusPendingManagerApproval;
    case 'Pending Admin Verification':
      return strings.ReturnRequestList.StatusPendingAdminVerification;
    case 'Approved':
      return strings.Dropdowns.ReturnRequestStatus.Approved;
    case 'Rejected':
      return strings.Dropdowns.ReturnRequestStatus.Rejected;
    case 'Completed':
      return strings.Dropdowns.ReturnRequestStatus.Completed;
    default:
      return rawStatus || '';
  }
}
