import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, PropertyPaneLabel } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'InventoryManagementWebPartStrings';
import InventoryManagement from './components/InventoryManagement';
import { getSP } from './pnpjsConfig';
import { buildAppConfig, setAppConfig, DEFAULT_APP_CONFIG, parseNonNegativeNumber } from './config/AppConfig';
import { formatString } from './utils/LocalizationUtils';
export default class InventoryManagementWebPart extends BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        this._isDarkTheme = false;
        this._environmentMessage = '';
    }
    render() {
        // Property-pane settings -> runtime config read by services (blank fields keep the defaults).
        setAppConfig(buildAppConfig(this.properties));
        const element = React.createElement(InventoryManagement, {
            description: this.properties.description,
            isDarkTheme: this._isDarkTheme,
            environmentMessage: this._environmentMessage,
            hasTeamsContext: !!this.context.sdks.microsoftTeams,
            userDisplayName: this.context.pageContext.user.displayName,
            userEmail: this.context.pageContext.user.email,
            spContext: this.context
        });
        ReactDom.render(element, this.domElement);
    }
    onInit() {
        getSP(this.context);
        setAppConfig(buildAppConfig(this.properties));
        return this._getEnvironmentMessage().then(message => {
            this._environmentMessage = message;
        });
    }
    _getEnvironmentMessage() {
        if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
            return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
                .then(context => {
                let environmentMessage = '';
                switch (context.app.host.name) {
                    case 'Office': // running in Office
                        environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                        break;
                    case 'Outlook': // running in Outlook
                        environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                        break;
                    case 'Teams': // running in Teams
                    case 'TeamsModern':
                        environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                        break;
                    default:
                        environmentMessage = strings.UnknownEnvironment;
                }
                return environmentMessage;
            });
        }
        return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    }
    onThemeChanged(currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        const { semanticColors } = currentTheme;
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return Version.parse('1.0');
    }
    getPropertyPaneConfiguration() {
        const p = strings.PropertyPaneConfig;
        const d = DEFAULT_APP_CONFIG;
        const textField = (key, label, defaultValue) => PropertyPaneTextField(key, { label, placeholder: formatString(p.DefaultPlaceholder, defaultValue) });
        const numberField = (key, label, defaultValue) => PropertyPaneTextField(key, {
            label,
            placeholder: formatString(p.DefaultPlaceholder, defaultValue),
            onGetErrorMessage: (value) => parseNonNegativeNumber(value, -1) < 0 && (value || '').trim() !== '' ? p.NumberError : ''
        });
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        },
                        {
                            groupName: p.GroupRoles,
                            groupFields: [
                                PropertyPaneLabel('rolesNote', { text: p.RolesNote }),
                                textField('adminGroupName', p.AdminGroupLabel, d.roleGroups.admin),
                                textField('managerGroupName', p.ManagerGroupLabel, d.roleGroups.manager),
                                textField('employeeGroupName', p.EmployeeGroupLabel, d.roleGroups.employee)
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: p.ListsPageDescription
                    },
                    groups: [
                        {
                            groupName: p.GroupLists,
                            groupFields: [
                                PropertyPaneLabel('listsNote', { text: p.ReloadNote }),
                                textField('inventoryListTitle', p.InventoryListLabel, d.lists.inventory),
                                textField('requestListTitle', p.RequestListLabel, d.lists.request),
                                textField('returnRequestListTitle', p.ReturnRequestListLabel, d.lists.returnRequest),
                                textField('mappingListTitle', p.MappingListLabel, d.lists.mapping),
                                textField('eventLogListTitle', p.EventLogListLabel, d.lists.eventLog),
                                textField('incidentListTitle', p.IncidentListLabel, d.lists.incident),
                                textField('employeeListTitle', p.EmployeeListLabel, d.lists.employee),
                                textField('replacementListTitle', p.ReplacementListLabel, d.lists.replacement),
                                textField('stockThresholdsListTitle', p.StockThresholdsListLabel, d.lists.stockThresholds),
                                textField('assetKitsListTitle', p.AssetKitsListLabel, d.lists.assetKits)
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: p.AlertsPageDescription
                    },
                    groups: [
                        {
                            groupName: p.GroupSla,
                            groupFields: [
                                numberField('approvalSlaHours', p.ApprovalSlaLabel, d.sla.approvalHours),
                                numberField('assignmentSlaHours', p.AssignmentSlaLabel, d.sla.assignmentHours)
                            ]
                        },
                        {
                            groupName: p.GroupStock,
                            groupFields: [
                                numberField('defaultMinimumStock', p.DefaultMinimumLabel, d.stock.defaultMinimum)
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
//# sourceMappingURL=InventoryManagementWebPart.js.map