import * as React from 'react';
import {
  Panel,
  PanelType,
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  ActionButton,
  TextField,
  Toggle,
  ChoiceGroup,
  IChoiceGroupOption,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  Icon
} from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getAppConfig } from '../config/AppConfig';
import { EmailService } from '../services/EmailService';
import { EmailOutbox, IEmailOutboxEntry, EmailOutboxStatus } from '../services/EmailOutbox';
import {
  EmailSettingsService,
  IEmailSettings,
  EmailPreviewMode,
  parseRecipients
} from '../services/EmailSettingsService';

export interface IEmailCenterPanelProps {
  isOpen: boolean;
  /** Admins also get the Settings tab. */
  isAdmin: boolean;
  /** Opens straight on this email (used when the panel opens itself after a send). */
  entryId?: string;
  onDismiss: () => void;
}

const STATUS_STYLE: { [key in EmailOutboxStatus]: { icon: string; color: string; soft: string } } = {
  sent: { icon: 'CheckMark', color: '#107c10', soft: '#dff6dd' },
  failed: { icon: 'ErrorBadge', color: '#c50f1f', soft: '#fde7e9' },
  skipped: { icon: 'Blocked2', color: '#616161', soft: '#f0f0f0' }
};

const statusLabel = (status: EmailOutboxStatus): string =>
  status === 'sent' ? strings.EmailCenter.StatusSent
    : status === 'failed' ? strings.EmailCenter.StatusFailed
      : strings.EmailCenter.StatusSkipped;

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const css = mergeStyleSets({
  banner: { marginBottom: 12 },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 8px' },
  muted: { color: '#616161', fontSize: 12 },
  empty: {
    textAlign: 'center',
    padding: '40px 16px',
    color: '#616161',
    border: '1px dashed #d1d1d1',
    borderRadius: 8,
    fontSize: 14
  },
  emptyIcon: { fontSize: 28, color: '#8a8886', display: 'block', marginBottom: 8 },
  list: { listStyle: 'none', margin: 0, padding: 0, border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 14px',
    border: 'none',
    background: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
    font: 'inherit',
    selectors: {
      ':hover': { background: '#f5f5f5' },
      ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 }
    }
  },
  rowDivider: { borderTop: '1px solid #ebebeb' },
  statusDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: 14
  },
  rowText: { flex: 1, minWidth: 0 },
  rowSubject: { display: 'block', fontWeight: 600, color: '#242424', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowMeta: { display: 'block', fontSize: 12, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pill: { fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 999, flexShrink: 0 },
  detail: { display: 'flex', flexDirection: 'column', gap: 14 },
  previewLabel: { fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 6 },
  preview: {
    border: '1px solid #e0e0e0',
    borderRadius: 8,
    padding: 16,
    overflow: 'auto',
    background: '#ffffff',
    maxHeight: 420
  },
  section: { border: '1px solid #e0e0e0', borderRadius: 8, padding: '16px 16px 4px', marginBottom: 16 },
  sectionTitle: { margin: '0 0 2px', fontSize: 16, fontWeight: 600, color: '#242424' },
  sectionDesc: { margin: '0 0 14px', fontSize: 12, color: '#616161' },
  fieldHint: { margin: '-6px 0 14px', fontSize: 12, color: '#616161', lineHeight: '18px' },
  footer: { display: 'flex', gap: 8 }
});

