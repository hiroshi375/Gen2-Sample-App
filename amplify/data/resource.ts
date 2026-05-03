import { defineData, type ClientSchema } from '@aws-amplify/backend';
import { schema } from './schema';

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
  },
});
