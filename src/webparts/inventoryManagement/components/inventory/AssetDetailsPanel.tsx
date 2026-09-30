import * as React from 'react';
import { Panel, PanelType, Pivot, PivotItem, Icon, Link, Shimmer, MessageBar, MessageBarType } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { IEventLog } from '../../models/IEventLog';
import { IReturnRequest } from '../../models/IReturnRequest';
import { EventActionBadge } from '../EventActionBadge';
import {
  AssetHistoryService,
  IAssetAssignmentRecord,
  IAssetServiceRecord,
  IAssetTechnicalInfo
} from '../../services/AssetHistoryService';
import {
  ITone,
  TONES,
  assetTypeIcon,
  statusTone,
  conditionTone,
  formatDay,
  formatDateTime,
  ageText,
  lifecyclePercent,
  warrantyInfo,
  initials,
  categoryOf,
  LIFECYCLE_YEARS
} from './inventoryUi';

export interface IAssetDetailsPanelProps {
  /** The asset to show; the panel is open while this is set. */
  asset: IInventoryItem | undefined;
  onDismiss: () => void;
  auditLogs: IEventLog[];
  returnRequests: IReturnRequest[];
  spContext: WebPartContext;
}

const css = mergeStyleSets({
  header: { display: 'flex', gap: 14, alignItems: 'flex-start', margin: '4px 0 16px' },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: '#f0f0f0',
    color: '#242424',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    flexShrink: 0
  },
  headText: { flex: 1, minWidth: 0 },
  sub: { fontSize: 13, color: '#616161', marginTop: 2 },
  pills: { display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 },
  pill: { fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 999, lineHeight: '18px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 16 },
  stat: { border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 12px', background: '#fafafa' },
  statLabel: { fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#616161' },
  statValue: { fontSize: 15, fontWeight: 600, color: '#242424', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  section: { marginTop: 16 },
  sectionTitle: { margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#242424' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', columnGap: 24, border: '1px solid #e0e0e0', borderRadius: 8, padding: '4px 16px' },
  row: { display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
  label: { color: '#616161', flexShrink: 0 },
  value: { color: '#242424', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' },
  textBlock: { margin: 0, padding: '10px 14px', borderRadius: 8, background: '#f5f5f5', fontSize: 13, lineHeight: '20px', color: '#424242', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  meter: { height: 8, borderRadius: 4, background: '#ebebeb', overflow: 'hidden', margin: '8px 0 4px' },
  meterFill: { height: '100%', borderRadius: 4 },
  meterText: { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#616161' },
  holder: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, border: '1px solid #c7e0f4', background: '#f3f9fd' },
  coin: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#0f6cbd',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  timeline: { listStyle: 'none', margin: 0, padding: 0 },
  tlItem: { position: 'relative', padding: '0 0 16px 28px', selectors: { ':last-child': { paddingBottom: 0 } } },
  tlLine: { position: 'absolute', left: 9, top: 20, bottom: 0, width: 2, background: '#ebebeb' },
  tlDot: { position: 'absolute', left: 0, top: 2, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 },
  tlTitle: { fontSize: 13, fontWeight: 600, color: '#242424' },
  tlMeta: { fontSize: 12, color: '#616161', marginTop: 2 },
  tlBody: { fontSize: 13, color: '#424242', marginTop: 4, lineHeight: '18px' },
  empty: { padding: '24px 12px', textAlign: 'center', color: '#616161', fontSize: 13, border: '1px dashed #d1d1d1', borderRadius: 8 },
  record: { border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 12px', marginBottom: 8 },
  recordHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  mono: { fontFamily: 'Consolas, "Courier New", monospace', fontSize: 12 }
});

const Pill: React.FC<{ tone: ITone; text: string }> = ({ tone, text }) => (
  <span className={css.pill} style={{ background: tone.bg, color: tone.fg }}>{text}</span>
);

const same = (a?: string, b?: string): boolean => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

interface ICustodyEntry {
  key: string;
  date?: string;
  kind: 'assigned' | 'return';
  name: string;
  meta: string;
  body?: string;
}

export const AssetDetailsPanel: React.FC<IAssetDetailsPanelProps> = (props) => {
  const { asset, onDismiss, auditLogs, returnRequests, spContext } = props;
  const s = strings.InventoryExplorer;
  const [tab, setTab] = React.useState('overview');
  const [assignments, setAssignments] = React.useState<IAssetAssignmentRecord[] | undefined>();
  const [service, setService] = React.useState<IAssetServiceRecord[] | undefined>();
  const [technical, setTechnical] = React.useState<IAssetTechnicalInfo | undefined>();

  const assetId = asset ? asset.id : undefined;
  React.useEffect(() => {
    if (!asset) return;
    let current = true;
    setTab('overview');
    setAssignments(undefined);
    setService(undefined);
    setTechnical(undefined);
    AssetHistoryService.getAssignments(asset).then(r => { if (current) setAssignments(r); }).catch(() => current && setAssignments([]));
    AssetHistoryService.getServiceRecords(asset, spContext).then(r => { if (current) setService(r); }).catch(() => current && setService([]));
    AssetHistoryService.getTechnicalInfo(asset).then(r => { if (current) setTechnical(r); }).catch(() => current && setTechnical({ itemId: asset.id }));
    return () => { current = false; };
  }, [assetId]);

  if (!asset) return null;

  const warranty = warrantyInfo(asset.warrantyExpiry);
  const age = ageText(asset.purchaseDate);
  const life = lifecyclePercent(asset.purchaseDate);
  const status = statusTone(asset.status);

  const returns = returnRequests.filter(r =>
    r.assetId === asset.id || (asset.serialNumber ? same(r.serialNumber, asset.serialNumber) : same(r.assetName, asset.assetName)));

  const activity = auditLogs
    .filter(e => (e.entityType === 'Asset' && e.entityId === asset.id) || (!!asset.assetName && same(e.assetName, asset.assetName)))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const custody: ICustodyEntry[] = (assignments || []).map((a, i): ICustodyEntry => ({
    key: `a-${i}`,
    date: a.assignedDate,
    kind: 'assigned',
    name: a.employeeName,
    meta: [formatString(s.CustodyAssigned, formatDay(a.assignedDate)), a.employeeId ? formatString(s.CustodyEmployeeId, a.employeeId) : '', a.assignmentId || '']
      .filter(Boolean).join('  ·  ')
  })).concat(returns.map((r, i): ICustodyEntry => ({
    key: `r-${i}`,
    date: r.completedDate || r.requestDate,
    kind: 'return',
    name: r.requesterName,
    meta: [formatString(s.CustodyReturn, r.status), formatDay(r.completedDate || r.requestDate), r.proposedCondition ? formatString(s.CustodyCondition, r.proposedCondition) : '']
      .filter(Boolean).join('  ·  '),
    body: r.returnReason
  }))).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const holders = assignments ? new Set(assignments.map(a => a.employeeName.toLowerCase())).size : undefined;
  const openIssues = service ? service.filter(r => !/resolv|closed|complet/i.test(r.status)).length : undefined;

  const detail = (label: string, value: React.ReactNode): JSX.Element => (
    <div className={css.row}><span className={css.label}>{label}</span><span className={css.value}>{value || '—'}</span></div>
  );

  const loading = (lines: number = 3): JSX.Element => (
    <div>{Array.from({ length: lines }).map((_, i) => <Shimmer key={i} styles={{ root: { marginBottom: 10 } }} />)}</div>
  );

  const renderOverview = (): JSX.Element => (
    <>
      <div className={css.section}>
        <h4 className={css.sectionTitle}>{s.SectionDetails}</h4>
        <div className={css.grid}>
          {detail(s.FieldCategory, categoryOf(asset))}
          {detail(s.FieldType, asset.assetType)}
          {detail(s.FieldSerial, <span className={css.mono}>{asset.serialNumber}</span>)}
          {detail(s.FieldVendor, asset.vendor)}
          {detail(s.FieldStatus, <Pill tone={status} text={asset.status || '—'} />)}
          {detail(s.FieldCondition, asset.condition ? <Pill tone={conditionTone(asset.condition)} text={asset.condition} /> : undefined)}
          {detail(s.FieldPurchased, formatDay(asset.purchaseDate))}
          {detail(s.FieldWarranty, <span style={{ color: warranty.tone.fg }}>{warranty.text}</span>)}
          {detail(s.FieldAssignedTo, asset.assignedTo)}
          {detail(s.FieldAssetId, asset.id)}
        </div>
      </div>

      {life !== undefined && (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>{s.SectionLifecycle}</h4>
          <div className={css.meter} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(life)}>
            <div className={css.meterFill} style={{ width: `${life}%`, background: life >= 100 ? '#c50f1f' : life >= 75 ? '#bc4b09' : '#0f6cbd' }} />
          </div>
          <div className={css.meterText}>
            <span>{formatString(s.LifecycleAge, age || '—')}</span>
            <span>{formatString(s.LifecyclePlan, LIFECYCLE_YEARS)}</span>
          </div>
        </div>
      )}

      {asset.specifications && (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>{s.SectionSpecifications}</h4>
          <p className={css.textBlock}>{asset.specifications}</p>
        </div>
      )}
      {asset.note && asset.note !== asset.specifications && (
        <div className={css.section}>
          <h4 className={css.sectionTitle}>{s.SectionNotes}</h4>
          <p className={css.textBlock}>{asset.note}</p>
        </div>
      )}
    </>
  );

  const renderPeople = (): JSX.Element => (
    <>
      <div className={css.section}>
        <h4 className={css.sectionTitle}>{s.SectionCurrentHolder}</h4>
        {asset.assignedTo ? (
          <div className={css.holder}>
            <div className={css.coin} aria-hidden="true">{initials(asset.assignedTo)}</div>
            <div>
              <div className={css.tlTitle}>{asset.assignedTo}</div>
              <div className={css.tlMeta}>{asset.status}</div>
            </div>
          </div>
        ) : (
          <div className={css.empty}>{s.NoCurrentHolder}</div>
        )}
      </div>
      <div className={css.section}>
        <h4 className={css.sectionTitle}>{s.SectionCustody}</h4>
        {!assignments ? loading() : custody.length === 0 ? (
          <div className={css.empty}>{s.NoCustody}</div>
        ) : (
          <ul className={css.timeline}>
            {custody.map((c, i) => {
              const tone = c.kind === 'assigned' ? TONES.blue : TONES.green;
              return (
                <li key={c.key} className={css.tlItem}>
                  {i < custody.length - 1 && <span className={css.tlLine} aria-hidden="true" />}
                  <span className={css.tlDot} style={{ background: tone.bg, color: tone.fg }} aria-hidden="true">
                    <Icon iconName={c.kind === 'assigned' ? 'Contact' : 'ReturnToSession'} />
                  </span>
                  <div className={css.tlTitle}>{c.name}</div>
                  <div className={css.tlMeta}>{c.meta}</div>
                  {c.body && <div className={css.tlBody}>{c.body}</div>}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );

  const renderActivity = (): JSX.Element => (
    <div className={css.section}>
      {activity.length === 0 ? (
        <div className={css.empty}>{s.NoActivity}</div>
      ) : (
        <>
          <ul className={css.timeline}>
            {activity.slice(0, 50).map((e, i) => (
              <li key={e.id} className={css.tlItem}>
                {i < Math.min(activity.length, 50) - 1 && <span className={css.tlLine} aria-hidden="true" />}
                <span className={css.tlDot} style={{ background: '#f0f0f0', color: '#424242' }} aria-hidden="true"><Icon iconName="History" /></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <EventActionBadge action={e.action} />
                  <span className={css.tlMeta} style={{ marginTop: 0 }}>{formatDateTime(e.timestamp)}  ·  {e.user}</span>
                </div>
                <div className={css.tlBody}>{e.details || e.title}</div>
              </li>
            ))}
          </ul>
          {activity.length > 50 && <p className={css.tlMeta}>{formatString(s.ActivityLimited, 50, activity.length)}</p>}
        </>
      )}
    </div>
  );

  const renderService = (): JSX.Element => (
    <div className={css.section}>
      {!service ? loading() : service.length === 0 ? (
        <div className={css.empty}>{s.NoServiceRecords}</div>
      ) : service.map(r => {
        const tone = /resolv|complet/i.test(r.status) ? TONES.green : /closed/i.test(r.status) ? TONES.grey : /progress/i.test(r.status) ? TONES.amber : TONES.red;
        return (
          <div key={`${r.kind}-${r.reference}`} className={css.record}>
            <div className={css.recordHead}>
              <span className={css.tlTitle}>
                <Icon iconName={r.kind === 'replacement' ? 'Sync' : 'IncidentTriangle'} style={{ marginRight: 6, color: '#616161' }} />
                {r.reference}  ·  {r.type}
              </span>
              <Pill tone={tone} text={r.status} />
            </div>
            <div className={css.tlMeta}>{[formatDay(r.date), r.priority ? formatString(s.ServicePriority, r.priority) : ''].filter(Boolean).join('  ·  ')}</div>
            {r.description && <div className={css.tlBody}>{r.description}</div>}
          </div>
        );
      })}
    </div>
  );

  const renderTechnical = (): JSX.Element => (
    <>
      <div className={css.section}>
        <h4 className={css.sectionTitle}>{s.SectionSharePoint}</h4>
        {!technical ? loading(4) : (
          <div className={css.grid}>
            {detail(s.TechItemId, <span className={css.mono}>{technical.itemId}</span>)}
            {detail(s.TechList, technical.listTitle)}
            {detail(s.TechCreated, technical.created ? `${formatDateTime(technical.created)}${technical.createdBy ? ` · ${technical.createdBy}` : ''}` : undefined)}
            {detail(s.TechModified, technical.modified ? `${formatDateTime(technical.modified)}${technical.modifiedBy ? ` · ${technical.modifiedBy}` : ''}` : undefined)}
            {detail(s.TechVersion, technical.version)}
            {detail(s.TechLink, technical.itemUrl ? <Link href={technical.itemUrl} target="_blank" rel="noopener noreferrer">{s.OpenInSharePoint}</Link> : undefined)}
          </div>
        )}
      </div>
      <div className={css.section}>
        <h4 className={css.sectionTitle}>{s.SectionStoredValues}</h4>
        <div className={css.grid}>
          {Object.keys(asset).filter(k => (asset as any)[k] !== undefined && (asset as any)[k] !== '').map(k => (
            <div key={k} className={css.row}>
              <span className={css.label}><span className={css.mono}>{k}</span></span>
              <span className={css.value} style={{ fontWeight: 400 }}>{String((asset as any)[k])}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Panel
      isOpen={true}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText={asset.assetName || asset.title}
      closeButtonAriaLabel={strings.Common.Close}
      isLightDismiss={true}
    >
      <div className={css.header}>
        <div className={css.typeIcon} aria-hidden="true"><Icon iconName={assetTypeIcon(asset.assetType)} /></div>
        <div className={css.headText}>
          <div className={css.sub}>
            {[asset.assetType, asset.serialNumber, formatString(s.IdLabel, asset.id)].filter(Boolean).join('  ·  ')}
          </div>
          <div className={css.pills}>
            <Pill tone={status} text={asset.status || '—'} />
            {asset.condition && <Pill tone={conditionTone(asset.condition)} text={asset.condition} />}
            <Pill tone={warranty.tone} text={warranty.text} />
          </div>
        </div>
      </div>

      {returns.some(r => r.status !== 'Completed' && r.status !== 'Rejected') && (
        <MessageBar messageBarType={MessageBarType.warning} styles={{ root: { marginBottom: 12, borderRadius: 6 } }}>{s.ReturnInProgress}</MessageBar>
      )}

      <div className={css.stats}>
        <div className={css.stat}><div className={css.statLabel}>{s.StatAge}</div><div className={css.statValue}>{age || '—'}</div></div>
        <div className={css.stat}><div className={css.statLabel}>{s.StatWarranty}</div><div className={css.statValue} style={{ color: warranty.tone.fg }}>{warranty.days === undefined ? '—' : warranty.days < 0 ? s.WarrantyExpiredShort : formatString(s.StatDays, warranty.days)}</div></div>
        <div className={css.stat}><div className={css.statLabel}>{s.StatHolders}</div><div className={css.statValue}>{holders === undefined ? '…' : holders}</div></div>
        <div className={css.stat}><div className={css.statLabel}>{s.StatOpenIssues}</div><div className={css.statValue} style={{ color: openIssues ? TONES.red.fg : undefined }}>{openIssues === undefined ? '…' : openIssues}</div></div>
      </div>

      <Pivot selectedKey={tab} onLinkClick={item => item && setTab(item.props.itemKey || 'overview')} headersOnly={true}>
        <PivotItem itemKey="overview" headerText={s.TabOverview} itemIcon="Info" />
        <PivotItem itemKey="people" headerText={s.TabPeople} itemIcon="People" itemCount={assignments ? custody.length : undefined} />
        <PivotItem itemKey="activity" headerText={s.TabActivity} itemIcon="History" itemCount={activity.length || undefined} />
        <PivotItem itemKey="service" headerText={s.TabService} itemIcon="Repair" itemCount={service ? service.length || undefined : undefined} />
        <PivotItem itemKey="technical" headerText={s.TabTechnical} itemIcon="Code" />
      </Pivot>

      {tab === 'overview' && renderOverview()}
      {tab === 'people' && renderPeople()}
      {tab === 'activity' && renderActivity()}
      {tab === 'service' && renderService()}
      {tab === 'technical' && renderTechnical()}
    </Panel>
  );
};