export const EmailCenterPanel: React.FC<IEmailCenterPanelProps> = (props) => {
  const { isOpen, isAdmin, entryId, onDismiss } = props;
  const s = strings.EmailCenter;
  const m = strings.MockEmailPanel;

  const [entries, setEntries] = React.useState<IEmailOutboxEntry[]>(EmailOutbox.getAll());
  const [tab, setTab] = React.useState<'outbox' | 'settings'>('outbox');
  const [selectedId, setSelectedId] = React.useState<string | undefined>(entryId);

  // Outbox detail editor
  const [editTo, setEditTo] = React.useState('');
  const [editSubject, setEditSubject] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | undefined>();

  // Settings
  const [settings, setSettings] = React.useState<IEmailSettings | undefined>();
  const [draft, setDraft] = React.useState<IEmailSettings | undefined>();
  const [adminRecipientsText, setAdminRecipientsText] = React.useState('');
  const [savingSettings, setSavingSettings] = React.useState(false);
  const [settingsMessage, setSettingsMessage] = React.useState<{ type: MessageBarType; text: string } | undefined>();
  const [previewMode, setPreviewMode] = React.useState<EmailPreviewMode>(EmailSettingsService.getPreviewMode());

  React.useEffect(() => EmailOutbox.subscribe(() => setEntries(EmailOutbox.getAll())), []);

  // Every time the panel opens: jump to the requested email (or the list) and re-read the settings.
  React.useEffect(() => {
    if (!isOpen) return;
    setTab('outbox');
    setSelectedId(entryId);
    setSettingsMessage(undefined);
    EmailSettingsService.refresh()
      .then(loaded => {
        setSettings(loaded);
        setDraft(loaded);
        setAdminRecipientsText(loaded.testAdminRecipients.join(', '));
      })
      .catch(() => undefined);
  }, [isOpen, entryId]);

  const selected = selectedId ? entries.find(e => e.id === selectedId) : undefined;

  React.useEffect(() => {
    if (selected) {
      setEditTo(selected.to.join(', '));
      setEditSubject(selected.subject);
      setSendError(undefined);
    }
  }, [selected?.id]);

  const send = async (): Promise<void> => {
    if (!selected) return;
    const current = await EmailSettingsService.get();
    if (!current.enabled) {
      setSendError(s.SendBlockedOff);
      return;
    }
    const recipients = parseRecipients(editTo);
    if (recipients.length === 0) {
      setSendError(s.RecipientsRequired);
      return;
    }
    setSending(true);
    setSendError(undefined);
    try {
      await EmailService.sendMail(recipients, editSubject, selected.body);
    } catch (e: any) {
      setSendError(e && e.message ? e.message : String(e));
    } finally {
      setSending(false);
      // The attempt is now the newest outbox entry; show it so its result is visible.
      const newest = EmailOutbox.getAll()[0];
      if (newest && newest.id !== selected.id) setSelectedId(newest.id);
    }
  };

  const adminRecipients = parseRecipients(adminRecipientsText);
  const managerRecipientValid = !!draft && parseRecipients(draft.testManagerRecipient).length === 1;
  const settingsInvalid = !!draft && draft.testMode && (adminRecipients.length === 0 || !managerRecipientValid);
  const settingsDirty = !!draft && !!settings && (
    draft.enabled !== settings.enabled ||
    draft.testMode !== settings.testMode ||
    draft.testManagerRecipient.trim() !== settings.testManagerRecipient ||
    adminRecipients.join(',') !== settings.testAdminRecipients.join(',')
  );

  const saveSettings = async (): Promise<void> => {
    if (!draft) return;
    setSavingSettings(true);
    setSettingsMessage(undefined);
    try {
      const saved = await EmailSettingsService.save({ ...draft, testAdminRecipients: adminRecipients });
      setSettings(saved);
      setDraft(saved);
      setAdminRecipientsText(saved.testAdminRecipients.join(', '));
      setSettingsMessage({ type: MessageBarType.success, text: s.SettingsSaved });
    } catch (e: any) {
      setSettingsMessage({ type: MessageBarType.error, text: formatString(s.SettingsSaveFailed, e && e.message ? e.message : String(e)) });
    } finally {
      setSavingSettings(false);
    }
  };

  const previewOptions: IChoiceGroupOption[] = [
    { key: 'never', text: s.PreviewModeNever },
    { key: 'failure', text: s.PreviewModeFailure },
    { key: 'always', text: s.PreviewModeAlways }
  ];

  const renderStatusBanners = (): React.ReactNode => (
    <>
      {settings && !settings.enabled && (
        <MessageBar messageBarType={MessageBarType.warning} className={css.banner}>{s.StatusOff}</MessageBar>
      )}
      {settings && settings.enabled && settings.testMode && (
        <MessageBar messageBarType={MessageBarType.info} className={css.banner}>{s.StatusTestMode}</MessageBar>
      )}
    </>
  );

  const renderOutboxList = (): React.ReactNode => (
    <>
      <div className={css.toolbar}>
        <span className={css.muted}>{s.OutboxSessionNote}</span>
        {entries.length > 0 && (
          <ActionButton iconProps={{ iconName: 'Clear' }} text={s.ClearOutbox} onClick={() => EmailOutbox.clear()} />
        )}
      </div>
      {entries.length === 0 ? (
        <div className={css.empty}>
          <Icon iconName="Mail" className={css.emptyIcon} />
          {s.OutboxEmpty}
        </div>
      ) : (
        <ul className={css.list}>
          {entries.map((entry, index) => {
            const st = STATUS_STYLE[entry.status];
            return (
              <li key={entry.id} className={index > 0 ? css.rowDivider : undefined}>
                <button type="button" className={css.row} onClick={() => setSelectedId(entry.id)}>
                  <span className={css.statusDot} style={{ backgroundColor: st.soft, color: st.color }}>
                    <Icon iconName={st.icon} />
                  </span>
                  <span className={css.rowText}>
                    <span className={css.rowSubject}>{entry.subject}</span>
                    <span className={css.rowMeta}>{formatString(s.ToLabel, entry.to.join(', '))} · {formatTime(entry.timestamp)}</span>
                  </span>
                  <span className={css.pill} style={{ backgroundColor: st.soft, color: st.color }}>{statusLabel(entry.status)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );

  const renderDetail = (entry: IEmailOutboxEntry): React.ReactNode => {
    const time = formatTime(entry.timestamp);
    let banner: React.ReactNode;
    if (entry.status === 'failed') {
      banner = <MessageBar messageBarType={MessageBarType.error}>{formatString(s.DetailFailed, time, entry.error || '')}</MessageBar>;
    } else if (entry.status === 'skipped') {
      banner = <MessageBar messageBarType={MessageBarType.warning}>{formatString(s.DetailSkipped, time)}</MessageBar>;
    } else if (entry.method === 'spUtility') {
      banner = <MessageBar messageBarType={MessageBarType.warning}>{formatString(s.DetailSentFallback, time)}</MessageBar>;
    } else {
      banner = <MessageBar messageBarType={MessageBarType.success}>{formatString(s.DetailSent, time)}</MessageBar>;
    }

    return (
      <div className={css.detail}>
        <div>
          <ActionButton iconProps={{ iconName: 'Back' }} text={s.BackToOutbox} onClick={() => setSelectedId(undefined)} disabled={sending} />
        </div>
        {banner}
        <TextField
          label={m.LabelRecipients}
          value={editTo}
          onChange={(_, v) => setEditTo(v || '')}
          required
          disabled={sending}
          iconProps={{ iconName: 'Mail' }}
        />
        <TextField
          label={m.LabelSubject}
          value={editSubject}
          onChange={(_, v) => setEditSubject(v || '')}
          required
          disabled={sending}
        />
        {sendError && (
          <MessageBar messageBarType={MessageBarType.error}>{m.ErrorPrefix} {sendError}</MessageBar>
        )}
        {sending && <ProgressIndicator label={m.ProgressLabel} />}
        <div>
          <span className={css.previewLabel}>{m.PreviewLabel}</span>
          <div className={css.preview} dangerouslySetInnerHTML={{ __html: entry.body }} />
        </div>
      </div>
    );
  };

  const renderSettings = (): React.ReactNode => {
    if (!draft) return <ProgressIndicator label={s.SettingsLoading} />;
    return (
      <>
        {settingsMessage && (
          <MessageBar messageBarType={settingsMessage.type} onDismiss={() => setSettingsMessage(undefined)} className={css.banner}>
            {settingsMessage.text}
          </MessageBar>
        )}

        <section className={css.section}>
          <h3 className={css.sectionTitle}>{s.SectionDelivery}</h3>
          <p className={css.sectionDesc}>{formatString(s.SectionDeliveryDesc, getAppConfig().lists.appSettings)}</p>

          <Toggle
            label={s.ToggleEnabled}
            checked={draft.enabled}
            onText={s.ToggleOn}
            offText={s.ToggleOff}
            onChange={(_, checked) => setDraft({ ...draft, enabled: !!checked })}
            disabled={savingSettings}
          />

          <Toggle
            label={s.ToggleTestMode}
            checked={draft.testMode}
            onText={s.ToggleOn}
            offText={s.ToggleOff}
            onChange={(_, checked) => setDraft({ ...draft, testMode: !!checked })}
            disabled={savingSettings}
          />
          <p className={css.fieldHint}>{s.TestModeDesc}</p>

          {draft.testMode && (
            <>
              <TextField
                label={s.LabelTestAdminRecipients}
                value={adminRecipientsText}
                placeholder={s.RecipientsPlaceholder}
                onChange={(_, v) => setAdminRecipientsText(v || '')}
                errorMessage={adminRecipients.length === 0 ? s.RecipientsRequired : undefined}
                disabled={savingSettings}
                required
              />
              <TextField
                label={s.LabelTestManagerRecipient}
                value={draft.testManagerRecipient}
                placeholder="name@company.com"
                onChange={(_, v) => setDraft({ ...draft, testManagerRecipient: v || '' })}
                errorMessage={!managerRecipientValid ? s.RecipientsRequired : undefined}
                disabled={savingSettings}
                required
                styles={{ root: { marginTop: 8, marginBottom: 12 } }}
              />
            </>
          )}

          <div style={{ marginBottom: 12 }}>
            <PrimaryButton
              text={s.SaveSettings}
              iconProps={{ iconName: 'Save' }}
              onClick={() => { saveSettings().catch(() => undefined); }}
              disabled={!settingsDirty || settingsInvalid || savingSettings}
            />
          </div>
          {savingSettings && <ProgressIndicator />}
        </section>

        <section className={css.section}>
          <h3 className={css.sectionTitle}>{s.SectionBrowser}</h3>
          <ChoiceGroup
            label={s.PreviewModeLabel}
            selectedKey={previewMode}
            options={previewOptions}
            onChange={(_, option) => {
              if (!option) return;
              const mode = option.key as EmailPreviewMode;
              setPreviewMode(mode);
              EmailSettingsService.setPreviewMode(mode);
            }}
            styles={{ root: { marginBottom: 12 } }}
          />
        </section>
      </>
    );
  };

  const showingDetail = tab === 'outbox' && !!selected;

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.medium}
      headerText={s.Title}
      closeButtonAriaLabel={strings.Common.Close}
      isFooterAtBottom={true}
      onRenderFooterContent={() => (
        <div className={css.footer}>
          {showingDetail && selected && (
            <PrimaryButton
              text={sending ? m.ButtonSending : selected.status === 'sent' ? s.SendAgain : s.SendNow}
              iconProps={{ iconName: 'Send' }}
              onClick={() => { send().catch(() => undefined); }}
              disabled={sending || !editTo.trim() || !editSubject.trim()}
            />
          )}
          <DefaultButton text={m.ButtonClose} onClick={onDismiss} disabled={sending} />
        </div>
      )}
    >
      {renderStatusBanners()}

      {isAdmin && (
        <Pivot
          selectedKey={tab}
          onLinkClick={item => item && setTab(item.props.itemKey as 'outbox' | 'settings')}
          styles={{ root: { marginBottom: 12 } }}
        >
          <PivotItem
            headerText={s.TabOutbox}
            itemKey="outbox"
            itemIcon="Mail"
            itemCount={entries.length || undefined}
          />
          <PivotItem headerText={s.TabSettings} itemKey="settings" itemIcon="Settings" />
        </Pivot>
      )}

      {tab === 'settings' && isAdmin
        ? renderSettings()
        : selected ? renderDetail(selected) : renderOutboxList()}
    </Panel>
  );
};
