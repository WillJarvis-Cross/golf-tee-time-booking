// amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";
import { createUserOnConfirm } from "../functions/post-confirmation/resource";

export const auth = defineAuth({
  loginWith: { email: true }, // or { email: true, phone: false } as you prefer
  triggers: { postConfirmation: createUserOnConfirm },
});
