import { getSP, getContext } from "../pnpjsConfig";
import { Utilities } from "@pnp/sp/sputilities";
import "@pnp/sp/profiles";
import { EMPLOYEES } from "../data/mockData";

export interface IApprovalRequestParams {
  requestKey: string;
  employeeName: string;
  assetName: string;
  requestDate: string;
  adminName: string;
}

export interface IApprovalConfirmationParams {
  requestKey: string;
  employeeName: string;
  assetName: string;
  approvedBy: string;
  approvalDate: string;
}

export interface IAssignmentNotificationParams {
  employeeName: string;
  employeeEmail: string;
  assetName: string;
  assetId: string;
  assignedBy: string;
  assignedDate: string;
}

export class EmailService {
  // Set to true to route all emails to test accounts; set to false to use live SharePoint/AD emails.
  private static readonly USE_MOCK_TEST_EMAILS = true;

  private static readonly MOCK_ADMIN_EMAILS = [
    "akhilareddydodla542@gmail.com",
    "chadivelokiranreddy@gmail.com"
  ];

  private static readonly MOCK_MANAGER_EMAIL = "akhilareddydodla@gmail.com";

  /**
   * Helper to get target emails for Admins
   */
  private static async getAdminEmails(liveEmails: string[]): Promise<string[]> {
    return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS : liveEmails;
  }

  /**
   * Helper to get target email for Manager
   */
  private static async getManagerEmail(liveEmail: string): Promise<string> {
    return this.USE_MOCK_TEST_EMAILS ? this.MOCK_MANAGER_EMAIL : liveEmail;
  }

  /**
   * Helper to get target email for Employee
   */
  private static async getEmployeeEmail(liveEmail: string): Promise<string> {
    return this.USE_MOCK_TEST_EMAILS ? this.MOCK_ADMIN_EMAILS[0] : (liveEmail || this.MOCK_ADMIN_EMAILS[0]);
  }

  /**
   * Send Approval Request Email to Manager (Diego / sanikommurohitha123@gmail.com)
   */
  public static async sendApprovalRequestToManager(params: IApprovalRequestParams, liveManagerEmail?: string): Promise<void> {
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
  public static async sendApprovalConfirmationToAdmin(params: IApprovalConfirmationParams, liveAdminEmails?: string[]): Promise<void> {
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
   * Send Asset Assignment Notification Email to Employee (Adele / Alex)
   */
  public static async sendAssignmentNotificationToEmployee(params: IAssignmentNotificationParams, liveEmployeeEmail?: string): Promise<void> {
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
  public static async resolveLiveManagerEmail(employeeName: string): Promise<string | null> {
    try {
      const sp = getSP();
      
      // 1. Try to query the EmployeeList first
      try {
        const employeeList = sp.web.lists.getByTitle("EmployeeList");
        const fields = await employeeList.fields.select("InternalName", "Title")();
        
        const getFieldName = (candidates: string[]) => {
          const found = fields.find(f => candidates.some(c => f.Title.toLowerCase() === c.toLowerCase() || f.InternalName.toLowerCase() === c.toLowerCase()));
          return found ? found.InternalName : null;
        };

        const nameField = getFieldName(['Employee Name', 'EmployeeName', 'Name', 'Title']);
        const managerField = getFieldName(['Manager', 'ManagerEmail', 'ReportsTo', 'ManagerName', 'Manager_x0020_Email']);

        if (nameField && managerField) {
          const items = await employeeList.items.select(nameField, managerField)();
          const employee = items.find((item: any) => {
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
      } catch (listErr) {
        console.warn("Could not query EmployeeList for manager:", listErr);
      }

      // 2. Try User Profile Service using ensureUser first
      try {
        const matchingEmp = EMPLOYEES.find(e => e.name.toLowerCase() === employeeName.toLowerCase());
        const userIdentifier = matchingEmp ? matchingEmp.email : employeeName;
        const user: any = await sp.web.ensureUser(userIdentifier);
        const loginName = user.data ? user.data.LoginName : user.LoginName;
        
        const profile = await sp.profiles.getPropertiesFor(loginName);
        const managerProp = profile.UserProfileProperties.find((p: any) => p.Key === "Manager");
        if (managerProp && managerProp.Value) {
          const managerProfile = await sp.profiles.getPropertiesFor(managerProp.Value);
          const emailProp = managerProfile.UserProfileProperties.find((p: any) => p.Key === "WorkEmail");
          if (emailProp && emailProp.Value) {
            return emailProp.Value;
          }
        }
      } catch (profileErr) {
        console.warn("Could not query User Profile Service for manager:", profileErr);
      }
    } catch (e) {
      console.warn("Error resolving live manager email:", e);
    }
    return null;
  }

  /**
   * Internal sender method using SharePoint sp.utility.sendEmail or developer console fallback.
   */
  public static async sendMail(to: string[], subject: string, htmlBody: string): Promise<void> {
    const validEmails = to.filter(email => email && email.indexOf("@") > 0);
    if (validEmails.length === 0) {
      console.warn(`[EmailService] No valid recipient emails found:`, to);
      return;
    }

    // Try sending email via Microsoft Graph API first (allows sending to external addresses like nexergroup.com)
    try {
      const context = getContext();
      if (context && context.msGraphClientFactory) {
        const client = await context.msGraphClientFactory.getClient("3");
        await client.api("/me/sendMail").post({
          message: {
            subject: subject,
            body: {
              contentType: "HTML",
              content: htmlBody
            },
            toRecipients: validEmails.map(email => ({
              emailAddress: {
                address: email
              }
            }))
          }
        });
        console.log(`[EmailService] Outgoing mail successfully sent via Microsoft Graph to: ${validEmails.join(", ")}`);
        return; // Success! Skip SharePoint Utility fallback
      }
    } catch (graphError) {
      console.warn("[EmailService] Failed to send email via Microsoft Graph. Falling back to SharePoint Utility...", graphError);
    }

    try {
      const sp = getSP();
      const utility = Utilities(sp.web);
      await utility.sendEmail({
        To: validEmails,
        Subject: subject,
        Body: htmlBody,
        AdditionalHeaders: {
          "content-type": "text/html"
        }
      });
      console.log(`[EmailService] Outgoing mail successfully sent via SharePoint Utility to: ${validEmails.join(", ")}`);
    } catch (error) {
      console.warn("[EmailService] Failed to send email via SharePoint Utility. Using console logs fallback:", error);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spfx_email_send_failed', {
          detail: { 
            to: validEmails, 
            subject, 
            errorMessage: error instanceof Error ? error.message : JSON.stringify(error) 
          }
        }));
      }
    } finally {
      // Always write a beautiful colored log in the developer console to allow testing without live exchange configs.
      console.log(
        `%c📬 [EMAIL NOTIFICATION OUTBOX]\nTo: ${validEmails.join(", ")}\nSubject: ${subject}\n\n[HTML RENDERED EMAIL BODY]:\n${htmlBody.trim()}`,
        "background: #1e3a8a; color: #ffffff; border-left: 5px solid #3b82f6; padding: 12px; font-family: monospace; font-size: 12px; line-height: 1.5; border-radius: 4px;"
      );

      // Dispatch event to allow the UI to render the email banner popup directly
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('spfx_mock_email_sent', {
          detail: { to: validEmails, subject, body: htmlBody }
        }));
      }
    }
  }
}
