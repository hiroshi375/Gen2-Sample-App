import { defineData } from '@aws-amplify/backend';
import { schema } from './schema';

export type Schema = typeof schema;

export const data = defineData({
  schema,
});
