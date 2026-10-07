import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { IEventLog, IAuditLogFilters } from '../models/IEventLog';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { Shimmer } from '@fluentui/react/lib/Shimmer';
import { RoleUtils, UserRole } from '../utils/RoleUtils';
import { EventFilters } from './EventFilters';
import { EventTimeline, ActivityPulse } from './events/EventTimeline';
import { Pager } from './common/Pager';
import { InventoryService } from '../services/InventoryService';
import { AssetTypeLookupService } from '../services/AssetTypeLookupService';
import { DEFAULT_ASSET_TYPE_OPTIONS } from '../constants/DropdownConstants';
import { applyClientFilters, mergeAssetTypes, buildUserOptions, MY_ACTIVITY_KEY } from '../utils/EventLogUtils';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';

export interface IEventStreamProps {
  logs: IEventLog[]; // preserved for backwards compatibility but we load internally
  loading: boolean; // preserved for backwards compatibility but we load internally
  errorMessage?: string;
  currentUserRole: UserRole;
  currentUserName: string;
  refreshTrigger?: number; // Added to trigger refresh on command from parent
}

const PAGE_SIZE = 10;

const DEFAULT_FILTERS: IAuditLogFilters = {
  searchQuery: '',
  dateRangeType: 'All',
  action: 'All',
  module: 'All',
  assetType: 'All',
  user: 'All',
  status: 'All',
  sortOrder: 'NewestFirst'
};

const STANDARD_ASSET_TYPES: string[] = DEFAULT_ASSET_TYPE_OPTIONS.map(o => String(o.key));

