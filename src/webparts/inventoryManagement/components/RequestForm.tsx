import * as React from 'react';
import {
  Panel,
  PanelType,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  Stack,
  IStackTokens,
  MessageBar,
  MessageBarType,
  Label,
  NormalPeoplePicker,
  IPersonaProps,
  Persona,
  PersonaSize,
  ValidationState,
  Icon
} from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEmployee } from '../models/IEmployee';
import { RoleUtils, UserRole } from '../utils/RoleUtils';
import { DEFAULT_ASSET_TYPE_OPTIONS, ASSET_REQUEST_PRIORITY_OPTIONS } from '../constants/DropdownConstants';
import { PeopleSearchService, IPersonResult } from '../services/PeopleSearchService';
import { getAppConfig } from '../config/AppConfig';
import { formatString } from '../utils/LocalizationUtils';
import { getSlaStage } from '../utils/RequestSlaUtils';
import { isOpenRequest, isSameAssetType } from '../utils/RequestDuplicateUtils';
import * as strings from 'InventoryManagementWebPartStrings';

/** The manager picked in the form. `email` is empty when the name was typed rather than found. */
interface IManagerChoice {
  displayName: string;
  email: string;
  jobTitle?: string;
  department?: string;
}

/** A picker suggestion carrying the full person record. */
type IManagerPersona = IPersonaProps & { data?: IManagerChoice };

const pickerCss = mergeStyleSets({
  suggestion: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', textAlign: 'left', minWidth: 0 },
  suggestionText: { minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: '18px' },
  suggestionName: { fontSize: 14, fontWeight: 600, color: '#242424', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  suggestionMeta: { fontSize: 12, color: '#616161', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
    padding: '10px 12px',
    borderRadius: 6,
    border: '1px solid #e0e0e0',
    background: '#fafafa'
  },
  cardLine: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#616161', lineHeight: '18px' },
  cardWarn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a3707', lineHeight: '18px' },
  error: { color: '#a4262c', fontSize: 12, marginTop: 4 }
});

const detailsLine = (jobTitle?: string, department?: string): string =>
  [jobTitle, department].filter(v => !!(v && v.trim())).join(' · ');

export interface IRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  availableAssets: IInventoryItem[];
  employees: IEmployee[];
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserEmail?: string;
  /** The current user's own requests; a type with one still in progress cannot be requested again. */
  myRequests?: IRequest[];
  onSubmitRequest: (request: Omit<IRequest, 'id' | 'requestKey' | 'status'>) => void;
}

const stackTokens: IStackTokens = { childrenGap: 15 };

