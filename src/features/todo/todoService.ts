import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource'

const client = generateClient<Schema>();

type Todo = Schema['Todo']['type']

/** 取得 */
export async function listTodos() {
  const todos = await client.models.Todo.list();
  return todos.data;
}
/** 作成 */
export async function createTodo() {
  return client.models.Todo.create({
    content: "first todo",
    isDone: false,
  });
}
