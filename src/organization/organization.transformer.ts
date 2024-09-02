import { Branding, OrganizationApiRequest, OrganizationRequest } from "./organization.dto";

export class OrganizationTransformer {
  private readonly connection: any = [
    {
      connection_id: 'con_41JuBNf01LoFW24o',
      assign_membership_on_login: false,
      show_as_button: true,
      is_signup_enabled: false,
    },
  ];

  public apiToInteranl(org: OrganizationApiRequest): OrganizationRequest {
    let branding = new Branding();
    branding.logoUrl = org.logo;
    let orgReq = new OrganizationRequest();
    orgReq.name = org.name;
    orgReq.branding = branding;
    orgReq.displayName = org.displayName;
    orgReq.enabledConnections = this.connection;

    return orgReq;
  }
}
