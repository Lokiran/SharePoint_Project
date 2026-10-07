import * as React from 'react';
import {
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  ActionButton,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Icon
} from '@fluentui/react';
import { IConfigPageProps } from '../types/Config.types';
import {
  ListHealthService,
  getConfigListDefinitions,
  IListDefinition,
  IListHealthResult,
  IEnvironmentInfo,
  IGroupInfo,
  ListKey,
  ListHealthStatus,
  ListCheckKey
} from '../services/ListHealthService';
import styles from '../components/InventoryManagement.module.scss';
import css from './ConfigPage.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getAppConfig } from '../config/AppConfig';
import { StockThresholdsTab } from './config/StockThresholdsTab';
import { AccessGroupsTab } from './config/AccessGroupsTab';
import { MaintenanceTab } from './config/MaintenanceTab';

// Group names come from the web part's property pane (defaults: MSFT Owners / Members / Visitors).
const getRoleGroups = (): { group: string; role: () => string; desc: () => string }[] => {
  const g = getAppConfig().roleGroups;
  return [
    { group: g.admin, role: () => strings.ConfigPage.RoleLabel_Owners, desc: () => strings.ConfigPage.RoleDesc_Owners },
    { group: g.manager, role: () => strings.ConfigPage.RoleLabel_Members, desc: () => strings.ConfigPage.RoleDesc_Members },
    { group: g.employee, role: () => strings.ConfigPage.RoleLabel_Visitors, desc: () => strings.ConfigPage.RoleDesc_Visitors }
  ];
};

interface IListText { title: string; desc: string; tag?: string }

// Resolved on every render so the runtime language switcher takes effect immediately.
const getListText = (key: ListKey): IListText => {
  const s = strings.ConfigPage;
  switch (key) {
    case 'inventory': return { title: s.ListTitle_InventoryList, desc: s.ListDesc_InventoryList, tag: s.SchemaAssetDatabase };
    case 'request': return { title: s.ListTitle_RequestList, desc: s.ListDesc_RequestList, tag: s.SchemaApprovalWorkflows };
    case 'returnRequest': return { title: s.ListTitle_AssetReturnRequestList, desc: s.ListDesc_AssetReturnRequestList, tag: s.SchemaReturnsHandling };
    case 'mapping': return { title: s.ListTitle_MappingList, desc: s.ListDesc_MappingList, tag: s.SchemaCustodyTracking };
    case 'eventLog': return { title: s.ListTitle_EventLogList, desc: s.ListDesc_EventLogList, tag: s.SchemaAuditTrail };
    case 'incident': return { title: s.ListTitle_IncidentList, desc: s.ListDesc_IncidentList };
    case 'employee': return { title: s.ListTitle_EmployeeList, desc: s.ListDesc_EmployeeList };
    case 'replacement': return { title: s.ListTitle_ReplacementList, desc: s.ListDesc_ReplacementList };
    case 'stockThresholds': return { title: s.ListTitle_StockThresholdsList, desc: s.ListDesc_StockThresholdsList };
    case 'assetKits': return { title: s.ListTitle_AssetKitsList, desc: s.ListDesc_AssetKitsList };
    case 'appSettings': return { title: s.ListTitle_AppSettingsList, desc: s.ListDesc_AppSettingsList };
    default: return { title: key, desc: '' };
  }
};

const getCheckLabel = (key: ListCheckKey): string => {
  const s = strings.ConfigPage;
  switch (key) {
    case 'find': return s.Check_Find;
    case 'columns': return s.Check_Columns;
    case 'items': return s.Check_Items;
    case 'permissions': return s.Check_Permissions;
    default: return s.Check_Details;
  }
};

const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? '—' : d.toLocaleString();
};

const StatusPill: React.FC<{ status?: ListHealthStatus; testing?: boolean }> = ({ status, testing }) => {
  if (testing) {
    return <span className={`${css.pill} ${css.pillInfo}`}><Icon iconName="ProgressLoopOuter" className={css.spin} /> {strings.ConfigPage.StatusVerifying}</span>;
  }
  switch (status) {
    case 'healthy': return <span className={`${css.pill} ${css.pillGood}`}><Icon iconName="Completed" /> {strings.ConfigPage.StatusConnected}</span>;
    case 'warning': return <span className={`${css.pill} ${css.pillWarn}`}><Icon iconName="Warning" /> {strings.ConfigPage.StatusWarning}</span>;
    case 'missing': return <span className={`${css.pill} ${css.pillBad}`}><Icon iconName="Blocked2" /> {strings.ConfigPage.StatusMissing}</span>;
    case 'error': return <span className={`${css.pill} ${css.pillBad}`}><Icon iconName="ErrorBadge" /> {strings.ConfigPage.StatusFailed}</span>;
    default: return <span className={`${css.pill} ${css.pillNeutral}`}>{strings.ConfigPage.StatusNotVerified}</span>;
  }
};

