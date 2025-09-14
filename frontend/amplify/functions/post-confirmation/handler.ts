// amplify/functions/post-confirmation/handler.ts
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { generateClient, type Client } from "aws-amplify/data";
import type { Schema } from "../../data/resource";

// ⚠️ Make sure this name matches your function folder/file name
import { env } from "$amplify/env/createUserOnConfirm";

let client: Client<Schema> | null = null;

async function getClient(): Promise<Client<Schema>> {
  if (!client) {
    const { resourceConfig, libraryOptions } =
      await getAmplifyDataClientConfig(env);
    Amplify.configure(resourceConfig, libraryOptions);
    client = generateClient<Schema>();
  }
  return client;
}

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const sub = event.request.userAttributes.sub!;
  const email = event.request.userAttributes.email ?? "";

  const c = await getClient();

  // id = Cognito sub
  await c.models.User.create({
    id: sub,
    displayName: email || "New User",
    email,
    owner: sub,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return event;
};
