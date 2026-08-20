import * as React from 'react';
import { INotification } from '../models/INotification';
import { 
  Pivot, 
  PivotItem, 
  Stack, 
  IStackTokens,
  DefaultButton, 
  PrimaryButton, 
  IconButton, 
  Icon,
  Checkbox
} from '@fluentui/react';

export interface INotificationCenterProps {
  notifications: INotification[];
  clearedNotificationIds: string[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string, tab: string) => void;
  onClearAllNotifications: () => void;
  onClearNotifications?: (ids: string[], tab: string) => void;
  onNotificationAction: (actionLink: string, notificationId: string) => void;
}

export const NotificationCenter: React.FC<INotificationCenterProps> = (props) => {
  const [filter, setFilter] = React.useState<string>('All');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = React.useState<boolean>(false);
  const containerStackTokens: IStackTokens = { childrenGap: 15 };
  const itemStackTokens: IStackTokens = { childrenGap: 10 };

  const handleFilterClick = (item?: PivotItem) => {
    if (item) {
      setFilter(item.props.itemKey || 'All');
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  const filteredNotifications = props.notifications.filter(n => {
    // 1. Check if cleared for this specific tab view
    const clearKey = `${n.id}::${filter}`;
    if (props.clearedNotificationIds.indexOf(clearKey) !== -1) return false;

    // 2. Legacy check
    if (props.clearedNotificationIds.indexOf(n.id) !== -1) return false;

    // 3. Category match
    if (filter === 'All') return true;
    if (filter === 'Request' && n.category === 'Request') return true;
    if (filter === 'Assignment' && n.category === 'Assignment') return true;
    if (filter === 'Audit' && n.category === 'Audit') return true;
    return false;
  });

  const unreadCount = filteredNotifications.filter(n => !n.isRead).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#f0fdf4',
          borderColor: '#22c55e',
          iconName: 'StatusCircleCheckmark',
          iconColor: '#16a34a'
        };
      case 'warning':
        return {
          backgroundColor: '#fff7ed',
          borderColor: '#f97316',
          iconName: 'Warning',
          iconColor: '#ea580c'
        };
      case 'error':
        return {
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444',
          iconName: 'ErrorBadge',
          iconColor: '#dc2626'
        };
      case 'info':
      default:
        return {
          backgroundColor: '#eff6ff',
          borderColor: '#3b82f6',
          iconName: 'Info',
          iconColor: '#2563eb'
        };
    }
  };

  return (
    <Stack tokens={containerStackTokens} style={{ marginTop: '20px', padding: '5px' }}>
      {/* Header controls */}
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={{ root: { flexWrap: 'wrap', gap: '10px' } }}>
        <Pivot 
          aria-label="Filter Notifications" 
          selectedKey={filter} 
          onLinkClick={handleFilterClick}
          styles={{ root: { marginBottom: 0 } }}
        >
          <PivotItem headerText="All" itemKey="All" />
          <PivotItem headerText="Requests" itemKey="Request" />
          <PivotItem headerText="Assignments" itemKey="Assignment" />
          <PivotItem headerText="System Alerts" itemKey="Audit" />
        </Pivot>

        <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center" styles={{ root: { flexWrap: 'wrap' } }}>
          {!isSelectionMode ? (
            <>
              {unreadCount > 0 && (
                <DefaultButton 
                  iconProps={{ iconName: 'CheckMark' }} 
                  text="Mark all as read" 
                  onClick={props.onMarkAllAsRead} 
                  styles={{ root: { borderRadius: '6px' } }}
                />
              )}
              {filteredNotifications.length > 0 && (
                <DefaultButton 
                  iconProps={{ iconName: 'Clear' }} 
                  text="Clear filtered" 
                  onClick={() => setIsSelectionMode(true)} 
                  styles={{ root: { borderRadius: '6px', color: '#b91c1c' } }}
                />
              )}
            </>
          ) : (
            <>
              {filteredNotifications.length > 0 && (
                <Checkbox
                  label="Select all"
                  checked={filteredNotifications.length > 0 && filteredNotifications.every(n => selectedIds.has(n.id))}
                  indeterminate={filteredNotifications.some(n => selectedIds.has(n.id)) && !filteredNotifications.every(n => selectedIds.has(n.id))}
                  onChange={(_, checked) => {
                    const newSelected = new Set(selectedIds);
                    if (checked) {
                      filteredNotifications.forEach(n => newSelected.add(n.id));
                    } else {
                      filteredNotifications.forEach(n => newSelected.delete(n.id));
                    }
                    setSelectedIds(newSelected);
                  }}
                  styles={{ root: { marginRight: 8 } }}
                />
              )}
              <DefaultButton 
                text="Cancel" 
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedIds(new Set());
                }} 
                styles={{ root: { borderRadius: '6px' } }}
              />
              <PrimaryButton 
                iconProps={{ iconName: 'Clear' }} 
                text={`Clear selected (${selectedIds.size})`} 
                disabled={selectedIds.size === 0}
                onClick={() => {
                  const idsToClear = Array.from(selectedIds);
                  if (props.onClearNotifications) {
                    props.onClearNotifications(idsToClear, filter);
                  } else {
                    idsToClear.forEach(id => props.onClearNotification(id, filter));
                  }
                  setSelectedIds(new Set());
                  setIsSelectionMode(false);
                }}
                styles={{ root: { borderRadius: '6px', backgroundColor: '#b91c1c', borderColor: '#b91c1c' } }}
              />
            </>
          )}
        </Stack>
      </Stack>

      {/* Notifications list */}
      <Stack tokens={itemStackTokens}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px 20px',
            backgroundColor: 'var(--surface-color, #ffffff)',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <Icon iconName="Ringer" style={{ fontSize: '48px', color: '#9ca3af', marginBottom: '15px' }} />
            <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>All Caught Up!</h4>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.85rem' }}>
              No notifications found in the "{filter === 'All' ? 'All' : filter + 's'}" category.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const styles = getTypeStyles(notif.type);
            return (
              <div 
                key={notif.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '16px',
                  backgroundColor: notif.isRead ? 'var(--surface-color, #ffffff)' : styles.backgroundColor,
                  borderLeft: `4px solid ${styles.borderColor}`,
                  borderRadius: '6px',
                  boxShadow: notif.isRead ? '0 1px 2px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.08)',
                  borderTop: '1px solid #f3f4f6',
                  borderRight: '1px solid #f3f4f6',
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  gap: '12px'
                }}
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <Checkbox
                    checked={selectedIds.has(notif.id)}
                    onChange={(_, checked) => {
                      const newSelected = new Set(selectedIds);
                      if (checked) {
                        newSelected.add(notif.id);
                      } else {
                        newSelected.delete(notif.id);
                      }
                      setSelectedIds(newSelected);
                    }}
                    styles={{
                      root: {
                        marginTop: '4px'
                      }
                    }}
                  />
                )}

                {/* Type Icon */}
                <Icon 
                  iconName={styles.iconName} 
                  style={{ 
                    fontSize: '20px', 
                    color: styles.iconColor, 
                    marginTop: '2px' 
                  }} 
                />

                {/* Content */}
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#111827', fontSize: '0.95rem' }}>{notif.title}</strong>
                      
                      {/* Pulsing red dot for unread */}
                      {!notif.isRead && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%',
                          display: 'inline-block',
                          boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.4)'
                        }} />
                      )}
                    </div>

                    <span style={{ fontSize: '0.75rem', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {notif.timestamp}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '0.88rem', lineHeight: '1.4' }}>
                    {notif.message}
                  </p>

                  <Stack horizontal tokens={{ childrenGap: 8 }}>
                    {/* View action button */}
                    <PrimaryButton 
                      text="View details" 
                      onClick={() => props.onNotificationAction(notif.actionLink, notif.id)}
                      styles={{ 
                        root: { 
                          height: '28px', 
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          padding: '0 12px'
                        } 
                      }}
                    />
                    
                    {/* Mark read button if unread */}
                    {!notif.isRead && (
                      <DefaultButton 
                        text="Mark as read" 
                        onClick={() => props.onMarkAsRead(notif.id)}
                        styles={{ 
                          root: { 
                            height: '28px', 
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            padding: '0 12px'
                          } 
                        }}
                      />
                    )}
                  </Stack>
                </div>

                {/* Individual Dismiss Button */}
                <IconButton 
                  iconProps={{ iconName: 'Cancel' }} 
                  title="Dismiss notification" 
                  ariaLabel="Dismiss notification"
                  onClick={() => props.onClearNotification(notif.id, filter)}
                  styles={{ 
                    root: { 
                      color: '#9ca3af', 
                      marginTop: '-8px', 
                      marginRight: '-8px' 
                    },
                    rootHovered: {
                      color: '#4b5563',
                      backgroundColor: 'rgba(0,0,0,0.03)'
                    }
                  }}
                />
              </div>
            );
          })
        )}
      </Stack>
    </Stack>
  );
};
