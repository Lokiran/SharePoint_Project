import * as React from 'react';
import {
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  TextField,
  Dropdown,
  IDropdownOption,
  DatePicker,
  NormalPeoplePicker,
  IPersonaProps,
  ProgressIndicator,
  Icon
} from '@fluentui/react';
import styles from '../components/InventoryManagement.module.scss';
import css from './ConfigPage.module.scss';
import { IOnboardingPageProps } from '../types/Onboarding.types';
import { AssetKitService, IBatchResult } from '../services/AssetKitService';
import { PeopleSearchService, IPersonResult } from '../services/PeopleSearchService';
import {
  IAssetKit,
  DEFAULT_KITS,
  parseKitItems,
  formatKitItems,
  kitUnitCount,
  buildOffboardingChecklist,
  listAssetHolders,
  OffboardingState
} from '../utils/KitUtils';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';

type Message = { type: MessageBarType; text: string } | undefined;

const kitSummary = (kit: IAssetKit): string =>
  kit.lines.map(l => (l.quantity > 1 ? `${l.assetType} ×${l.quantity}` : l.assetType)).join(', ');

const batchMessage = (result: IBatchResult, okText: string): Message => {
  const f = strings.Features;
  if (result.failed.length === 0) return { type: MessageBarType.success, text: formatString(okText, result.succeeded.length) };
  const failures = result.failed.map(x => `${x.label}: ${x.error}`).join(' | ');
  return {
    type: result.succeeded.length > 0 ? MessageBarType.warning : MessageBarType.error,
    text: formatString(f.BatchPartial, result.succeeded.length, result.failed.length, failures)
  };
};

