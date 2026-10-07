import * as React from 'react';
import * as strings from 'InventoryManagementWebPartStrings';

interface IBadgeStyle { bg: string; fg: string; label: () => string }

const BLUE = { bg: '#dbeafe', fg: '#1e40af' };
const GREEN = { bg: '#dcfce7', fg: '#166534' };
const RED = { bg: '#fee2e2', fg: '#991b1b' };
const PURPLE = { bg: '#f3e8ff', fg: '#6b21a8' };
const ORANGE = { bg: '#ffedd5', fg: '#9a3412' };
const TEAL = { bg: '#ccfbf1', fg: '#115e59' };
const AMBER = { bg: '#fef3c7', fg: '#92400e' };
const NEUTRAL = { bg: '#f3f4f6', fg: '#374151' };

// Keyed by the normalized (lower-case, trimmed) action text produced by AuditLogService.
// Labels are functions so the runtime language switcher is picked up on re-render.
const ACTION_BADGES: Record<string, IBadgeStyle> = {
  'created': { ...BLUE, label: () => strings.EventStream.ActionCreated },
  'create': { ...BLUE, label: () => strings.EventStream.ActionCreated },
  'manager approved': { ...GREEN, label: () => strings.EventStream.ActionManagerApproved },
  'manager rejected': { ...RED, label: () => strings.EventStream.ActionManagerRejected },
  'admin assigned': { ...PURPLE, label: () => strings.EventStream.ActionAdminAssigned },
  'status updated to in progress': { ...ORANGE, label: () => strings.EventStream.ActionInProgress },
  'status updated to resolved': { ...TEAL, label: () => strings.EventStream.ActionResolved },
  'deleted': { ...RED, label: () => strings.EventStream.ActionDeleted },
  'delete': { ...RED, label: () => strings.EventStream.ActionDeleted },
  'return requested': { ...ORANGE, label: () => strings.EventStream.ActionReturnRequested },
  'return approved': { ...GREEN, label: () => strings.EventStream.ActionReturnApproved },
  'return completed': { ...TEAL, label: () => strings.EventStream.ActionReturnCompleted },
  'return rejected': { ...RED, label: () => strings.EventStream.ActionReturnRejected },
  'activated': { ...GREEN, label: () => strings.EventStream.ActionActivated },
  'inactivated': { ...AMBER, label: () => strings.EventStream.ActionInactivated },
  'deactivated': { ...RED, label: () => strings.EventStream.ActionDeactivated },
  'update': { ...ORANGE, label: () => strings.EventStream.ActionUpdated }
};

// Fluent icon per action, for the Event Stream timeline.
const ACTION_ICONS: Record<string, string> = {
  'created': 'Add',
  'create': 'Add',
  'manager approved': 'Accept',
  'manager rejected': 'Cancel',
  'admin assigned': 'Contact',
  'status updated to in progress': 'Clock',
  'status updated to resolved': 'CheckMark',
  'deleted': 'Delete',
  'delete': 'Delete',
  'return requested': 'Undo',
  'return approved': 'Accept',
  'return completed': 'CheckMark',
  'return rejected': 'Cancel',
  'activated': 'Play',
  'inactivated': 'Pause',
  'deactivated': 'Blocked',
  'update': 'Edit',
  'updated': 'Edit'
};

/** Colours, icon and display label for an action (the same colours the badge uses). */
export const eventActionStyle = (action?: string): { bg: string; fg: string; icon: string; label: string } => {
  const raw = action || '';
  const key = raw.toLowerCase().trim();
  const badge = ACTION_BADGES[key];
  const colors = badge || NEUTRAL;
  return { bg: colors.bg, fg: colors.fg, icon: ACTION_ICONS[key] || 'Info', label: badge ? badge.label() : raw };
};

export const EventActionBadge: React.FC<{ action?: string }> = ({ action }) => {
  const raw = action || '';
  const badge = ACTION_BADGES[raw.toLowerCase().trim()];
  const colors = badge || NEUTRAL;

  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.fg,
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      display: 'inline-block',
      textTransform: 'lowercase'
    }}>
      {badge ? badge.label() : raw}
    </span>
  );
};
