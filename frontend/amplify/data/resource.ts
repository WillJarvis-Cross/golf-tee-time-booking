// amplify/data/resource.ts
import { a, ClientSchema, defineData } from "@aws-amplify/backend";
import { createUserOnConfirm } from "../functions/post-confirmation/resource";

export const schema = a
  .schema({
    User: a
      .model({
        id: a.id().required(), // use Cognito sub
        displayName: a.string().required(),
        email: a.email(),
        avatarUrl: a.url(),
        handle: a.string(),
        owner: a.string(), // store sub for owner auth
        memberships: a.hasMany("Membership", "userId"),
        createdAt: a.datetime().required(),
        updatedAt: a.datetime().required(),
      })
      .authorization((allow) => [
        allow.ownerDefinedIn("owner").to(["read", "update"]),

        allow.authenticated().to(["read"]),
      ]),

    Organization: a
      .model({
        id: a.id().required(),
        displayName: a.string().required(),
        legalName: a.string(),
        slug: a.string().required(),
        domain: a.string(),
        billingCustomerId: a.string(),
        memberships: a.hasMany("Membership", "orgId"),
        createdAt: a.datetime().required(),
        updatedAt: a.datetime().required(),
      })
      .secondaryIndexes((index) => [index("slug").queryField("listOrgBySlug")])
      .authorization((allow) => [
        allow
          .groups(["platform-admin"])
          .to(["create", "read", "update", "delete"]),
        allow.authenticated().to(["read", "create"]), // 👈 allow create
      ]),

    Membership: a
      .model({
        id: a.id().required(),
        userId: a.id().required(),
        orgId: a.id().required(),
        roles: a.string().array().required(), // e.g., ["ADMIN","MEMBER"]
        user: a.belongsTo("User", "userId"),
        org: a.belongsTo("Organization", "orgId"),
        createdAt: a.datetime().required(),
        updatedAt: a.datetime().required(),
      })
      .secondaryIndexes((index) => [
        index("userId").queryField("listMembershipByUser"),
        index("orgId").queryField("listMembershipByOrg"),
      ])
      .authorization((allow) => [
        allow
          .groups(["platform-admin"])
          .to(["create", "read", "update", "delete"]),
        allow.ownerDefinedIn("userId").to(["create", "read"]), // 👈 user can link themselves
      ]),
  })
  .authorization((allow) => [
    // let the post-confirmation Lambda call the Data API
    // Narrow ops as needed: 'query' | 'mutate' | 'listen'
    allow.resource(createUserOnConfirm).to(["mutate"]),
  ]);
export const data = defineData({ schema: schema });
export type Schema = ClientSchema<typeof schema>;
