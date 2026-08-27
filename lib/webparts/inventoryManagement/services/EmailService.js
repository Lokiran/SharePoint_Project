import { getSP, getContext } from "../pnpjsConfig";
import { EMPLOYEES } from "../data/mockData";
/**
 * EmailService
 * -------------------------------------------------------------------------
 * Graph /sendMail is now the PRIMARY path. sp.utility.sendEmail is kept only
 * as a last-resort fallback because Microsoft's own PnPjs docs mark it
 * deprecated, and in practice it can resolve "successfully" even when the
 * message never reaches Exchange (silent failure - no thrown error, so old
 * code never triggered its own fallback).
 */
export class EmailService {
    constructor(context) {
        this.context = context;
    }
    async sendEmail(props) {
        // ---- PRIMARY: direct Microsoft Graph call --------------------------
        try {
            const client = await this.context.msGraphClientFactory.getClient("3");
            const message = {
                subject: props.subject,
                body: {
                    contentType: "HTML",
                    content: props.htmlBody
                },
                toRecipients: props.to.map((addr) => ({
                    emailAddress: { address: addr.trim() }
                })),
                ccRecipients: (props.cc ?? []).map((addr) => ({
                    emailAddress: { address: addr.trim() }
                }))
            };
            // client.api(...).post() resolves with no content on success (202-equivalent).
            // If it throws, we land in catch below and know for certain it failed -
            // no more silent false positives.
            await client.api("/me/sendMail").post({
                message,
                saveToSentItems: props.saveToSentItems ?? true
            });
            return { success: true, method: "graph" };
        }
        catch (graphError) {
            // eslint-disable-next-line no-console
            console.error("[EmailService] Graph sendMail failed:", graphError);
            const statusCode = graphError?.statusCode ?? graphError?.code;
            // Common, actionable cases - surface these distinctly instead of a
            // generic "something went wrong" so you can fix the real cause fast.
            if (statusCode === 403) {
                return {
                    success: false,
                    method: "graph",
                    statusCode,
                    error: "Graph Mail.Send permission is not approved for this app. " +
                        "Check SharePoint Admin Center > Advanced > API access."
                };
            }
            if (statusCode === 401) {
                return {
                    success: false,
                    method: "graph",
                    statusCode,
                    error: "User token invalid/expired for Graph. Try re-authenticating."
                };
            }
            // ---- FALLBACK: SharePoint's SendEmail utility (deprecated) -------
            // Only reached if Graph itself throws (auth/consent/network issue).
            try {
                const { spfi, SPFx } = await import(/* webpackChunkName: 'pnp-sp' */ "@pnp/sp");
                await import(/* webpackChunkName: 'pnp-sp-webs' */ "@pnp/sp/webs");
                await import(/* webpackChunkName: 'pnp-sp-sputilities' */ "@pnp/sp/sputilities");
                const sp = spfi().using(SPFx(this.context));
                await sp.utility.sendEmail({
                    To: props.to,
                    CC: props.cc ?? [],
                    Subject: props.subject,
                    Body: props.htmlBody,
                    AdditionalHeaders: { "content-type": "text/html" }
                });
                // NOTE: this resolving does NOT guarantee delivery - PnPjs docs
                // mark this method deprecated precisely because of that. Treat
                // this branch as "queued, unconfirmed" rather than "sent".
                return {
                    success: true,
                    method: "spUtility",
                    error: "Sent via deprecated SharePoint utility - delivery not guaranteed. Verify with message trace."
                };
            }
            catch (spError) {
                return {
                    success: false,
                    method: "spUtility",
                    error: `Both Graph and SharePoint utility failed. Graph: ${graphError?.message || graphError}. SP: ${spError?.message || spError}`
                };
            }
        }
    }
    /**
     * Helper to get target emails for Admins
     */
    static async getAdminEmails(liveEmails) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS : liveEmails;
    }
    /**
     * Helper to get target email for Manager
     */
    static async getManagerEmail(liveEmail) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_MANAGER_EMAIL : liveEmail;
    }
    /**
     * Helper to get target email for Employee
     */
    static async getEmployeeEmail(liveEmail) {
        return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS[0] : (liveEmail || this.MOCK_ADMIN_EMAILS[0]);
    }
    /**
     * Send Approval Request Email to Manager (Diego / sanikommurohitha123@gmail.com)
     */
    static async sendApprovalRequestToManager(params, liveManagerEmail) {
        const toEmail = await this.getManagerEmail(liveManagerEmail || "");
        const subject = "Approval Required - Asset Request";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Approval Required</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Asset Requisition Pending Your Action</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">A new asset request has been created and requires your review and approval:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Requested Asset</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Request ID</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: 700; font-size: 14px;">${params.requestKey}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Request Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.requestDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Requested By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.adminName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #d97706; font-weight: 700; font-size: 14px;">Pending Approval</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #4b5563; text-align: center; margin-top: 30px;">
              Please open the Asset Management Portal to Approve or Reject this request.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated request from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail([toEmail], subject, body);
    }
    /**
     * Send Approval Confirmation Email to Admins (Kiran / Akhila)
     */
    static async sendApprovalConfirmationToAdmin(params, liveAdminEmails) {
        const toEmails = await this.getAdminEmails(liveAdminEmails || []);
        const subject = "Asset Request Approved";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Request Approved</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Requisition Ready for Asset Assignment</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Hello Admin,</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">The following asset request has been approved by the manager. Please proceed to allocate the asset to the employee in the Admin panel:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Request ID</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #2563eb; font-weight: 700; font-size: 14px;">${params.requestKey}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Approved By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.approvedBy}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Approval Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.approvalDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #059669; font-weight: 700; font-size: 14px;">Approved</td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated confirmation from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail(toEmails, subject, body);
    }
    /**
     * Send Rejection Notification Email to Employee
     */
    static async sendRejectionNotificationToEmployee(params) {
        const toEmail = await this.getEmployeeEmail(params.employeeEmail || "");
        const subject = `Asset Request Rejected - ${params.requestKey}`;
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Request Rejected</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Asset Requisition Declined by Manager</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Dear ${params.employeeName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Unfortunately, your request for the following asset has been rejected by the manager:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Request ID</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #dc2626; font-weight: 700; font-size: 14px;">${params.requestKey}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Rejected By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.managerName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Rejection Comments</td>
                <td style="padding: 12px 15px; color: #b91c1c; font-style: italic; font-size: 14px;">${params.rejectionReason || "No comments provided."}</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 30px;">
              If you have any questions or require clarification, please reach out to your manager directly.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated notification from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail([toEmail], subject, body);
    }
    /**
     * Send Asset Assignment Notification Email to Employee (Adele / Alex)
     */
    static async sendAssignmentNotificationToEmployee(params, liveEmployeeEmail) {
        const toEmail = await this.getEmployeeEmail(liveEmployeeEmail || "");
        const subject = "Your Asset Has Been Assigned";
        const body = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 20px; color: #1f2937; min-height: 100%;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #e5e7eb;">
          <div style="background: linear-gradient(135deg, #0284c7, #0369a1); padding: 30px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Asset Assigned</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">IT Device Handover Notification</p>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; margin-top: 0; color: #374151;">Dear ${params.employeeName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Your requested asset has been assigned to you. Here are the assignment details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden;">
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase; width: 40%;">Employee Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.employeeName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset Name</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600; font-size: 14px;">${params.assetName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Asset ID / Serial</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assetId || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Assigned By</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assignedBy}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Assignment Date</td>
                <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${params.assignedDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px 15px; font-weight: 600; color: #4b5563; font-size: 12px; text-transform: uppercase;">Status</td>
                <td style="padding: 12px 15px; color: #0284c7; font-weight: 700; font-size: 14px;">Assigned</td>
              </tr>
            </table>

            <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 30px;">
              Please contact the IT Helpdesk if you have any questions regarding your device or if you require deployment assistance.
            </p>
          </div>
          <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; background-color: #fafafa;">
            This is an automated handover receipt from the Asset Management Portal.
          </div>
        </div>
      </div>
    `;
        await this.sendMail([toEmail], subject, body);
    }
    /**
     * Try to resolve the manager's email dynamically from SharePoint User Profiles or EmployeeList
     */
    static async resolveLiveManagerEmail(employeeName) {
        try {
            const sp = getSP();
            // 1. Try to resolve user email directly by name from mock data or SharePoint
            const matchingEmp = EMPLOYEES.find(e => e.name.toLowerCase() === employeeName.toLowerCase() ||
                e.email.toLowerCase() === employeeName.toLowerCase());
            if (matchingEmp) {
                return matchingEmp.email;
            }
            try {
                const user = await sp.web.ensureUser(employeeName);
                if (user) {
                    const email = user.Email || user.data?.Email || user.UserPrincipalName || user.data?.UserPrincipalName;
                    if (email && email.indexOf('@') > 0) {
                        return email;
                    }
                }
            }
            catch (err) {
                console.warn("Could not directly resolve user email by name:", err);
            }
            // 2. Try to query the EmployeeList first
            try {
                const employeeList = sp.web.lists.getByTitle("EmployeeList");
                const fields = await employeeList.fields.select("InternalName", "Title")();
                const getFieldName = (candidates) => {
                    const found = fields.find(f => candidates.some(c => f.Title.toLowerCase() === c.toLowerCase() || f.InternalName.toLowerCase() === c.toLowerCase()));
                    return found ? found.InternalName : null;
                };
                const nameField = getFieldName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
                const managerField = getFieldName(['Manager', 'ManagerEmail', 'ReportsTo', 'ManagerName', 'Manager_x0020_Email']);
                if (nameField && managerField) {
                    const items = await employeeList.items.select(nameField, managerField)();
                    const employee = items.find((item) => {
                        const nameVal = item[nameField];
                        return nameVal && nameVal.toString().toLowerCase().trim() === employeeName.toLowerCase().trim();
                    });
                    if (employee) {
                        const managerVal = employee[managerField];
                        if (managerVal) {
                            if (typeof managerVal === 'string' && managerVal.indexOf("@") > 0) {
                                return managerVal;
                            }
                            // If it's a Person field
                            if (managerVal.Email) {
                                return managerVal.Email;
                            }
                            if (managerVal.Title && managerVal.Title.indexOf("@") > 0) {
                                return managerVal.Title;
                            }
                        }
                    }
                }
            }
            catch (listErr) {
                console.warn("Could not query EmployeeList for manager:", listErr);
            }
            // 2. Try User Profile Service using ensureUser first
            try {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                require("@pnp/sp/profiles");
                const matchingEmp = EMPLOYEES.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
                const userIdentifier = matchingEmp ? matchingEmp.email : employeeName;
                const user = await sp.web.ensureUser(userIdentifier);
                const loginName = user.data ? user.data.LoginName : user.LoginName;
                const profile = await sp.profiles.getPropertiesFor(loginName);
                const managerProp = profile.UserProfileProperties.find((p) => p.Key === "Manager");
                if (managerProp && managerProp.Value) {
                    const managerProfile = await sp.profiles.getPropertiesFor(managerProp.Value);
                    const emailProp = managerProfile.UserProfileProperties.find((p) => p.Key === "WorkEmail");
                    if (emailProp && emailProp.Value) {
                        return emailProp.Value;
                    }
                }
            }
            catch (profileErr) {
                console.warn("Could not query User Profile Service for manager:", profileErr);
            }
        }
        catch (e) {
            console.warn("Error resolving live manager email:", e);
        }
        return undefined;
    }
    /**
     * Internal sender method using SharePoint sp.utility.sendEmail or developer console fallback.
     */
    static async sendMail(to, subject, htmlBody) {
        const validEmails = to.filter(email => email && email.indexOf("@") > 0);
        if (validEmails.length === 0) {
            console.warn(`[EmailService] No valid recipient emails found:`, to);
            return;
        }
        try {
            const context = getContext();
            if (!context) {
                throw new Error("SPFx Context not initialized in EmailService");
            }
            const service = new EmailService(context);
            const result = await service.sendEmail({
                to: validEmails,
                subject,
                htmlBody
            });
            if (!result.success) {
                throw new Error(result.error);
            }
        }
        catch (error) {
            // Dispatch error event with true error details
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('spfx_email_send_failed', {
                    detail: {
                        to: validEmails,
                        subject,
                        errorMessage: error?.message || error
                    }
                }));
            }
            throw error;
        }
        finally {
            // Always write a beautiful colored log in the developer console to allow testing without live exchange configs.
            console.log(`%c📬 [EMAIL NOTIFICATION OUTBOX]\nTo: ${validEmails.join(", ")}\nSubject: ${subject}\n\n[HTML RENDERED EMAIL BODY]:\n${htmlBody.trim()}`, "background: #1e3a8a; color: #ffffff; border-left: 5px solid #3b82f6; padding: 12px; font-family: monospace; font-size: 12px; line-height: 1.5; border-radius: 4px;");
            // Dispatch event to allow the UI to render the email banner popup directly
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('spfx_mock_email_sent', {
                    detail: { to: validEmails, subject, body: htmlBody }
                }));
            }
        }
    }
}
// Set to true to route all emails to test accounts; set to false to use live SharePoint/AD emails.
EmailService.USE_MOCK_TEST_EMAILS = true;
EmailService.MOCK_ADMIN_EMAILS = [
    "Akhila.Dodla@3bh3kf.onmicrosoft.com"
];
EmailService.MOCK_MANAGER_EMAIL = "DiegoS@3bh3kf.onmicrosoft.com";
//# sourceMappingURL=EmailService.js.map