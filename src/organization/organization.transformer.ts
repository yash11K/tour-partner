import moment from "moment";
import { Branding, OrganizationApiRequest, OrganizationRequest } from "./organization.dto";
import { log } from "console";
import { plainToInstance } from "class-transformer";
import { Logger } from "@nestjs/common";

export class OrganizationTransformer {
  private readonly connection: any = [
    {
      connection_id: 'con_41JuBNf01LoFW24o',
      assign_membership_on_login: false,
      show_as_button: true,
      is_signup_enabled: false,
    },
  ];

  public apiToInternal(org: OrganizationApiRequest, method: 'post' | 'patch'): OrganizationRequest {
    const defaultMetaData: Record<string, string> = {
      isBlocked: 'false',
      createdAt: new Date().toDateString(),
    };

    org = plainToInstance(OrganizationApiRequest, org);

    let orgReq = new OrganizationRequest();
    orgReq.name = org.name;
    orgReq.displayName = org.displayName;

    if (org.logo) {
      let branding = new Branding();
      branding.logoUrl = org.logo;
      orgReq.branding = branding;
    }

    if (method === 'post') {
      orgReq.enabledConnections = this.connection;
      if (org.metadata) {
        orgReq.metadata = { ...defaultMetaData, ...org.metadata };
      } else {
        orgReq.metadata = defaultMetaData;
      }

    } else if (method === 'patch') {
      if (org.metadata) {
        orgReq.metadata = org.metadata;
      }
    }

  return orgReq;
  }
}
