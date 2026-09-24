import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  Stack,
  Text,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  Panel,
  PanelType,
} from '@fluentui/react';

import styles from './IncidentRequestModule.module.scss';
import { IInventoryManagementProps } from '../../models/IInventoryManagementProps';
import { IncidentService } from '../../services/IncidentService';
import { IInventoryItem } from '../../models/IInventoryItem';
import { INCIDENT_TYPE_OPTIONS, INCIDENT_PRIORITY_OPTIONS, INCIDENT_RAISED_TO_OPTIONS } from '../../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';

interface IIncidentRequestModuleProps extends IInventoryManagementProps {
  employeeId?: string;
  department?: string;
  setIsLoading: (loading: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
  preselectedAsset?: IInventoryItem;
  onSuccessPopup?: (details: { incidentType: string; assetName: string; requesterName: string; priority: string; incidentId?: string }) => void;
  preselectedIncidentType?: string;
}

interface IIncidentForm {
  employeeName: string;
  employeeId: string;
  employeeEmail?: string;
  serialNo: string;
  assetName: string;
  incidentType: string;
  priority: string;
  description: string;
  raisedDate: string;
  status: string;
  raisedTo: string;
  assignedDate: string;
}

const incidentTypeOptions = INCIDENT_TYPE_OPTIONS;
const priorityOptions = INCIDENT_PRIORITY_OPTIONS;

const raisedToOptions: IDropdownOption[] = INCIDENT_RAISED_TO_OPTIONS;

export const IncidentRequestModule: React.FC<IIncidentRequestModuleProps> = (props) => {
  const [formData, setFormData] = useState<IIncidentForm>({
    employeeName: props.userDisplayName || '',
    employeeId: props.employeeId || '',
    employeeEmail: props.userEmail || '',
    serialNo: '',
    assetName: '',
    incidentType: '',
    priority: 'Medium',
    description: '',
    raisedDate: new Date().toLocaleString(),
    status: 'Open',
    raisedTo: 'Admin',
    assignedDate: '',
  });

  const [assignedAssets, setAssignedAssets] = useState<any[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [message, setMessage] = useState<{ type: MessageBarType; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssignedAssetsForName(formData.employeeName);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.employeeName]);

  const prevIsOpenRef = useRef(props.isOpen);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employeeName: props.userDisplayName || '',
      employeeId: props.employeeId || '',
      employeeEmail: props.userEmail || '',
    }));
  }, [props.userDisplayName, props.employeeId, props.userEmail]);

  useEffect(() => {
    if (props.isOpen && !prevIsOpenRef.current) {
      // Panel just opened! Reset fields.
      setFormData((prev) => ({
        ...prev,
        assetName: props.preselectedAsset ? (props.preselectedAsset.assetName || props.preselectedAsset.title) : '',
        serialNo: props.preselectedAsset ? props.preselectedAsset.serialNumber : '',
        incidentType: props.preselectedIncidentType ? props.preselectedIncidentType : '',
        description: '',
      }));
    } else if (props.preselectedAsset || props.preselectedIncidentType) {
      // Sync preselected asset or incident type if props update while open
      setFormData((prev) => ({
        ...prev,
        assetName: props.preselectedAsset ? (props.preselectedAsset.assetName || props.preselectedAsset.title) : prev.assetName,
        serialNo: props.preselectedAsset ? props.preselectedAsset.serialNumber : prev.serialNo,
        incidentType: props.preselectedIncidentType ? props.preselectedIncidentType : prev.incidentType,
      }));
    }
    prevIsOpenRef.current = props.isOpen;
  }, [props.isOpen, props.preselectedAsset, props.preselectedIncidentType]);

  const loadAssignedAssetsForName = async (name: string) => {
    if (!name.trim()) {
      setAssignedAssets([]);
      setIsLoadingAssets(false);
      return;
    }
    try {
      setIsLoadingAssets(true);
      const service = new IncidentService(props.spContext);
      const details = await service.getEmployeeDetailsByName(name);
      
      setFormData(prev => ({
        ...prev,
        employeeId: details.employeeId || prev.employeeId,
        employeeEmail: details.email || prev.employeeEmail
      }));

      const assets = await service.getEmployeeAssignedAssets(details.email || details.employeeName);
      setAssignedAssets(assets);
    } catch (error) {
      console.error('Error loading assigned assets:', error);
      setAssignedAssets([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.incidentType || !formData.description) {
        setMessage({ type: MessageBarType.error, text: strings.IncidentRequestModule.ValidationRequiredFields });
        return;
      }

      setIsSubmitting(true);
      const service = new IncidentService(props.spContext);
      
      const payload = {
        ...formData,
        employeeEmail: formData.employeeEmail || props.userEmail,
        employeeName: formData.employeeName,
        employeeId: formData.employeeId,
      };
      
      console.log('Submitting incident payload:', payload);
      const result = await service.createIncidentRequest(payload);

      let incidentId = '';
      if (result && result.data) {
        if (result.data.incidentId) {
          incidentId = result.data.incidentId;
        } else {
          const itemId = result.data.Id || result.data.ID;
          if (itemId) {
            const isReplacement = formData.incidentType === 'Replacement Request';
            incidentId = isReplacement ? `REP-${itemId}` : `INC-${itemId}`;
          }
        }
      }

      props.onClose();
      setFormData({
        employeeName: props.userDisplayName || '',
        employeeId: props.employeeId || '',
        employeeEmail: props.userEmail || '',
        serialNo: '',
        assetName: '',
        incidentType: '',
        priority: 'Medium',
        description: '',
        raisedDate: new Date().toLocaleString(),
        status: 'Open',
        raisedTo: 'Admin',
        assignedDate: '',
      });
      setMessage(null);

      if (props.onSuccessPopup) {
        props.onSuccessPopup({
          incidentType: formData.incidentType,
          assetName: formData.assetName || 'General Device',
          requesterName: formData.employeeName,
          priority: formData.priority,
          incidentId: incidentId
        });
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      const errorMessage = error instanceof Error ? error.message : strings.IncidentRequestModule.GenericSubmitError;
      setMessage({ type: MessageBarType.error, text: `${strings.IncidentRequestModule.ErrorPrefix} ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      employeeName: props.userDisplayName || '',
      employeeId: props.employeeId || '',
      employeeEmail: props.userEmail || '',
      serialNo: '',
      assetName: '',
      incidentType: '',
      priority: 'Medium',
      description: '',
      raisedDate: new Date().toLocaleString(),
      status: 'Open',
      raisedTo: 'Admin',
      assignedDate: '',
    });
    setMessage(null);
    props.onClose();
  };

  const assetOptions: IDropdownOption[] = assignedAssets.map(a => ({
    key: a.id,
    text: `${a.assetName} (S/N: ${a.serialNumber || 'N/A'})`,
  }));

  const selectedAssetKey = assignedAssets.find(a => a.serialNumber === formData.serialNo && a.assetName === formData.assetName)?.id;

  const isReplacementMode = props.preselectedIncidentType === 'Replacement Request';

  return (
    <Panel
      isOpen={props.isOpen}
      onDismiss={props.onClose}
      type={PanelType.custom}
      customWidth="100%"
      styles={{ main: { maxWidth: '450px' } }}
      headerText={isReplacementMode ? strings.IncidentRequestModule.HeaderReplacement : strings.IncidentRequestModule.HeaderIncident}
      closeButtonAriaLabel="Close"
    >
      <div className={styles.incidentRequestModule}>
        <Stack tokens={{ childrenGap: 15 }}>
          {message && (
            <MessageBar messageBarType={message.type} isMultiline>
              {message.text}
            </MessageBar>
          )}

          {!isLoadingAssets && assignedAssets.length === 0 && (
            <MessageBar messageBarType={MessageBarType.info}>
              {isReplacementMode
                ? strings.IncidentRequestModule.NoAssetsReplacementInfo
                : strings.IncidentRequestModule.NoAssetsIncidentInfo}
            </MessageBar>
          )}

          <TextField
            label={strings.IncidentRequestModule.LabelEmployeeName}
            value={formData.employeeName}
            onChange={(ev, val) => handleInputChange('employeeName', val || '')}
            required
          />

          {!props.preselectedAsset && (
            <Dropdown
              label={strings.IncidentRequestModule.LabelSelectAsset}
              placeholder={isLoadingAssets ? strings.IncidentRequestModule.PlaceholderLoadingAssets : strings.IncidentRequestModule.PlaceholderChooseAsset}
              options={assetOptions}
              selectedKey={selectedAssetKey}
              onChange={(ev, option) => {
                const selected = assignedAssets.find(a => a.id === option?.key);
                if (selected) {
                  handleInputChange('assetName', selected.assetName);
                  handleInputChange('serialNo', selected.serialNumber);
                  handleInputChange('assignedDate', selected.assignmentDate);
                } else {
                  handleInputChange('assetName', '');
                  handleInputChange('serialNo', '');
                  handleInputChange('assignedDate', '');
                }
              }}
              disabled={isLoadingAssets}
            />
          )}

          {formData.assetName && (
            <TextField
              label={strings.IncidentRequestModule.LabelAssetName}
              value={formData.assetName}
              disabled
            />
          )}

          {formData.serialNo && (
            <TextField
              label={strings.IncidentRequestModule.LabelSerialNo}
              value={formData.serialNo}
              disabled
            />
          )}

          {!isReplacementMode && (
            <Dropdown
              label={strings.IncidentRequestModule.LabelIssueType}
              options={incidentTypeOptions}
              selectedKey={formData.incidentType}
              onChange={(ev, option) => handleInputChange('incidentType', option?.key)}
              required
              placeholder={strings.IncidentRequestModule.PlaceholderIssueType}
            />
          )}

          <Dropdown
            label={strings.IncidentRequestModule.LabelPriority}
            options={priorityOptions}
            selectedKey={formData.priority}
            onChange={(ev, option) => handleInputChange('priority', option?.key)}
          />

          <TextField
            label={isReplacementMode ? strings.IncidentRequestModule.LabelReasonForReplacement : strings.IncidentRequestModule.LabelDescription}
            multiline
            rows={5}
            placeholder={isReplacementMode ? strings.IncidentRequestModule.PlaceholderReasonForReplacement : strings.IncidentRequestModule.PlaceholderDescribeIssue}
            value={formData.description}
            onChange={(ev, newValue) => handleInputChange('description', newValue)}
            required
          />

          <Dropdown
            label={strings.IncidentRequestModule.LabelRaisedTo}
            options={raisedToOptions}
            selectedKey={formData.raisedTo}
            onChange={(ev, option) => handleInputChange('raisedTo', option?.key)}
            placeholder={strings.IncidentRequestModule.PlaceholderSelectTeam}
          />

          <TextField
            label={strings.IncidentRequestModule.LabelRaisedDate}
            value={formData.raisedDate}
            readOnly
          />

          <TextField
            label={strings.IncidentRequestModule.LabelStatus}
            value={formData.status}
            readOnly
          />

          <Stack horizontal tokens={{ childrenGap: 10 }} style={{ marginTop: 20 }}>
            <PrimaryButton
              text={isReplacementMode ? strings.IncidentRequestModule.RequestReplacement : strings.IncidentRequestModule.ReportIncident}
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
            <DefaultButton
              text={strings.IncidentRequestModule.Cancel}
              onClick={handleCancel}
            />
          </Stack>
        </Stack>
      </div>
    </Panel>
  );
};
