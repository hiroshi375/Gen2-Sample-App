// 👇 最優先で読み込む（ここが一番重要）
import './amplifyConfig';

import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getCurrentUser } from 'aws-amplify/auth';
import TodoScreen from './src/features/todo/TodoScreen';
import LoginManual from './src/features/auth/LoginManual';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      console.log('Current User:', currentUser);
      setUser(currentUser);
    } catch (e) {
      console.log('No user logged in:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
  };

  if (isLoading) {
    return <View style={{ flex: 1 }} />;
  }

  return <View style={{ flex: 1 }}>
    {user ? (
      <TodoScreen onSignOut={handleSignOut} />
    ) : (
      <LoginManual onSignInSuccess={checkUser} />
    )}
  </View>;
}