interface IIssue { severity: 'bad' | 'warn'; text: string; listKey: ListKey }

const collectIssues = (results: Partial<Record<ListKey, IListHealthResult>>): IIssue[] => {
  const s = strings.ConfigPage;
  const issues: IIssue[] = [];
  getConfigListDefinitions().forEach(def => {
    const r = results[def.key];
    if (!r) return;
    const title = getListText(def.key).title;
    const add = (severity: IIssue['severity'], text: string): number => issues.push({ severity, text, listKey: def.key });
    if (r.status === 'error') {
      add('bad', formatString(s.Issue_Error, title, r.error || ''));
    } else if (!r.resolvedTitle) {
      if (def.autoCreated) {
        add('warn', formatString(s.Issue_AutoCreated, title));
      } else {
        add(def.optional ? 'warn' : 'bad', formatString(s.Issue_Missing, title, def.candidates[0]));
      }
    } else {
      if (r.missingColumns.length > 0) {
        add('warn', formatString(s.Issue_Columns, title, r.missingColumns.length, r.missingColumns.join(', ')));
      }
      if (r.canWrite === false) {
        add('bad', formatString(s.Issue_Write, title));
      }
    }
  });
  return issues.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'bad' ? -1 : 1));
};

export const ConfigPage: React.FC<IConfigPageProps> = (props) => {
  const { state, actions } = props;
  const s = strings.ConfigPage;

  // Read per render so property-pane changes to list titles and role groups show immediately.
  const LIST_DEFINITIONS = getConfigListDefinitions();
  const CORE_LISTS = LIST_DEFINITIONS.filter(d => !d.optional);
  const OPTIONAL_LISTS = LIST_DEFINITIONS.filter(d => d.optional);
  const ROLE_GROUPS = getRoleGroups();

  const cached = ListHealthService.lastReport;
  const [results, setResults] = React.useState<Partial<Record<ListKey, IListHealthResult>>>(() => {
    const map: Partial<Record<ListKey, IListHealthResult>> = {};
    if (cached) cached.results.forEach(r => { map[r.key] = r; });
    return map;
  });
  const [environment, setEnvironment] = React.useState<IEnvironmentInfo | undefined>(cached ? cached.environment : undefined);
  const [checkedAt, setCheckedAt] = React.useState<string | undefined>(cached ? cached.checkedAt : undefined);
  const [runningAll, setRunningAll] = React.useState(false);
  const [runError, setRunError] = React.useState<string | undefined>();
  const [testing, setTesting] = React.useState<Partial<Record<ListKey, boolean>>>({});
  const [expanded, setExpanded] = React.useState<Partial<Record<ListKey, boolean>>>({});
  const [groups, setGroups] = React.useState<Record<string, IGroupInfo>>({});
  const [loadingGroups, setLoadingGroups] = React.useState<Record<string, boolean>>({});

  const mounted = React.useRef(true);
  React.useEffect(() => () => { mounted.current = false; }, []);

  const runHealthCheck = React.useCallback(async (): Promise<void> => {
    setRunningAll(true);
    setRunError(undefined);
    try {
      const report = await ListHealthService.runHealthCheck();
      if (!mounted.current) return;
      const map: Partial<Record<ListKey, IListHealthResult>> = {};
      report.results.forEach(r => { map[r.key] = r; });
      setResults(map);
      setEnvironment(report.environment);
      setCheckedAt(report.checkedAt);
    } catch (e: any) {
      if (mounted.current) setRunError(e && e.message ? e.message : String(e));
    } finally {
      if (mounted.current) setRunningAll(false);
    }
  }, []);

  const testList = async (def: IListDefinition): Promise<void> => {
    setTesting(prev => ({ ...prev, [def.key]: true }));
    const r = await ListHealthService.checkList(def);
    if (!mounted.current) return;
    setResults(prev => ({ ...prev, [def.key]: r }));
    setTesting(prev => ({ ...prev, [def.key]: false }));
    if (r.status !== 'healthy') setExpanded(prev => ({ ...prev, [def.key]: true }));

    const report = ListHealthService.lastReport;
    if (report) {
      report.results = report.results.filter(x => x.key !== r.key).concat([r]);
    }
  };

  const loadGroup = async (groupName: string): Promise<void> => {
    setLoadingGroups(prev => ({ ...prev, [groupName]: true }));
    const info = await ListHealthService.loadGroup(groupName);
    if (!mounted.current) return;
    setGroups(prev => ({ ...prev, [groupName]: info }));
    setLoadingGroups(prev => ({ ...prev, [groupName]: false }));
  };

  const loadAllGroups = (): void => {
    ROLE_GROUPS.forEach(g => { loadGroup(g.group).catch(() => undefined); });
  };

  const exportReport = (): void => {
    const payload = {
      checkedAt,
      environment,
      lists: LIST_DEFINITIONS.map(def => ({
        name: getListText(def.key).title,
        expectedTitles: def.candidates,
        optional: !!def.optional,
        ...(results[def.key] || { status: 'not-checked' })
      })),
      groups: Object.keys(groups).map(k => ({ name: k, exists: groups[k].exists, memberCount: groups[k].members.length, error: groups[k].error }))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-health-${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // First visit this session: run the check automatically so the admin lands on live data.
  React.useEffect(() => {
    if (!ListHealthService.lastReport) {
      runHealthCheck().catch(() => undefined);
    }
  }, [runHealthCheck]);

  // Load group membership the first time the RBAC tab is opened.
  React.useEffect(() => {
    if (state.configSelectedTab === 'rbac' && Object.keys(groups).length === 0) {
      loadAllGroups();
    }
  }, [state.configSelectedTab]);

  const hasResults = Object.keys(results).length > 0;
  const coreResults = CORE_LISTS.map(d => results[d.key]).filter(Boolean) as IListHealthResult[];
  const coreReady = coreResults.filter(r => r.status === 'healthy').length;
  const missingColumnCount = coreResults.reduce((sum, r) => sum + (r.resolvedTitle ? r.missingColumns.length : 0), 0);
  const writeIssues = coreResults.filter(r => r.resolvedTitle && r.canWrite === false).length;
  const optionalReady = OPTIONAL_LISTS.filter(d => { const r = results[d.key]; return r && r.resolvedTitle; }).length;
  const issues = collectIssues(results);
  const criticalCount = issues.filter(i => i.severity === 'bad').length;
  const warningCount = issues.length - criticalCount;

  const openIssue = (listKey: ListKey): void => {
    setExpanded(prev => ({ ...prev, [listKey]: true }));
    actions.onTabChange('connections');
  };

  const toneFor = (ok: boolean, bad: boolean): string => !hasResults ? css.toneNeutral : ok ? css.toneGood : bad ? css.toneBad : css.toneWarn;

  const checkButtons = (
    <div className={css.actions}>
      <PrimaryButton
        text={runningAll ? s.RunningHealthCheck : s.RunHealthCheckButton}
        iconProps={{ iconName: 'Health' }}
        onClick={() => { runHealthCheck().catch(() => undefined); }}
        disabled={runningAll}
      />
      <DefaultButton
        text={s.ExportReportButton}
        iconProps={{ iconName: 'Download' }}
        onClick={exportReport}
        disabled={!hasResults || runningAll}
      />
    </div>
  );

  const renderOverview = (): JSX.Element => (
    <>
      <div className={css.panel}>
        <div className={css.panelHeader}>
          <div>
            <h4>{s.OverviewTitle}</h4>
            <p>{checkedAt ? formatString(s.LastChecked, formatDate(checkedAt)) : s.NeverChecked}</p>
          </div>
          {checkButtons}
        </div>

        {runError && (
          <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setRunError(undefined)} styles={{ root: { marginBottom: 12 } }}>
            {runError}
          </MessageBar>
        )}

        {runningAll ? (
          <ProgressIndicator label={s.RunningHealthCheck} styles={{ root: { marginBottom: 16 } }} />
        ) : (
          <div className={`${css.banner} ${!hasResults ? css.bannerNeutral : criticalCount > 0 ? css.bannerBad : warningCount > 0 ? css.bannerWarn : css.bannerGood}`}>
            <Icon
              className={css.bannerIcon}
              iconName={!hasResults ? 'Info' : criticalCount > 0 ? 'StatusErrorFull' : warningCount > 0 ? 'WarningSolid' : 'CompletedSolid'}
            />
            <div className={css.bannerText}>
              <strong>
                {!hasResults
                  ? s.NeverChecked
                  : criticalCount > 0
                    ? formatString(s.OverallCritical, criticalCount)
                    : warningCount > 0
                      ? formatString(s.OverallWarning, warningCount)
                      : s.OverallHealthy}
              </strong>
              <span className={css.muted}>{hasResults && issues.length > 0 ? s.OverallHint : s.OverviewSubtitle}</span>
            </div>
          </div>
        )}

        <div className={css.tiles}>
          {[
            { icon: 'Database', label: s.Tile_CoreLists, value: `${coreReady}/${CORE_LISTS.length}`, tone: toneFor(coreReady === CORE_LISTS.length, coreResults.some(r => r.status === 'missing' || r.status === 'error')) },
            { icon: 'TableGroup', label: s.Tile_SchemaIssues, value: String(missingColumnCount), tone: toneFor(missingColumnCount === 0, false) },
            { icon: 'Lock', label: s.Tile_PermissionIssues, value: String(writeIssues), tone: toneFor(writeIssues === 0, writeIssues > 0) },
            ...(OPTIONAL_LISTS.length > 0 ? [{ icon: 'Puzzle', label: s.Tile_OptionalLists, value: `${optionalReady}/${OPTIONAL_LISTS.length}`, tone: toneFor(optionalReady === OPTIONAL_LISTS.length, false) }] : [])
          ].map(tile => (
            <div key={tile.icon} className={`${css.tile} ${tile.tone}`}>
              <div className={css.tileHead}><Icon iconName={tile.icon} /> {tile.label}</div>
              <div className={css.tileValue}>{hasResults ? tile.value : '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={css.twoCol}>
        <div className={css.panel}>
          <div className={css.panelHeader}>
            <div><h4>{s.IssuesTitle}</h4></div>
            {issues.length > 0 && (
              <ActionButton iconProps={{ iconName: 'Database' }} text={s.ViewDetails} onClick={() => actions.onTabChange('connections')} />
            )}
          </div>
          {!hasResults ? (
            <span className={css.muted}>{runningAll ? s.RunningHealthCheck : s.NeverChecked}</span>
          ) : issues.length === 0 ? (
            <ul className={css.issueList}>
              <li><Icon iconName="CompletedSolid" className={css.issueIconGood} /> {s.NoIssues}</li>
            </ul>
          ) : (
            <ul className={css.issueList}>
              {issues.map((issue, i) => (
                <li key={i}>
                  <button type="button" className={css.issueButton} onClick={() => openIssue(issue.listKey)}>
                    <Icon iconName={issue.severity === 'bad' ? 'StatusErrorFull' : 'WarningSolid'} className={issue.severity === 'bad' ? css.issueIconBad : css.issueIconWarn} />
                    <span className={css.issueText}>{issue.text}</span>
                    <Icon iconName="ChevronRight" className={css.issueChevron} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={css.panel}>
          <div className={css.panelHeader}><div><h4>{s.EnvironmentTitle}</h4></div></div>
          {environment ? (
            <table className={css.envTable}>
              <tbody>
                <tr><th>{s.Env_Site}</th><td>{environment.siteTitle}<br /><span className={css.muted}>{environment.siteUrl}</span></td></tr>
                <tr><th>{s.Env_User}</th><td>{environment.userName}<br /><span className={css.muted}>{environment.userEmail}</span></td></tr>
                <tr><th>{s.Env_SiteAdmin}</th><td>{environment.isSiteAdmin ? s.Yes : s.No}</td></tr>
                <tr><th>{s.Env_Language}</th><td>{environment.uiCulture}</td></tr>
                <tr><th>{s.Env_TotalLists}</th><td>{environment.totalSiteLists}</td></tr>
              </tbody>
            </table>
          ) : (
            <span className={css.muted}>{s.NeverChecked}</span>
          )}
        </div>
      </div>
    </>
  );

  const renderListCard = (def: IListDefinition): JSX.Element => {
    const text = getListText(def.key);
    const r = results[def.key];
    const isTesting = !!testing[def.key] || (runningAll && !r);
    const isExpanded = !!expanded[def.key];
    const access = !r || !r.resolvedTitle ? undefined
      : r.canWrite ? s.AccessReadWrite
        : r.canWrite === undefined ? (r.canRead ? s.AccessUnknown : s.AccessNone)
          : r.canRead ? s.AccessReadOnly : s.AccessNone;

    return (
      <div key={def.key} className={css.listCard}>
        <div className={css.listCardTop}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <h5 className={css.listTitle}>
              {text.title}
              <span className={css.internal}>({r && r.resolvedTitle ? r.resolvedTitle : def.candidates[0]})</span>
              {def.optional && <span className={css.badge}>{s.OptionalBadge}</span>}
              {def.autoCreated && <span className={css.badge}>{s.AutoCreatedBadge}</span>}
            </h5>
            <span className={css.muted}>{text.desc}</span>
          </div>
          <div className={css.actions}>
            <StatusPill status={r ? r.status : undefined} testing={isTesting} />
            <DefaultButton
              text={s.TestLiveButton}
              iconProps={{ iconName: 'PlugConnected' }}
              onClick={() => { testList(def).catch(() => undefined); }}
              disabled={isTesting || runningAll}
            />
          </div>
        </div>

        {r && r.resolvedTitle && (
          <div className={css.metrics}>
            <span>{s.Items}<strong>{r.itemCount !== undefined ? r.itemCount : '—'}</strong></span>
            <span>{s.LastModified}<strong>{formatDate(r.lastModified)}</strong></span>
            <span>{s.Access}<strong>{access}</strong></span>
            {def.requiredColumns.length > 0 && (
              <span>{s.Columns}<strong>{formatString(s.ColumnsSummary, r.presentColumns.length, def.requiredColumns.length)}</strong></span>
            )}
            <span>{s.ResponseTime}<strong>{r.durationMs} ms</strong></span>
          </div>
        )}

        {r && r.error && (
          <div className={css.errorBox}>
            <strong>{s.ErrorLabel}</strong> {r.failedStep ? `${getCheckLabel(r.failedStep)} — ` : ''}{r.error}
          </div>
        )}

        {r && (
          <div className={css.actions} style={{ marginTop: 6 }}>
            <ActionButton
              iconProps={{ iconName: isExpanded ? 'ChevronUp' : 'ChevronDown' }}
              text={s.ViewDetails}
              onClick={() => setExpanded(prev => ({ ...prev, [def.key]: !isExpanded }))}
            />
            {r.url && (
              <ActionButton iconProps={{ iconName: 'OpenInNewWindow' }} text={s.OpenList} href={r.url} target="_blank" />
            )}
          </div>
        )}

        {r && isExpanded && (
          <div className={css.details}>
            <div>
              <strong>{s.TriedNames}:</strong> {def.candidates.map(c => `"${c}"`).join(', ')}
            </div>
            {!r.resolvedTitle && (
              <div>
                <strong>{s.SimilarLists}:</strong>{' '}
                {r.suggestions.length > 0 ? r.suggestions.map(x => `"${x}"`).join(', ') : '—'}
                <div className={css.muted}>{formatString(s.RenameHint, def.candidates[0])}</div>
              </div>
            )}
            {r.resolvedTitle && r.missingColumns.length > 0 && (
              <div>
                <strong>{s.MissingColumnsLabel}:</strong>
                <div className={css.chips}>
                  {r.missingColumns.map(c => <span key={c} className={`${css.chip} ${css.chipBad}`}>{c}</span>)}
                </div>
              </div>
            )}
            {r.resolvedTitle && r.missingColumns.length === 0 && def.requiredColumns.length > 0 && (
              <div>{s.AllColumnsPresent}</div>
            )}
            {r.checks && r.checks.length > 0 && (
              <div>
                <strong>{s.ChecksLabel}:</strong>
                <ul style={{ listStyle: 'none', margin: '6px 0 0', padding: 0 }}>
                  {r.checks.map(check => (
                    <li key={check.key} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '3px 0' }}>
                      <Icon
                        iconName={check.ok ? 'CompletedSolid' : check.required ? 'StatusErrorFull' : 'WarningSolid'}
                        style={{ color: check.ok ? '#107c10' : check.required ? '#c50f1f' : '#bc4b09', marginTop: 2 }}
                      />
                      <span>
                        {getCheckLabel(check.key)}
                        {!check.required && <span className={css.muted}> ({s.CheckOptional})</span>}
                        {check.source === 'site' && (
                          <div className={css.muted}>{formatString(s.Note_PermissionsFromSite, check.error || '')}</div>
                        )}
                        {!check.ok && check.error && <div className={css.muted}>{check.error}</div>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderConnections = (): JSX.Element => (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{s.ConnectionsTitle}</h4>
          <p>{s.ConnectionsDesc}</p>
        </div>
        {checkButtons}
      </div>
      <div className={css.groupHeading}>{s.CoreListsGroup}</div>
      {CORE_LISTS.map(renderListCard)}
      {OPTIONAL_LISTS.length > 0 && <div className={css.groupHeading}>{s.OptionalListsGroup}</div>}
      {OPTIONAL_LISTS.map(renderListCard)}
    </div>
  );

  const renderSchema = (): JSX.Element => (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{s.SchemaTitle}</h4>
          <p>{s.SchemaDesc}</p>
        </div>
        {checkButtons}
      </div>
      {!hasResults && (
        <MessageBar messageBarType={MessageBarType.info} styles={{ root: { marginBottom: 12 } }}>{s.SchemaUnchecked}</MessageBar>
      )}
      {CORE_LISTS.map(def => {
        const r = results[def.key];
        const text = getListText(def.key);
        const validated = !!(r && r.resolvedTitle);
        return (
          <div key={def.key} className={css.schemaBlock}>
            <h5>
              {r && r.resolvedTitle ? r.resolvedTitle : def.candidates[0]}
              {text.tag && <span className={css.muted}>{text.tag}</span>}
              {r && <StatusPill status={r.status} />}
            </h5>
            <div className={css.chips}>
              {def.requiredColumns.map(col => {
                const present = !!r && validated && r.presentColumns.indexOf(col.name) >= 0;
                const missing = !!r && validated && r.missingColumns.indexOf(col.name) >= 0;
                const hint = col.aliases && col.aliases.length > 0 ? formatString(s.SchemaAliasesHint, col.aliases.join(', ')) : undefined;
                return (
                  <span key={col.name} title={hint} className={`${css.chip} ${present ? css.chipGood : ''} ${missing ? css.chipBad : ''}`}>
                    {present && <Icon iconName="CheckMark" />}
                    {missing && <Icon iconName="Cancel" />}
                    {col.name}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  const tab = state.configSelectedTab || 'overview';

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{s.HeaderTitle}</h3>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>
          {s.HeaderSubtitle}
        </p>
      </div>

      <div className={css.configTabs}>
        <Pivot
          selectedKey={tab}
          onLinkClick={(item) => actions.onTabChange(item ? (item.props.itemKey as string) || 'overview' : 'overview')}
          styles={{ root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } }}
        >
          <PivotItem headerText={s.TabOverview} itemKey="overview" itemIcon="Health" />
          <PivotItem
            headerText={s.TabListConnections}
            itemKey="connections"
            itemIcon="Database"
            itemCount={issues.length > 0 ? issues.length : undefined}
          />
          <PivotItem headerText={s.TabSchemaGuides} itemKey="schema" itemIcon="TableGroup" />
          <PivotItem headerText={s.TabRbacGroups} itemKey="rbac" itemIcon="Permissions" />
          <PivotItem headerText={strings.Features.StockTabName} itemKey="stock" itemIcon="ProductWarning" />
          <PivotItem headerText={s.TabSyncOperations} itemKey="operations" itemIcon="Sync" />
        </Pivot>
      </div>

      {tab === 'overview' && renderOverview()}
      {tab === 'connections' && renderConnections()}
      {tab === 'schema' && renderSchema()}
      {tab === 'rbac' && (
        <AccessGroupsTab roleGroups={ROLE_GROUPS} groups={groups} loadingGroups={loadingGroups} onLoadGroup={loadGroup} onLoadAll={loadAllGroups} />
      )}
      {tab === 'stock' && <StockThresholdsTab />}
      {tab === 'operations' && <MaintenanceTab state={state} actions={actions} />}
    </div>
  );
};
