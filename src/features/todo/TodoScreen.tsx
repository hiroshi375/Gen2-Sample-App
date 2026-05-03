import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { generateClient } from 'aws-amplify/data';
import { signOut } from 'aws-amplify/auth';

// クライアントは最初に使うときに遅延初期化
let clientInstance: any = null;
const getClient = () => {
  if (!clientInstance) {
    clientInstance = generateClient();
  }
  return clientInstance;
};

// 手動で型定義（今はこれが一番安定）
type Todo = {
  id: string;
  content: string | null;
  isDone: boolean | null;
  createdAt: string;
  updatedAt: string;
};

interface TodoScreenProps {
  user: any;
}

export default function TodoScreen({ user }: TodoScreenProps) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const load = async () => {
    try {
      const client = getClient();
      const res = await (client.models.Todo as any).list();
      console.log('TODO LIST RESPONSE:', res);
      setTodos(res.data);
    } catch (e) {
      console.log('LOAD ERROR:', e);
    }
  };

  // 👇ここに追加（これが正しい場所）
  const createTodo = async () => {
    try {
      const client = getClient();
      await (client.models.Todo as any).create({
        content: 'first todo',
        isDone: false,
      });

      load(); // 再取得
    } catch (e) {
      console.log('CREATE ERROR:', e);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log('Sign Out Error:', e);
    }
  };

  // 初回確認ログ（ここが重要）
  useEffect(() => {
    const client = getClient();
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
      <View>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>

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