export const RequestForm: React.FC<IRequestFormProps> = (props) => {
  const [selectedRequesterId, setSelectedRequesterId] = React.useState<string | undefined>(undefined);
  const [employeeId, setEmployeeId] = React.useState('');
  const [manager, setManager] = React.useState<IManagerChoice | undefined>(undefined);
  const managerName = manager ? manager.displayName : '';
  const [managersError, setManagersError] = React.useState<string | undefined>(undefined);
  const [selectedAssetType, setSelectedAssetType] = React.useState<string | undefined>(undefined);
  const [priority, setPriority] = React.useState<'High' | 'Medium' | 'Low'>('Medium');
  const [quantity, setQuantity] = React.useState<number>(1);
  const [reason, setReason] = React.useState('');
  const [requestDate, setRequestDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [reasonTouched, setReasonTouched] = React.useState(false);
  const [managerNameTouched, setManagerNameTouched] = React.useState(false);

  React.useEffect(() => {
    if (props.isOpen) {
      setRequestDate(new Date().toISOString().split('T')[0]);
      setReasonTouched(false);
      setManagerNameTouched(false);
    }
  }, [props.isOpen]);

  const isAdmin = props.currentUserRole === 'Admin';
  const isManager = props.currentUserRole === 'Inventory Manager';
  const isEmployee = props.currentUserRole === 'Inventory Employee';

  const currentUserOption: IEmployee = {
    id: 'current-user',
    name: props.currentUserName,
    email: props.currentUserEmail || '',
    department: 'Your Department',
    jobTitle: props.currentUserRole
  };

  const matchedEmployee = props.employees.find(emp => 
    (props.currentUserEmail && emp.email.toLowerCase() === props.currentUserEmail.toLowerCase()) ||
    emp.name.toLowerCase() === props.currentUserName.toLowerCase()
  );

  const activeEmployee = matchedEmployee || currentUserOption;
  const availableEmployees = [activeEmployee];
  const allEmployees = props.employees.some(e => e.id === activeEmployee.id) ? props.employees : [activeEmployee, ...props.employees];

  const employeeOptions: IDropdownOption[] = availableEmployees.map(emp => ({
    key: emp.id,
    text: `${emp.name} (${emp.department})`
  }));

  // Auto-select current user and pre-populate Employee ID
  React.useEffect(() => {
    if (props.isOpen && employeeOptions.length > 0) {
      setSelectedRequesterId(activeEmployee.id);
      setEmployeeId(activeEmployee.id === 'current-user' ? '' : activeEmployee.id);
    }
  }, [props.isOpen, employeeOptions]);

  const uniqueAssetTypes = Array.from(new Set(props.availableAssets.map(a => a.assetType).filter(Boolean)));
  const dynamicAssetTypeOptions: IDropdownOption[] = uniqueAssetTypes.map(type => ({ key: type, text: type }));

  // One open request per asset type: a type is blocked until its request is assigned or rejected.
  const openRequests = (props.myRequests || []).filter(isOpenRequest);
  const openRequestFor = (type?: string): IRequest | undefined => openRequests.filter(r => isSameAssetType(r.assetTitle, type))[0];
  const stageText = (request: IRequest): string =>
    getSlaStage(request) === 'awaitingAssignment' ? strings.Reports.OutcomeAwaitingAssignment : strings.Reports.OutcomeAwaitingApproval;
  const describeOpen = (request: IRequest): string =>
    formatString(strings.RequestForm.OpenRequestItem, request.assetTitle, request.requestKey || `#${request.id}`, stageText(request));
  const blockingRequest = openRequestFor(selectedAssetType);

  const assetTypeOptions: IDropdownOption[] = (dynamicAssetTypeOptions.length > 0
    ? dynamicAssetTypeOptions
    : DEFAULT_ASSET_TYPE_OPTIONS
  ).map(option => openRequestFor(String(option.key))
    ? { ...option, disabled: true, text: formatString(strings.RequestForm.TypeInProgress, option.text) }
    : option);

  // Only approvers can be picked: members of the manager role group (property pane,
  // default MSFT Owners/Members/Visitors -> MSFT Members). The requester is left out,
  // since nobody approves their own request.
  const managerGroup = getAppConfig().roleGroups.manager;
  const toPersona = (p: IManagerChoice): IManagerPersona => ({
    key: p.email.toLowerCase(),
    text: p.displayName,
    secondaryText: detailsLine(p.jobTitle, p.department),
    tertiaryText: p.email,
    data: p
  });

  const loadManagers = async (): Promise<IManagerChoice[]> => {
    const self = (props.currentUserEmail || '').toLowerCase();
    try {
      const members = await PeopleSearchService.getGroupMembers(managerGroup);
      setManagersError(undefined);
      return members
        .filter(m => m.email.toLowerCase() !== self)
        .map(m => ({ displayName: m.displayName, email: m.email }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));
    } catch (err: any) {
      setManagersError(err && err.message ? err.message : String(err));
      return [];
    }
  };

  // Match the text against the manager group, then add job title and department from the directory.
  const resolveManagerSuggestions = async (filter: string): Promise<IManagerPersona[]> => {
    const text = filter.trim().toLowerCase();
    const managers = (await loadManagers()).filter(m =>
      m.displayName.toLowerCase().indexOf(text) >= 0 || m.email.toLowerCase().indexOf(text) >= 0);
    if (managers.length === 0) return [];
    const directory: IPersonResult[] = await PeopleSearchService.search(filter, 20);
    return managers.slice(0, 10).map(m => {
      const match = directory.find(d => (d.email || '').toLowerCase() === m.email.toLowerCase());
      return toPersona(match ? { ...m, jobTitle: match.jobTitle, department: match.department } : m);
    });
  };

  // Clicking into the empty field lists every manager.
  const listAllManagers = async (): Promise<IManagerPersona[]> => (await loadManagers()).slice(0, 25).map(toPersona);

  const renderManagerSuggestion = (persona: IPersonaProps): JSX.Element => (
    <div className={pickerCss.suggestion}>
      <Persona text={persona.text} size={PersonaSize.size40} hidePersonaDetails />
      <div className={pickerCss.suggestionText}>
        <span className={pickerCss.suggestionName}>{persona.text}</span>
        {persona.secondaryText && <span className={pickerCss.suggestionMeta}>{persona.secondaryText}</span>}
        {persona.tertiaryText && <span className={pickerCss.suggestionMeta}>{persona.tertiaryText}</span>}
      </div>
    </div>
  );

  // A manager counts only when picked from the list, which always carries an email.
  const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!manager && !!manager.email && !!selectedAssetType && !blockingRequest && quantity > 0 && !!reason.trim();

  const onSave = () => {
    const employee = activeEmployee;
    if (blockingRequest) return;

    // Find a real asset ID to satisfy SharePoint backend lookups
    let matchingAsset = props.availableAssets.find(
      a => a.assetType === selectedAssetType && 
           (a.status === 'In Stock' || a.status === 'Yes')
    );
    if (!matchingAsset) {
      matchingAsset = props.availableAssets.find(a => a.assetType === selectedAssetType);
    }

    if (selectedAssetType && employee) {
      props.onSubmitRequest({
        requesterName: employee.name,
        requesterEmail: employee.email,
        employeeId: employeeId,
        managerName: managerName.trim(),
        // Lets the approval email go to the manager picked here instead of a name lookup.
        managerEmail: manager && manager.email ? manager.email : undefined,
        assetId: matchingAsset ? matchingAsset.id : '1',
        assetTitle: selectedAssetType,
        priority: priority,
        quantity,
        reason,
        requestDate
      } as any);

      setSelectedRequesterId(undefined);
      setEmployeeId('');
      setManager(undefined);
      setSelectedAssetType(undefined);
      setPriority('Medium');
      setQuantity(1);
      setReason('');
      setRequestDate(new Date().toISOString().split('T')[0]);
      setReasonTouched(false);
      setManagerNameTouched(false);
      props.onClose();
    }
  };

  return (
    <Panel
      isOpen={props.isOpen}
      onDismiss={props.onClose}
      type={PanelType.custom}
      customWidth="100%"
      styles={{ main: { maxWidth: '450px' } }}
      headerText={strings.RequestForm.HeaderText}
      closeButtonAriaLabel={strings.Common.Close}
    >
      <Stack tokens={stackTokens}>
        <MessageBar messageBarType={MessageBarType.info}>
          {strings.RequestForm.OnBehalfHint}
        </MessageBar>
        <Dropdown
          label={strings.RequestForm.LabelRequester}
          selectedKey={selectedRequesterId}
          options={employeeOptions}
          required
          disabled
        />
        <TextField
          label={strings.RequestForm.LabelEmployeeId}
          value={employeeId}
          onChange={(_, val) => setEmployeeId(val || '')}
          required
          disabled={activeEmployee.id !== 'current-user'}
        />
        <div>
          <Label required>{strings.RequestForm.LabelManagerName}</Label>
          <NormalPeoplePicker
            onResolveSuggestions={(filter) => resolveManagerSuggestions(filter)}
            onEmptyResolveSuggestions={() => listAllManagers()}
            onRenderSuggestionsItem={(persona) => renderManagerSuggestion(persona)}
            selectedItems={manager ? [{ key: manager.email || manager.displayName, text: manager.displayName, secondaryText: manager.email }] : []}
            onChange={(items) => {
              const picked = items && items.length > 0 ? (items[0] as IManagerPersona).data : undefined;
              setManager(picked);
              setManagerNameTouched(true);
            }}
            // Typed text that isn't a picked manager is never accepted.
            onValidateInput={() => ValidationState.invalid}
            onBlur={() => setManagerNameTouched(true)}
            itemLimit={1}
            resolveDelay={300}
            inputProps={{
              placeholder: strings.RequestForm.ManagerSearchPlaceholder,
              'aria-label': strings.RequestForm.LabelManagerName
            }}
            pickerSuggestionsProps={{
              suggestionsHeaderText: formatString(strings.RequestForm.ManagerSuggestionsHeader, managerGroup),
              noResultsFoundText: formatString(strings.RequestForm.ManagerNoResults, managerGroup),
              loadingText: strings.RequestForm.ManagerSearching
            }}
          />
          {manager && (
            <div className={pickerCss.card}>
              <Persona text={manager.displayName} size={PersonaSize.size32} hidePersonaDetails />
              <div style={{ minWidth: 0 }}>
                {detailsLine(manager.jobTitle, manager.department) && (
                  <div className={pickerCss.cardLine}><Icon iconName="Contact" /> {detailsLine(manager.jobTitle, manager.department)}</div>
                )}
                <div className={pickerCss.cardLine}><Icon iconName="Mail" /> {manager.email}</div>
              </div>
            </div>
          )}
          {managersError && (
            <div className={pickerCss.cardWarn} role="alert" style={{ marginTop: 6 }}>
              <Icon iconName="Warning" /> {formatString(strings.RequestForm.ManagerGroupUnavailable, managerGroup)}
            </div>
          )}
          {managerNameTouched && !managerName.trim() && (
            <div className={pickerCss.error} role="alert">{strings.RequestForm.ManagerNameRequired}</div>
          )}
        </div>
        <TextField
          label={strings.RequestForm.LabelRequestedDate}
          type="date"
          value={requestDate}
          onChange={(_, val) => setRequestDate(val || '')}
          required
        />
        <Dropdown
          label={strings.RequestForm.LabelAssetType}
          selectedKey={selectedAssetType}
          options={assetTypeOptions}
          onChange={(_, opt) => {
            setSelectedAssetType(opt?.key as string);
          }}
          required
          errorMessage={blockingRequest ? formatString(strings.RequestForm.DuplicateBlocked, blockingRequest.assetTitle, blockingRequest.requestKey || `#${blockingRequest.id}`) : undefined}
        />
        {openRequests.length > 0 && !blockingRequest && (
          <MessageBar messageBarType={MessageBarType.warning} isMultiline>
            {formatString(strings.RequestForm.OpenRequestsNote, openRequests.map(describeOpen).join('; '))}
          </MessageBar>
        )}
        <Dropdown
          label={strings.RequestForm.LabelPriority}
          selectedKey={priority}
          options={ASSET_REQUEST_PRIORITY_OPTIONS}
          onChange={(_, opt) => setPriority(opt?.key as any)}
          required
        />
        <TextField
          label={strings.RequestForm.LabelQuantity}
          type="number"
          value={quantity.toString()}
          onChange={(_, val) => setQuantity(parseInt(val || '0'))}
          required
        />
        <TextField
          label={strings.RequestForm.LabelReason}
          multiline
          rows={3}
          value={reason}
          onChange={(_, val) => {
            setReason(val || '');
            setReasonTouched(true);
          }}
          onBlur={() => setReasonTouched(true)}
          required
          errorMessage={reasonTouched && !reason.trim() ? strings.RequestForm.ReasonRequired : undefined}
        />
        <Stack horizontal tokens={stackTokens} style={{ marginTop: 20 }}>
          <PrimaryButton text={strings.RequestForm.SubmitRequest} onClick={onSave} disabled={!isFormValid} />
          <DefaultButton text={strings.Common.Cancel} onClick={props.onClose} />
        </Stack>
      </Stack>
    </Panel>
  );
};
