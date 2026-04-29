import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { Amplify } from 'aws-amplify'

//console.log('TodoScreen Amplify:', Amplify)

const client = generateClient<Schema>();

type Todo = Schema['Todo']['type'];

export default function TodoScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const load = async () => {
    try {
      const res = await client.models.Todo.list();
      console.log('TODO LIST RESPONSE:', res);
      setTodos(res.data);
    } catch (e) {
      console.log('LOAD ERROR:', e);
    }
  };

  // 👇ここに追加（これが正しい場所）
  const createTodo = async () => {
    try {
      await client.models.Todo.create({
        content: 'first todo',
        isDone: false,
      });

      load(); // 再取得
    } catch (e) {
      console.log('CREATE ERROR:', e);
    }
  };

  // 初回確認ログ（ここが重要）
  useEffect(() => {
    console.log('MODELS:', client.models);
    load();
  }, []);

  return (
    <View
      style={{
      flex: 1,
      justifyContent: 'center', // 縦方向中央
      alignItems: 'center',     // 横方向中央
    }}
    >
      {/* ここに追加 */}
      <Button title="Create Todo" onPress={createTodo} />

      <Button title="Reload" onPress={load} />
      {todos.length === 0 ? (
        <Text>No todos</Text>
      ) : (
        todos.map((t) => (
          <Text key={t.id}>
            {t.content ?? '(no content)'}
          </Text>
        ))
      )}
    </View>
  );
}
