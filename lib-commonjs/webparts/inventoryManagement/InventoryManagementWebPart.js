"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ReactDom = tslib_1.__importStar(require("react-dom"));
const sp_core_library_1 = require("@microsoft/sp-core-library");
const sp_property_pane_1 = require("@microsoft/sp-property-pane");
const sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const InventoryManagement_1 = tslib_1.__importDefault(require("./components/InventoryManagement"));
const pnpjsConfig_1 = require("./pnpjsConfig");
class InventoryManagementWebPart extends sp_webpart_base_1.BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        this._isDarkTheme = false;
        this._environmentMessage = '';
    }
    render() {
        const element = React.createElement(InventoryManagement_1.default, {
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
        (0, pnpjsConfig_1.getSP)(this.context);
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
        return sp_core_library_1.Version.parse('1.0');
    }
    getPropertyPaneConfiguration() {
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
                                (0, sp_property_pane_1.PropertyPaneTextField)('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
exports.default = InventoryManagementWebPart;
//# sourceMappingURL=InventoryManagementWebPart.js.map