export const OnboardingPage: React.FC<IOnboardingPageProps> = ({ state, actions }) => {
  const f = strings.Features;
  const [tab, setTab] = React.useState<string>('onboarding');
  const [kits, setKits] = React.useState<IAssetKit[]>(DEFAULT_KITS);
  const [kitsFromList, setKitsFromList] = React.useState(false);

  const loadKits = React.useCallback(async (): Promise<void> => {
    try {
      const result = await AssetKitService.getKits();
      setKits(result.kits);
      setKitsFromList(result.fromList);
    } catch (e) {
      console.warn('[OnboardingPage] Could not load kits:', e);
    }
  }, []);

  React.useEffect(() => { loadKits().catch(() => undefined); }, [loadKits]);

  // ---------------- Onboarding ----------------
  const [person, setPerson] = React.useState<IPersonResult | undefined>();
  const [employeeId, setEmployeeId] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [kitIndex, setKitIndex] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [onboardBusy, setOnboardBusy] = React.useState(false);
  const [onboardMsg, setOnboardMsg] = React.useState<Message>();

  const selectedKit = kits[Math.min(kitIndex, kits.length - 1)];

  const resolveSuggestions = async (filter: string): Promise<IPersonaProps[]> => {
    const people = await PeopleSearchService.search(filter);
    return people.map(p => ({ text: p.displayName, secondaryText: p.email || p.jobTitle, key: p.loginName, data: p }));
  };

  const submitKit = async (): Promise<void> => {
    if (!person || !selectedKit) return;
    setOnboardBusy(true);
    setOnboardMsg(undefined);
    try {
      const result = await AssetKitService.requestKit(
        selectedKit,
        { displayName: person.displayName, email: person.email, employeeId: employeeId.trim() || undefined },
        { startDate: startDate ? startDate.toISOString() : undefined, notes },
        state.currentUserName,
        state.currentUserRole
      );
      setOnboardMsg(batchMessage(result, f.KitRequested));
      if (result.succeeded.length > 0) {
        setPerson(undefined);
        setEmployeeId('');
        setStartDate(undefined);
        setNotes('');
        actions.onDataChanged();
      }
    } finally {
      setOnboardBusy(false);
    }
  };

  const renderOnboarding = (): JSX.Element => (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{f.OnboardTitle}</h4>
          <p>{f.OnboardDesc}</p>
        </div>
      </div>
      {onboardMsg && (
        <MessageBar messageBarType={onboardMsg.type} onDismiss={() => setOnboardMsg(undefined)} styles={{ root: { marginBottom: 12 } }}>
          {onboardMsg.text}
        </MessageBar>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <div>
          <label className="ms-Label" style={{ fontWeight: 600, fontSize: 14, display: 'block', padding: '5px 0' }}>{f.OnboardEmployee}</label>
          <NormalPeoplePicker
            onResolveSuggestions={(filter) => resolveSuggestions(filter)}
            selectedItems={person ? [{ text: person.displayName, secondaryText: person.email, key: person.loginName }] : []}
            onChange={(items) => setPerson(items && items.length > 0 ? ((items[0] as any).data as IPersonResult) || undefined : undefined)}
            itemLimit={1}
            resolveDelay={300}
            inputProps={{ placeholder: f.OnboardEmployeePlaceholder, 'aria-label': f.OnboardEmployee }}
            pickerSuggestionsProps={{ noResultsFoundText: f.OnboardNoPeople, loadingText: strings.ConfigPage.LoadingButton }}
          />
        </div>
        <TextField label={f.OnboardEmployeeId} value={employeeId} onChange={(_, v) => setEmployeeId(v || '')} />
        <DatePicker label={f.OnboardStartDate} value={startDate} onSelectDate={(d) => setStartDate(d || undefined)} placeholder={f.OnboardStartDatePlaceholder} />
        <Dropdown
          label={f.OnboardKit}
          selectedKey={kitIndex}
          options={kits.map((k, i): IDropdownOption => ({ key: i, text: formatString(f.KitOption, k.name, kitUnitCount(k)) }))}
          onChange={(_, o) => o && setKitIndex(o.key as number)}
        />
      </div>
      {selectedKit && (
        <div className={css.details} style={{ marginTop: 12 }}>
          <strong>{selectedKit.name}</strong>{selectedKit.description ? ` — ${selectedKit.description}` : ''}
          <div className={css.chips}>
            {selectedKit.lines.map(l => (
              <span key={l.assetType} className={css.chip}><Icon iconName="Devices3" /> {l.assetType}{l.quantity > 1 ? ` ×${l.quantity}` : ''}</span>
            ))}
          </div>
          <div className={css.muted} style={{ marginTop: 6 }}>{formatString(f.OnboardWillCreate, selectedKit.lines.length)}</div>
        </div>
      )}
      <TextField label={f.OnboardNotes} multiline rows={2} value={notes} onChange={(_, v) => setNotes(v || '')} styles={{ root: { marginTop: 12 } }} />
      <div className={css.actions} style={{ marginTop: 16 }}>
        <PrimaryButton
          text={onboardBusy ? f.Working : f.OnboardSubmit}
          iconProps={{ iconName: 'AddFriend' }}
          disabled={!person || !selectedKit || onboardBusy}
          onClick={() => { submitKit().catch(() => undefined); }}
        />
      </div>
    </div>
  );

  // ---------------- Offboarding ----------------
  const holders = React.useMemo(() => listAssetHolders(state.items), [state.items]);
  const [holderKey, setHolderKey] = React.useState<string>('');
  const [lastDay, setLastDay] = React.useState<Date | undefined>();
  const [offboardBusy, setOffboardBusy] = React.useState(false);
  const [offboardMsg, setOffboardMsg] = React.useState<Message>();

  const holder = holders.find(h => (h.email || h.name) === holderKey);
  const checklist = React.useMemo(
    () => (holder ? buildOffboardingChecklist(state.items, state.returnRequests, holder.name, holder.email) : []),
    [holder, state.items, state.returnRequests]
  );
  const heldCount = checklist.filter(r => r.state === 'held').length;
  const returnedCount = checklist.filter(r => r.state === 'returned').length;

  const raiseReturns = async (): Promise<void> => {
    if (!holder) return;
    setOffboardBusy(true);
    setOffboardMsg(undefined);
    try {
      const result = await AssetKitService.raiseOffboardingReturns(
        checklist, { name: holder.name, email: holder.email }, lastDay ? lastDay.toISOString() : undefined, state.currentUserName
      );
      setOffboardMsg(batchMessage(result, f.OffboardRaised));
      actions.onDataChanged();
    } finally {
      setOffboardBusy(false);
    }
  };

  const statePill = (s: OffboardingState, returnStatus?: string): JSX.Element => {
    if (s === 'returned') return <span className={`${css.pill} ${css.pillGood}`}><Icon iconName="Completed" /> {f.OffboardStateReturned}</span>;
    if (s === 'returnInProgress') return <span className={`${css.pill} ${css.pillInfo}`} title={returnStatus}><Icon iconName="Sync" /> {f.OffboardStateInProgress}</span>;
    return <span className={`${css.pill} ${css.pillWarn}`}><Icon iconName="Warning" /> {f.OffboardStateHeld}</span>;
  };

  const renderOffboarding = (): JSX.Element => (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{f.OffboardTitle}</h4>
          <p>{f.OffboardDesc}</p>
        </div>
      </div>
      {offboardMsg && (
        <MessageBar messageBarType={offboardMsg.type} onDismiss={() => setOffboardMsg(undefined)} styles={{ root: { marginBottom: 12 } }}>
          {offboardMsg.text}
        </MessageBar>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        <Dropdown
          label={f.OffboardEmployee}
          placeholder={holders.length ? f.OffboardEmployeePlaceholder : f.OffboardNoHolders}
          selectedKey={holderKey || null}
          options={holders.map(h => ({ key: h.email || h.name, text: formatString(f.OffboardHolderOption, h.name, h.count) }))}
          onChange={(_, o) => { if (o) { setHolderKey(o.key as string); setOffboardMsg(undefined); } }}
        />
        <DatePicker label={f.OffboardLastDay} value={lastDay} onSelectDate={(d) => setLastDay(d || undefined)} placeholder={f.OnboardStartDatePlaceholder} />
      </div>

      {holder && (
        <>
          <ProgressIndicator
            label={formatString(f.OffboardProgress, returnedCount, checklist.length)}
            percentComplete={checklist.length ? returnedCount / checklist.length : 0}
            styles={{ root: { margin: '16px 0 8px' } }}
          />
          <table className={css.dataTable}>
            <thead>
              <tr>
                <th>{f.SlaColAsset}</th>
                <th>{f.StockColType}</th>
                <th>{f.OffboardColSerial}</th>
                <th>{f.StockColStatus}</th>
              </tr>
            </thead>
            <tbody>
              {checklist.map(row => (
                <tr key={`${row.assetId}-${row.serialNumber}-${row.state}`}>
                  <td><strong>{row.assetName}</strong></td>
                  <td>{row.assetType}</td>
                  <td>{row.serialNumber}</td>
                  <td>{statePill(row.state, row.returnStatus)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={css.actions} style={{ marginTop: 16 }}>
            <PrimaryButton
              text={offboardBusy ? f.Working : formatString(f.OffboardRaise, heldCount)}
              iconProps={{ iconName: 'ReturnToSession' }}
              disabled={heldCount === 0 || offboardBusy}
              onClick={() => { raiseReturns().catch(() => undefined); }}
            />
            {heldCount === 0 && checklist.length > 0 && <span className={css.muted}>{f.OffboardNothingToRaise}</span>}
          </div>
        </>
      )}
    </div>
  );

  // ---------------- Kits (admin) ----------------
  const [editing, setEditing] = React.useState<{ id?: number; name: string; description: string; items: string } | undefined>();
  const [kitBusy, setKitBusy] = React.useState(false);
  const [kitMsg, setKitMsg] = React.useState<Message>();

  const runKitAction = async (action: () => Promise<void>, okText: string): Promise<void> => {
    setKitBusy(true);
    setKitMsg(undefined);
    try {
      await action();
      setKitMsg({ type: MessageBarType.success, text: okText });
      setEditing(undefined);
      await loadKits();
    } catch (e: any) {
      setKitMsg({ type: MessageBarType.error, text: formatString(f.KitSaveFailed, e && e.message ? e.message : String(e)) });
    } finally {
      setKitBusy(false);
    }
  };

  const editingLines = editing ? parseKitItems(editing.items) : [];

  const renderKits = (): JSX.Element => (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{f.KitsTitle}</h4>
          <p>{kitsFromList ? f.KitsDesc : f.KitsBuiltInNote}</p>
        </div>
        <div className={css.actions}>
          {!kitsFromList && (
            <DefaultButton
              text={f.KitsCopyBuiltIn}
              iconProps={{ iconName: 'Copy' }}
              disabled={kitBusy}
              onClick={() => { runKitAction(async () => { for (const k of DEFAULT_KITS) await AssetKitService.saveKit(k); }, f.KitSaved).catch(() => undefined); }}
            />
          )}
          <PrimaryButton text={f.KitsNew} iconProps={{ iconName: 'Add' }} disabled={kitBusy} onClick={() => setEditing({ name: '', description: '', items: '' })} />
        </div>
      </div>
      {kitMsg && (
        <MessageBar messageBarType={kitMsg.type} onDismiss={() => setKitMsg(undefined)} styles={{ root: { marginBottom: 12 } }}>
          {kitMsg.text}
        </MessageBar>
      )}

      {editing && (
        <div className={css.listCard}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            <TextField label={f.KitName} required value={editing.name} onChange={(_, v) => setEditing({ ...editing, name: v || '' })} />
            <TextField label={f.KitDescriptionLabel} value={editing.description} onChange={(_, v) => setEditing({ ...editing, description: v || '' })} />
          </div>
          <TextField
            label={f.KitItemsLabel}
            description={f.KitItemsHelp}
            multiline
            rows={5}
            value={editing.items}
            onChange={(_, v) => setEditing({ ...editing, items: v || '' })}
            styles={{ root: { marginTop: 8 } }}
          />
          {editingLines.length > 0 && (
            <div className={css.chips} style={{ marginTop: 8 }}>
              {editingLines.map(l => <span key={l.assetType} className={css.chip}>{l.assetType}{l.quantity > 1 ? ` ×${l.quantity}` : ''}</span>)}
            </div>
          )}
          <div className={css.actions} style={{ marginTop: 12 }}>
            <PrimaryButton
              text={f.KitSave}
              iconProps={{ iconName: 'Save' }}
              disabled={kitBusy || !editing.name.trim() || editingLines.length === 0}
              onClick={() => {
                runKitAction(
                  () => AssetKitService.saveKit({ id: editing.id, name: editing.name, description: editing.description, lines: editingLines }),
                  f.KitSaved
                ).catch(() => undefined);
              }}
            />
            <DefaultButton text={f.Cancel} onClick={() => setEditing(undefined)} disabled={kitBusy} />
          </div>
        </div>
      )}

      <table className={css.dataTable}>
        <thead>
          <tr>
            <th>{f.KitName}</th>
            <th>{f.KitItemsLabel}</th>
            <th>{f.KitDescriptionLabel}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {kits.map(k => (
            <tr key={`${k.id || 'builtin'}-${k.name}`}>
              <td><strong>{k.name}</strong></td>
              <td>{kitSummary(k)}</td>
              <td className={css.muted}>{k.description}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <DefaultButton
                  text={f.KitEdit}
                  iconProps={{ iconName: 'Edit' }}
                  disabled={kitBusy}
                  onClick={() => setEditing({ id: k.id, name: k.name, description: k.description, items: formatKitItems(k.lines) })}
                />
                {k.id && (
                  <DefaultButton
                    text={f.KitDelete}
                    iconProps={{ iconName: 'Delete' }}
                    disabled={kitBusy}
                    styles={{ root: { marginLeft: 8 } }}
                    onClick={() => {
                      if (window.confirm(formatString(f.KitDeleteConfirm, k.name))) {
                        runKitAction(() => AssetKitService.deleteKit(k.id as number), f.KitDeleted).catch(() => undefined);
                      }
                    }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className={styles.cardHeader}>
        <h3>{f.OnboardingPageTitle}</h3>
        <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' }}>{f.OnboardingPageSubtitle}</p>
      </div>
      <div className={css.configTabs}>
        <Pivot selectedKey={tab} onLinkClick={(item) => item && setTab(item.props.itemKey as string)} styles={{ root: { marginBottom: 20 } }}>
          <PivotItem headerText={f.TabOnboarding} itemKey="onboarding" itemIcon="AddFriend" />
          <PivotItem headerText={f.TabOffboarding} itemKey="offboarding" itemIcon="UserRemove" />
          {state.isAdmin && <PivotItem headerText={f.TabKits} itemKey="kits" itemIcon="Package" />}
        </Pivot>
      </div>
      {tab === 'onboarding' && renderOnboarding()}
      {tab === 'offboarding' && renderOffboarding()}
      {tab === 'kits' && state.isAdmin && renderKits()}
    </div>
  );
};
