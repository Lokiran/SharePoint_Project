import * as React from 'react';
import { INotification } from '../models/INotification';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { ActionButton, IconButton, Icon, SearchBox, MessageBar, MessageBarType, Link } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import {
  INotificationPage,
  NotificationDateGroup,
  formatFullTime,
  formatRelativeTime,
  getCategoryLabel,
  getDateGroup,
  getDateGroupLabel,
  getNotificationPage,
  getNotificationTone
} from '../utils/NotificationUtils';

export interface INotificationCenterProps {
  notifications: INotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearNotification: (id: string) => void;
  /** Legacy bulk dismiss by category; used only when onClearNotifications isn't provided. */
  onClearAllNotifications: (filterTab?: string) => void;
  onNotificationAction: (actionLink: string, notificationId: string) => void;
  isAllCleared?: boolean;
  onMarkAsUnread?: (id: string) => void;
  /** Dismisses exactly these notifications (the ones currently shown). */
  onClearNotifications?: (ids: string[]) => void;
  /** Undo for a dismiss. */
  onRestoreNotifications?: (ids: string[]) => void;
  /** Navigates to a page of the app. */
  onOpenPage?: (pageKey: string) => void;
  /** Pages the current user can open, used for the "Open ..." links. */
  availablePages?: INotificationPage[];
}

type FilterKey = 'All' | 'Unread' | 'Request' | 'Assignment' | 'Audit';

const PAGE_SIZE = 25;
const GROUP_ORDER: NotificationDateGroup[] = ['today', 'yesterday', 'week', 'older'];

const css = mergeStyleSets({
  root: { marginTop: 8, color: 'var(--text-main, #242424)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
  headerActions: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 32,
    padding: '0 12px',
    borderRadius: 16,
    border: '1px solid rgba(0, 0, 0, 0.14)',
    background: 'var(--surface-bg, #ffffff)',
    color: 'var(--text-main, #242424)',
    font: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    selectors: {
      ':hover': { borderColor: 'rgba(0, 0, 0, 0.3)' },
      ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: 2 }
    }
  },
  chipActive: {
    background: '#0f6cbd',
    borderColor: '#0f6cbd',
    color: '#ffffff',
    selectors: { ':hover': { borderColor: '#0f6cbd' } }
  },
  chipCount: {
    minWidth: 20,
    height: 20,
    padding: '0 6px',
    borderRadius: 10,
    fontSize: 11,
    lineHeight: '20px',
    textAlign: 'center',
    boxSizing: 'border-box',
    background: 'rgba(0, 0, 0, 0.06)'
  },
  chipCountActive: { background: 'rgba(255, 255, 255, 0.25)' },
  search: { width: 260, maxWidth: '100%' },
  card: {
    background: 'var(--surface-bg, #ffffff)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: 'var(--card-shadow, 0 1px 2px rgba(0, 0, 0, 0.06))'
  },
  groupLabel: {
    margin: 0,
    padding: '10px 20px',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--text-muted, #616161)',
    background: 'rgba(0, 0, 0, 0.025)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  row: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 12px 14px 20px',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    selectors: {
      ':hover': { background: 'rgba(0, 0, 0, 0.03)' },
      ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 },
      ':hover .notif-actions, :focus-within .notif-actions': { opacity: 1 }
    }
  },
  rowUnread: { background: 'rgba(15, 108, 189, 0.05)' },
  unreadDot: { position: 'absolute', left: 7, top: 26, width: 8, height: 8, borderRadius: '50%', background: '#0f6cbd' },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 16
  },
  body: { flex: 1, minWidth: 0 },
  titleLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  rowTitle: { fontSize: 14, lineHeight: '20px' },
  pill: {
    fontSize: 11,
    fontWeight: 600,
    padding: '1px 8px',
    borderRadius: 999,
    color: 'var(--text-muted, #616161)',
    border: '1px solid rgba(0, 0, 0, 0.12)'
  },
  message: {
    margin: '2px 0 0',
    fontSize: 13,
    lineHeight: '20px',
    color: 'var(--text-muted, #424242)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  openLink: { display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 13, fontWeight: 600 },
  side: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 },
  time: { fontSize: 12, color: 'var(--text-muted, #616161)', whiteSpace: 'nowrap', paddingRight: 8, lineHeight: '20px' },
  actions: { display: 'flex', opacity: 0.55, transition: 'opacity 0.15s ease' },
  showMore: { display: 'flex', justifyContent: 'center', padding: 8 },
  empty: { textAlign: 'center', padding: '56px 24px' },
  emptyIcon: {
    width: 56,
    height: 56,
    margin: '0 auto 14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    color: '#0f6cbd',
    background: 'rgba(15, 108, 189, 0.1)'
  },
  emptyTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 600 },
  emptyText: { margin: 0, fontSize: 14, color: 'var(--text-muted, #616161)' },
  undo: { marginBottom: 12 }
});

