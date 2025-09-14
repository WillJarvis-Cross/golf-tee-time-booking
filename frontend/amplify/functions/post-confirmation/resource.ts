import { defineFunction } from "@aws-amplify/backend";

export const createUserOnConfirm = defineFunction({
  name: "createUserOnConfirm", // 👈 make sure this matches your env import
  entry: "./handler.ts",
});
