// amplify/data/schema.ts
import { a } from '@aws-amplify/backend';

export const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    isDone: a.boolean(),
  })
  .authorization((allow) => [
    allow.owner()
  ]),
});
