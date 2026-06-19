"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const ReactDom = tslib_1.__importStar(require("react-dom"));
const sp_core_library_1 = require("@microsoft/sp-core-library");
const sp_property_pane_1 = require("@microsoft/sp-property-pane");
const sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
const strings = tslib_1.__importStar(require("EmployeeManagementWebPartStrings"));
const EmployeeManagementPanel_1 = require("./components/EmployeeManagementPanel");
class EmployeeManagementWebPart extends sp_webpart_base_1.BaseClientSideWebPart {
    onInit() {
        return Promise.resolve();
    }
    render() {
        const element = React.createElement(EmployeeManagementPanel_1.EmployeeManagementPanel, {
            userEmail: this.context.pageContext.user.email,
            userName: this.context.pageContext.user.displayName,
            webUrl: this.context.pageContext.web.absoluteUrl,
            spContext: this.context
        });
        ReactDom.render(element, this.domElement);
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return sp_core_library_1.Version.parse('1.0.0');
    }
    getPropertyPaneConfiguration() {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription,
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)('description', {
                                    label: 'Web Part Description',
                                    placeholder: 'Employee Management',
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    }
}
exports.default = EmployeeManagementWebPart;
//# sourceMappingURL=EmployeeManagementWebPart.js.map