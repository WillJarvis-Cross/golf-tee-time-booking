// amplify/backend.ts
import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { createUserOnConfirm } from "./functions/post-confirmation/resource";

export default defineBackend({
  auth,
  data,
  createUserOnConfirm,
});