export const NotificationCenter: React.FC<INotificationCenterProps> = (props) => {
  const n = strings.Notifications;
  const [filter, setFilter] = React.useState<FilterKey>('All');
  const [search, setSearch] = React.useState('');
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const [undo, setUndo] = React.useState<{ ids: string[] } | undefined>();
  const undoTimer = React.useRef<number | undefined>();

  React.useEffect(() => () => window.clearTimeout(undoTimer.current), []);
  React.useEffect(() => setLimit(PAGE_SIZE), [filter, search]);

  const all = props.isAllCleared ? [] : props.notifications;
  const counts: { [key in FilterKey]: number } = {
    All: all.length,
    Unread: all.filter(x => !x.isRead).length,
    Request: all.filter(x => x.category === 'Request').length,
    Assignment: all.filter(x => x.category === 'Assignment').length,
    Audit: all.filter(x => x.category === 'Audit').length
  };

  const query = search.trim().toLowerCase();
  const filtered = all.filter(x => {
    if (filter === 'Unread' && x.isRead) return false;
    if ((filter === 'Request' || filter === 'Assignment' || filter === 'Audit') && x.category !== filter) return false;
    return !query || `${x.title} ${x.message}`.toLowerCase().indexOf(query) >= 0;
  });
  const shown = filtered.slice(0, limit);

  const now = new Date();
  const groups = GROUP_ORDER
    .map(group => ({ group, items: shown.filter(x => getDateGroup(x.timestamp, now) === group) }))
    .filter(g => g.items.length > 0);

  const showUndo = (ids: string[]): void => {
    if (!props.onRestoreNotifications) return;
    setUndo({ ids });
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(undefined), 8000);
  };

  const dismiss = (id: string): void => {
    props.onClearNotification(id);
    showUndo([id]);
  };

  const dismissShown = (): void => {
    const ids = filtered.map(x => x.id);
    if (ids.length === 0) return;
    if (props.onClearNotifications) {
      props.onClearNotifications(ids);
      showUndo(ids);
    } else {
      props.onClearAllNotifications(filter === 'Unread' ? 'All' : filter);
    }
  };

  const open = (x: INotification): void => props.onNotificationAction(x.actionLink, x.id);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'All', label: n.TabAll },
    { key: 'Unread', label: n.FilterUnread },
    { key: 'Request', label: n.TabRequests },
    { key: 'Assignment', label: n.TabAssignments },
    { key: 'Audit', label: n.TabSystemAlerts }
  ];

  const subtitle = counts.Unread === 0
    ? n.NoUnreadSummary
    : counts.Unread === 1 ? n.UnreadSummaryOne : formatString(n.UnreadSummary, counts.Unread);

  const renderEmpty = (): React.ReactNode => {
    let title = n.AllCaughtUpTitle;
    let text = formatString(n.EmptyStateMessage, filters.filter(f => f.key === filter)[0].label);
    if (query) {
      title = n.NoSearchResultsTitle;
      text = formatString(n.NoSearchResults, search.trim());
    } else if (filter === 'Unread') {
      text = n.EmptyUnread;
    }
    return (
      <div className={css.empty}>
        <div className={css.emptyIcon}><Icon iconName={query ? 'Search' : 'Ringer'} /></div>
        <h4 className={css.emptyTitle}>{title}</h4>
        <p className={css.emptyText}>{text}</p>
      </div>
    );
  };

  const renderRow = (x: INotification): React.ReactNode => {
    const tone = getNotificationTone(x.type);
    const page = getNotificationPage(x, props.availablePages);
    return (
      <li
        key={x.id}
        className={`${css.row} ${x.isRead ? '' : css.rowUnread}`}
        onClick={() => open(x)}
        onKeyDown={e => {
          if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            open(x);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${x.isRead ? '' : n.FilterUnread + ': '}${x.title}. ${x.message}`}
      >
        {!x.isRead && <span className={css.unreadDot} aria-hidden="true" />}
        <span className={css.iconWrap} style={{ backgroundColor: tone.soft, color: tone.color }} aria-hidden="true">
          <Icon iconName={tone.icon} />
        </span>
        <div className={css.body}>
          <div className={css.titleLine}>
            <span className={css.rowTitle} style={{ fontWeight: x.isRead ? 400 : 600 }}>{x.title}</span>
            <span className={css.pill}>{getCategoryLabel(x.category)}</span>
          </div>
          <p className={css.message}>{x.message}</p>
          {page && props.onOpenPage && (
            <Link
              className={css.openLink}
              onClick={e => {
                e.stopPropagation();
                props.onMarkAsRead(x.id);
                props.onOpenPage!(page.key);
              }}
            >
              {formatString(n.OpenPage, page.text)} <Icon iconName="ChevronRight" style={{ fontSize: 10 }} />
            </Link>
          )}
        </div>
        <div className={css.side}>
          <span className={css.time} title={formatFullTime(x.timestamp)}>{formatRelativeTime(x.timestamp, now)}</span>
          <div className={`${css.actions} notif-actions`} onClick={e => e.stopPropagation()}>
            {x.isRead ? (
              props.onMarkAsUnread && (
                <IconButton
                  iconProps={{ iconName: 'Mail' }}
                  title={n.MarkAsUnread}
                  ariaLabel={n.MarkAsUnread}
                  onClick={() => props.onMarkAsUnread!(x.id)}
                />
              )
            ) : (
              <IconButton
                iconProps={{ iconName: 'Read' }}
                title={n.MarkAsRead}
                ariaLabel={n.MarkAsRead}
                onClick={() => props.onMarkAsRead(x.id)}
              />
            )}
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              title={n.DismissNotification}
              ariaLabel={n.DismissNotification}
              onClick={() => dismiss(x.id)}
            />
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          <h3 className={css.title}>{strings.Nav.Notifications}</h3>
          <p className={css.subtitle}>{subtitle}</p>
        </div>
        <div className={css.headerActions}>
          <ActionButton
            iconProps={{ iconName: 'CheckMark' }}
            text={n.MarkAllAsRead}
            onClick={props.onMarkAllAsRead}
            disabled={counts.Unread === 0}
          />
          <ActionButton
            iconProps={{ iconName: 'Clear' }}
            text={n.DismissShown}
            onClick={dismissShown}
            disabled={filtered.length === 0}
          />
        </div>
      </div>

      <div className={css.toolbar}>
        <div className={css.chips} role="group" aria-label={n.FilterAriaLabel}>
          {filters.map(f => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                className={`${css.chip} ${active ? css.chipActive : ''}`}
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span className={`${css.chipCount} ${active ? css.chipCountActive : ''}`}>{counts[f.key]}</span>
              </button>
            );
          })}
        </div>
        <SearchBox
          className={css.search}
          placeholder={n.SearchPlaceholder}
          value={search}
          onChange={(_, v) => setSearch(v || '')}
          onClear={() => setSearch('')}
        />
      </div>

      {undo && (
        <MessageBar
          className={css.undo}
          messageBarType={MessageBarType.info}
          onDismiss={() => setUndo(undefined)}
          dismissButtonAriaLabel={strings.Common.Close}
          actions={
            <ActionButton
              iconProps={{ iconName: 'Undo' }}
              text={n.Undo}
              onClick={() => {
                if (props.onRestoreNotifications) props.onRestoreNotifications(undo.ids);
                setUndo(undefined);
              }}
            />
          }
          isMultiline={false}
        >
          {undo.ids.length === 1 ? n.DismissedOne : formatString(n.DismissedMany, undo.ids.length)}
        </MessageBar>
      )}

      <div className={css.card}>
        {filtered.length === 0 ? renderEmpty() : (
          <>
            {groups.map(g => (
              <section key={g.group} aria-label={getDateGroupLabel(g.group)}>
                <h4 className={css.groupLabel}>{getDateGroupLabel(g.group)}</h4>
                <ul className={css.list}>{g.items.map(renderRow)}</ul>
              </section>
            ))}
            {filtered.length > shown.length && (
              <div className={css.showMore}>
                <ActionButton
                  iconProps={{ iconName: 'ChevronDown' }}
                  text={formatString(n.ShowMore, filtered.length - shown.length)}
                  onClick={() => setLimit(limit + PAGE_SIZE)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
