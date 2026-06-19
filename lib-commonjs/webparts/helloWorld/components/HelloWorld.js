"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var HelloWorld_module_scss_1 = tslib_1.__importDefault(require("./HelloWorld.module.scss"));
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var HelloWorld = /** @class */ (function (_super) {
    tslib_1.__extends(HelloWorld, _super);
    function HelloWorld() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HelloWorld.prototype.render = function () {
        var _a = this.props, description = _a.description, isDarkTheme = _a.isDarkTheme, environmentMessage = _a.environmentMessage, hasTeamsContext = _a.hasTeamsContext, userDisplayName = _a.userDisplayName;
        return (React.createElement("section", { className: "".concat(HelloWorld_module_scss_1.default.helloWorld, " ").concat(hasTeamsContext ? HelloWorld_module_scss_1.default.teams : '') },
            React.createElement("div", { className: HelloWorld_module_scss_1.default.welcome },
                React.createElement("img", { alt: "", src: isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png'), className: HelloWorld_module_scss_1.default.welcomeImage }),
                React.createElement("h2", null,
                    "Well done, ",
                    (0, sp_lodash_subset_1.escape)(userDisplayName),
                    "!"),
                React.createElement("div", null, environmentMessage),
                React.createElement("div", null,
                    "Web part property value: ",
                    React.createElement("strong", null, (0, sp_lodash_subset_1.escape)(description)))),
            React.createElement("div", null,
                React.createElement("h3", null, "Welcome to SharePoint Framework!"),
                React.createElement("p", null, "The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling."))));
    };
    return HelloWorld;
}(React.Component));
exports.default = HelloWorld;
//# sourceMappingURL=HelloWorld.js.map