const css = mergeStyleSets({
  root: { color: 'var(--text-main, #242424)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
  title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
  subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
  notice: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '12px 16px', borderRadius: 10, marginBottom: 16 },
  resultLine: { fontSize: 13, color: 'var(--text-muted, #616161)', margin: '0 0 12px' },
  empty: { padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted, #616161)', border: '1px dashed rgba(128, 128, 128, 0.3)', borderRadius: 12 },
  loading: { display: 'flex', flexDirection: 'column', gap: 18, padding: '8px 0' },
  pager: { marginTop: 12 }
});

export const EventStream: React.FC<IEventStreamProps> = (props) => {
  const [filters, setFilters] = useState<IAuditLogFilters>(DEFAULT_FILTERS);

  const [logs, setLogs] = useState<IEventLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [manualRefresh, setManualRefresh] = useState<number>(0);

  // Filter option lists
  const [actionsList, setActionsList] = useState<string[]>([]);
  const [baseAssetTypes, setBaseAssetTypes] = useState<string[]>(STANDARD_ASSET_TYPES);
  const [knownUsers, setKnownUsers] = useState<string[]>([]);

  const isEmployee = props.currentUserRole === 'Inventory Employee';

  // Load filter option lists: actions/users from the last 90 days of logs,
  // asset types from the standard types plus every type used in Inventory/Requests.
  useEffect(() => {
    const loadFilterMetadata = async (): Promise<void> => {
      try {
        const [initLogs, lookup] = await Promise.all([
          InventoryService.getFilteredAuditLogs({ ...DEFAULT_FILTERS, dateRangeType: 'Last90' }),
          AssetTypeLookupService.getLookup()
        ]);

        const actions = Array.from(new Set(initLogs.map(l => l.action).filter(Boolean)));
        const users = Array.from(new Set(initLogs.map(l => l.user).filter(Boolean)));

        setActionsList(actions.sort());
        setKnownUsers(users);
        setBaseAssetTypes(mergeAssetTypes(STANDARD_ASSET_TYPES, lookup.knownTypes, initLogs.map(l => l.assetType)));
      } catch (err) {
        console.warn("Failed to load filter metadata:", err);
      }
    };
    loadFilterMetadata().catch(() => undefined);
  }, []);

  // Fetch logs whenever server-side filters or refresh trigger change
  useEffect(() => {
    const fetchLogs = async (): Promise<void> => {
      setLoading(true);
      try {
        // Search and User are filtered client-side, against the names actually displayed.
        const fetched = await InventoryService.getFilteredAuditLogs({
          ...filters,
          searchQuery: '',
          user: 'All'
        });
        setLogs(fetched);
      } catch (err) {
        console.error("Failed to fetch filtered audit logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs().catch(() => undefined);
    setCurrentPage(1); // Reset page to 1 when filters change
  }, [
    filters.dateRangeType,
    filters.startDate,
    filters.endDate,
    filters.action,
    filters.module,
    props.refreshTrigger,
    manualRefresh
  ]);

  // Reset to page 1 when client-side filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchQuery, filters.assetType, filters.user, filters.status, filters.sortOrder]);

  const handleClearFilters = (): void => {
    setFilters(prev => ({
      ...DEFAULT_FILTERS,
      searchQuery: prev.searchQuery // Preserve search text
    }));
  };

  // Include types seen in the currently loaded logs so a newly used type is selectable immediately.
  const assetTypesList = useMemo(
    () => mergeAssetTypes(baseAssetTypes, logs.map(l => l.assetType)),
    [baseAssetTypes, logs]
  );

  const canViewAuditDetails = RoleUtils.canViewAuditLogs(props.currentUserRole);

  // 1. Apply role-based visibility filtering client-side
  const roleBasedFilteredLogs = useMemo(() => {
    if (isEmployee) {
      const me = props.currentUserName.toLowerCase();
      return logs.filter(log =>
        (log.user || '').toLowerCase().includes(me) ||
        (log.details || '').toLowerCase().includes(me)
      );
    }
    return logs;
  }, [logs, isEmployee, props.currentUserName]);

  // User options with event counts under the current server-side filters. Users seen in the
  // last 90 days (and the current selection) are kept with a 0 count so the list stays stable.
  const userOptions = useMemo(() => {
    const extra = filters.user !== 'All' && filters.user !== MY_ACTIVITY_KEY ? knownUsers.concat([filters.user]) : knownUsers;
    return buildUserOptions(roleBasedFilteredLogs, extra);
  }, [roleBasedFilteredLogs, knownUsers, filters.user]);

  // 2. Apply client-side search, asset type, user, status filters, and sorting
  const filteredLogs = useMemo(() => {
    const userFilter = filters.user === MY_ACTIVITY_KEY ? props.currentUserName : filters.user;
    return applyClientFilters(roleBasedFilteredLogs, { ...filters, user: userFilter });
  }, [roleBasedFilteredLogs, filters.searchQuery, filters.assetType, filters.user, filters.status, filters.sortOrder, props.currentUserName]);

  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + PAGE_SIZE);

  // Day headings only make sense while the events are in date order.
  const inDateOrder = filters.sortOrder === 'NewestFirst' || filters.sortOrder === 'OldestFirst';

  return (
    <div className={css.root}>
      <div className={css.header}>
        <div>
          <h3 className={css.title}>{strings.Nav.EventStream}</h3>
          <p className={css.subtitle}>{strings.EventFeed.Subtitle}</p>
        </div>
        <DefaultButton text={strings.EventFeed.Refresh} iconProps={{ iconName: 'Refresh' }} onClick={() => setManualRefresh(n => n + 1)} disabled={loading} />
      </div>

      {props.errorMessage && (
        <div className={css.notice}>
          <strong>{strings.EventStream.NoticeLabel}</strong> {props.errorMessage}
        </div>
      )}

      <ActivityPulse logs={filteredLogs} showPeople={canViewAuditDetails} />

      {/* Advanced Filters Panel */}
      <EventFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        actionsList={actionsList}
        assetTypesList={assetTypesList}
        userOptions={userOptions}
        currentUserName={props.currentUserName}
      />

      {loading ? (
        <div className={css.loading} aria-busy="true" aria-label={strings.EventStream.LoadingAuditLogs}>
          {[0, 1, 2, 3].map(i => (
            <div key={i}>
              <Shimmer width="45%" styles={{ root: { marginBottom: 8 } }} />
              <Shimmer width="80%" />
            </div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className={css.empty}>
          <Icon iconName={roleBasedFilteredLogs.length === 0 ? 'ActivityFeed' : 'Search'} style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
          {roleBasedFilteredLogs.length === 0
            ? (isEmployee ? strings.EventStream.NoEventsForYou : strings.EventStream.NoEventsRecorded)
            : strings.EventStream.NoEventsMatchFilters}
        </div>
      ) : (
        <>
          <p className={css.resultLine}>{formatString(strings.EventFeed.ResultEvents, totalItems, roleBasedFilteredLogs.length)}</p>
          <EventTimeline logs={paginatedLogs} groupByDay={inDateOrder} showAudit={canViewAuditDetails} />
          <div className={css.pager}>
            <Pager page={activePage} pageSize={PAGE_SIZE} totalItems={totalItems} onChange={setCurrentPage} />
          </div>
        </>
      )}
    </div>
  );
};
