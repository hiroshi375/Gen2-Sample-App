// amplify/data/schema.ts
import { a, type ClientSchema } from '@aws-amplify/backend';

export const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    isDone: a.boolean(),
  })
  .authorization((allow) => [
    allow.owner()
  ]),
  Person: a
    .model({
      name: a.string().required(),
      email: a.email().required(),
      userId: a.string(),
      age: a.integer(),
      tel: a.phone(),
      boards: a.hasMany('Board', 'personID'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Board: a
    .model({
      message: a.string().required(),
      name: a.string(),
      image: a.string(),
      personID: a.id().required(),
      person: a.belongsTo('Person', 'personID'),
    })
    .authorization((allow) => [allow.publicApiKey()]),

});

export type Schema = ClientSchema<typeof schema>;
