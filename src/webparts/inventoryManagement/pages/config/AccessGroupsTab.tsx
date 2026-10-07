import * as React from 'react';
import {
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  TextField,
  Dropdown,
  IDropdownOption,
  NormalPeoplePicker,
  IPersonaProps,
  Persona,
  PersonaSize,
  ValidationState,
  Label,
  Icon
} from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import css from '../ConfigPage.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IGroupInfo } from '../../services/ListHealthService';
import { PeopleSearchService, IPersonResult } from '../../services/PeopleSearchService';
import { SiteGroupService } from '../../services/SiteGroupService';
import { initials } from '../../components/inventory/inventoryUi';

export interface IRoleGroup {
  group: string;
  role: () => string;
  desc: () => string;
}

export interface IAccessGroupsTabProps {
  roleGroups: IRoleGroup[];
  groups: Record<string, IGroupInfo>;
  loadingGroups: Record<string, boolean>;
  onLoadGroup: (groupName: string) => Promise<void>;
  onLoadAll: () => void;
}

type IPickedPersona = IPersonaProps & { data?: IPersonResult };

const local = mergeStyleSets({
  form: { margin: '0 0 16px', padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(128, 128, 128, 0.22)', background: 'rgba(128, 128, 128, 0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'minmax(180px, 240px) minmax(0, 1fr)', gap: 12, alignItems: 'start', selectors: { '@media (max-width: 640px)': { gridTemplateColumns: '1fr' } } },
  formActions: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  hint: { display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: 10, fontSize: 12, color: 'var(--text-muted, #616161)' },
  suggestion: { display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', textAlign: 'left', minWidth: 0 },
  suggestionText: { display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: '18px' },
  suggestionName: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  suggestionMeta: { fontSize: 12, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  buttons: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  members: { listStyle: 'none', margin: '12px 0 0', padding: 0, borderTop: '1px solid rgba(128, 128, 128, 0.18)' },
  member: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 2px', borderBottom: '1px solid rgba(128, 128, 128, 0.12)', minWidth: 0 },
  coin: { width: 28, height: 28, borderRadius: '50%', background: '#0f6cbd', color: '#ffffff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  memberName: { fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  memberEmail: { fontSize: 12, color: 'var(--text-muted, #616161)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
});

const sameEmail = (a?: string, b?: string): boolean => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

/** Config → Access Groups: the role groups, their members on request, and adding people to a group. */
export const AccessGroupsTab: React.FC<IAccessGroupsTabProps> = (props) => {
  const { roleGroups, groups, loadingGroups } = props;
  const s = strings.ConfigPage;
  const a = strings.AccessGroups;

  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const [filter, setFilter] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [targetGroup, setTargetGroup] = React.useState<string>(roleGroups.length ? roleGroups[0].group : '');
  const [picked, setPicked] = React.useState<IPickedPersona[]>([]);
  const [adding, setAdding] = React.useState(false);
  const [result, setResult] = React.useState<{ type: MessageBarType; lines: string[] } | undefined>();

  const roleOf = (groupName: string): string => {
    const match = roleGroups.filter(g => g.group === groupName)[0];
    return match ? match.role() : '';
  };

  const toggleMembers = (groupName: string): void => {
    const next = !open[groupName];
    setOpen(prev => ({ ...prev, [groupName]: next }));
    if (next && !groups[groupName]) props.onLoadGroup(groupName).catch(() => undefined);
  };

  const openForm = (groupName?: string): void => {
    if (groupName) setTargetGroup(groupName);
    setPicked([]);
    setResult(undefined);
    setFormOpen(true);
  };

  const membersOf = (groupName: string): { name: string; email: string }[] => {
    const info = groups[groupName];
    return info && info.exists && !info.error ? info.members : [];
  };

  // Directory search; people already in the chosen group are left out.
  const resolveSuggestions = async (text: string, current?: IPersonaProps[]): Promise<IPersonaProps[]> => {
    const found = await PeopleSearchService.search(text, 10);
    const existing = membersOf(targetGroup);
    const chosen = (current || []) as IPickedPersona[];
    return found
      .filter(p => !existing.some(m => sameEmail(m.email, p.email)))
      .filter(p => !chosen.some(c => c.data && sameEmail(c.data.email, p.email)))
      .map(p => ({ key: p.loginName || p.email, text: p.displayName, secondaryText: p.email, data: p }) as IPickedPersona);
  };

  const renderSuggestion = (persona: IPersonaProps): JSX.Element => (
    <div className={local.suggestion}>
      <Persona text={persona.text} size={PersonaSize.size32} hidePersonaDetails />
      <div className={local.suggestionText}>
        <span className={local.suggestionName}>{persona.text}</span>
        {persona.secondaryText && <span className={local.suggestionMeta}>{persona.secondaryText}</span>}
      </div>
    </div>
  );

  const addPeople = async (): Promise<void> => {
    const people = picked.map(p => p.data).filter((p): p is IPersonResult => !!p);
    if (!targetGroup || people.length === 0) return;
    setAdding(true);
    setResult(undefined);
    const added: string[] = [];
    const failed: string[] = [];
    for (const person of people) {
      try {
        await SiteGroupService.addMember(targetGroup, person);
        added.push(person.displayName);
      } catch (e: any) {
        failed.push(formatString(a.AddFailed, person.displayName, e && e.message ? e.message : String(e)));
      }
    }
    await props.onLoadGroup(targetGroup).catch(() => undefined);
    setOpen(prev => ({ ...prev, [targetGroup]: true }));
    setAdding(false);
    setPicked([]);
    const lines = (added.length ? [formatString(a.AddedResult, targetGroup, added.join(', '))] : []).concat(failed);
    setResult({ type: failed.length === 0 ? MessageBarType.success : added.length ? MessageBarType.warning : MessageBarType.error, lines });
  };

  const groupOptions: IDropdownOption[] = roleGroups.map(g => ({ key: g.group, text: `${g.group} (${g.role()})` }));
  const query = filter.trim().toLowerCase();

  return (
    <div className={css.panel}>
      <div className={css.panelHeader}>
        <div>
          <h4>{s.RbacTitle}</h4>
          <p>{s.RbacDesc} {s.RbacRoleRule}</p>
        </div>
        <div className={css.actions}>
          <TextField
            placeholder={s.FilterMembersPlaceholder}
            value={filter}
            onChange={(_, v) => setFilter(v || '')}
            iconProps={{ iconName: 'Filter' }}
            styles={{ root: { width: 220 } }}
          />
          <DefaultButton text={s.LoadAllGroupsButton} iconProps={{ iconName: 'Refresh' }} onClick={props.onLoadAll} />
          <PrimaryButton text={a.AddMembers} iconProps={{ iconName: 'AddFriend' }} onClick={() => openForm()} disabled={formOpen} />
        </div>
      </div>

      {formOpen && (
        <div className={local.form}>
          <h5 className={css.listTitle} style={{ marginTop: 0 }}>{a.AddTitle}</h5>
          <div className={local.formGrid}>
            <Dropdown
              label={a.LabelGroup}
              options={groupOptions}
              selectedKey={targetGroup}
              onChange={(_, o) => { if (o) { setTargetGroup(String(o.key)); setPicked([]); } }}
              disabled={adding}
            />
            <div>
              <Label>{a.LabelPeople}</Label>
              <NormalPeoplePicker
                onResolveSuggestions={(text, current) => resolveSuggestions(text, current)}
                onRenderSuggestionsItem={(persona) => renderSuggestion(persona)}
                selectedItems={picked}
                onChange={(items) => setPicked((items || []) as IPickedPersona[])}
                onValidateInput={() => ValidationState.invalid}
                itemLimit={10}
                resolveDelay={300}
                disabled={adding}
                inputProps={{ placeholder: a.PeoplePlaceholder, 'aria-label': a.LabelPeople }}
                pickerSuggestionsProps={{ suggestionsHeaderText: a.SuggestionsHeader, noResultsFoundText: a.NoResults, loadingText: a.Searching }}
              />
            </div>
          </div>
          <div className={local.hint}>
            <Icon iconName="Info" style={{ marginTop: 2 }} />
            <span>{formatString(a.RoleHint, targetGroup, roleOf(targetGroup))}</span>
          </div>
          <div className={local.formActions}>
            <PrimaryButton
              text={adding ? a.Adding : a.AddButton}
              iconProps={{ iconName: 'AddFriend' }}
              onClick={() => { addPeople().catch(() => undefined); }}
              disabled={adding || picked.length === 0 || !targetGroup}
            />
            <DefaultButton text={strings.Common.Close} onClick={() => { setFormOpen(false); setPicked([]); }} disabled={adding} />
          </div>
          {result && (
            <MessageBar messageBarType={result.type} isMultiline onDismiss={() => setResult(undefined)} styles={{ root: { marginTop: 12 } }}>
              {result.lines.map((line, i) => <div key={i}>{line}</div>)}
            </MessageBar>
          )}
        </div>
      )}

      {roleGroups.map(item => {
        const isLoading = !!loadingGroups[item.group];
        const info = groups[item.group];
        const isOpen = !!open[item.group];
        const all = membersOf(item.group);
        const shown = !query ? all : all.filter(m => m.name.toLowerCase().indexOf(query) >= 0 || m.email.toLowerCase().indexOf(query) >= 0);

        return (
          <div key={item.group} className={css.listCard}>
            <div className={css.listCardTop}>
              <div style={{ flex: '1 1 300px' }}>
                <h5 className={css.listTitle}>
                  {item.group}
                  <span className={css.roleTag}>{item.role()}</span>
                  {info && info.exists && !info.error && <span className={`${css.pill} ${css.pillNeutral}`}>{formatString(s.MemberCount, info.members.length)}</span>}
                  {info && info.currentUserIsMember && <span className={`${css.pill} ${css.pillInfo}`}>{s.YouAreMember}</span>}
                  {query && info && info.exists && !info.error && <span className={`${css.pill} ${css.pillNeutral}`}>{formatString(a.FilterMatches, shown.length)}</span>}
                </h5>
                <span className={css.muted}>{item.desc()}</span>
              </div>
              <div className={local.buttons}>
                <DefaultButton
                  text={isLoading ? s.LoadingButton : isOpen ? a.HideMembers : s.ViewMembersButton}
                  iconProps={{ iconName: isOpen ? 'ChevronUp' : 'People' }}
                  onClick={() => toggleMembers(item.group)}
                  disabled={isLoading}
                  aria-expanded={isOpen}
                />
                <DefaultButton text={a.AddMember} iconProps={{ iconName: 'AddFriend' }} onClick={() => openForm(item.group)} />
              </div>
            </div>

            {info && !info.exists && <div className={css.errorBox}>{s.GroupNotFound}</div>}
            {info && info.exists && info.error && <div className={css.errorBox}>{formatString(s.GroupLoadError, info.error)}</div>}
            {isOpen && info && info.exists && !info.error && (
              all.length === 0 ? (
                <div className={css.muted} style={{ marginTop: 10, fontStyle: 'italic' }}>{s.NoMembersFound}</div>
              ) : shown.length === 0 ? (
                <div className={css.muted} style={{ marginTop: 10, fontStyle: 'italic' }}>{a.NoMatches}</div>
              ) : (
                <ul className={local.members} aria-label={formatString(a.MembersOf, item.group)}>
                  {shown.map((m, i) => (
                    <li key={`${m.email}-${i}`} className={local.member}>
                      <span className={local.coin} aria-hidden="true">{initials(m.name)}</span>
                      <span style={{ minWidth: 0 }}>
                        <span className={local.memberName} style={{ display: 'block' }}>{m.name}</span>
                        {m.email && <span className={local.memberEmail} style={{ display: 'block' }}>{m.email}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        );
      })}
    </div>
  );
};
