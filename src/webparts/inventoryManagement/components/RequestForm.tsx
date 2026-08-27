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
  MessageBarType
} from '@fluentui/react';
import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';
import { IEmployee } from '../models/IEmployee';
import { RoleUtils, UserRole } from '../utils/RoleUtils';
import { DEFAULT_ASSET_TYPE_OPTIONS, ASSET_REQUEST_PRIORITY_OPTIONS } from '../constants/DropdownConstants';

export interface IRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  availableAssets: IInventoryItem[];
  employees: IEmployee[];
  currentUserRole: UserRole;
  currentUserName: string;
  currentUserEmail?: string;
  onSubmitRequest: (request: Omit<IRequest, 'id' | 'requestKey' | 'status'>) => void;
}

const stackTokens: IStackTokens = { childrenGap: 15 };

export const RequestForm: React.FC<IRequestFormProps> = (props) => {
  const [selectedRequesterId, setSelectedRequesterId] = React.useState<string | undefined>(undefined);
  const [employeeId, setEmployeeId] = React.useState('');
  const [managerName, setManagerName] = React.useState('');
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

  const assetTypeOptions: IDropdownOption[] = dynamicAssetTypeOptions.length > 0
    ? dynamicAssetTypeOptions
    : DEFAULT_ASSET_TYPE_OPTIONS;

  const isFormValid = !!selectedRequesterId && !!employeeId.trim() && !!managerName.trim() && !!selectedAssetType && quantity > 0 && !!reason.trim();

  const onSave = () => {
    const employee = activeEmployee;

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
        assetId: matchingAsset ? matchingAsset.id : '1',
        assetTitle: selectedAssetType,
        priority: priority,
        quantity,
        reason,
        requestDate
      } as any);

      setSelectedRequesterId(undefined);
      setEmployeeId('');
      setManagerName('');
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
      headerText="Request an Asset"
      closeButtonAriaLabel="Close"
    >
      <Stack tokens={stackTokens}>
        <MessageBar messageBarType={MessageBarType.info}>
          You are requesting this asset for yourself. Requesting on behalf of other users is disabled.
        </MessageBar>
        <Dropdown
          label="Requester"
          selectedKey={selectedRequesterId}
          options={employeeOptions}
          required
          disabled
        />
        <TextField
          label="Employee ID"
          value={employeeId}
          onChange={(_, val) => setEmployeeId(val || '')}
          required
          disabled={activeEmployee.id !== 'current-user'}
        />
        <TextField
          label="Manager's Name"
          value={managerName}
          onChange={(_, val) => {
            setManagerName(val || '');
            setManagerNameTouched(true);
          }}
          onBlur={() => setManagerNameTouched(true)}
          placeholder="Enter manager's name"
          required
          errorMessage={managerNameTouched && !managerName.trim() ? "Manager's name is required" : undefined}
        />
        <TextField
          label="Requested Date"
          type="date"
          value={requestDate}
          onChange={(_, val) => setRequestDate(val || '')}
          required
        />
        <Dropdown
          label="Asset Type"
          selectedKey={selectedAssetType}
          options={assetTypeOptions}
          onChange={(_, opt) => {
            setSelectedAssetType(opt?.key as string);
          }}
          required
        />
        <Dropdown
          label="Priority"
          selectedKey={priority}
          options={ASSET_REQUEST_PRIORITY_OPTIONS}
          onChange={(_, opt) => setPriority(opt?.key as any)}
          required
        />
        <TextField
          label="Quantity"
          type="number"
          value={quantity.toString()}
          onChange={(_, val) => setQuantity(parseInt(val || '0'))}
          required
        />
        <TextField
          label="Reason for Request"
          multiline
          rows={3}
          value={reason}
          onChange={(_, val) => {
            setReason(val || '');
            setReasonTouched(true);
          }}
          onBlur={() => setReasonTouched(true)}
          required
          errorMessage={reasonTouched && !reason.trim() ? "Reason for request is required" : undefined}
        />
        <Stack horizontal tokens={stackTokens} style={{ marginTop: 20 }}>
          <PrimaryButton text="Submit Request" onClick={onSave} disabled={!isFormValid} />
          <DefaultButton text="Cancel" onClick={props.onClose} />
        </Stack>
      </Stack>
    </Panel>
  );
};
