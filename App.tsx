import './amplifyConfig';
import { useEffect, useState } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource';
import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListBoard from './src/features/board/ListBoard';
import CreateBoard from './src/features/board/CreateBoard';
import { PaperProvider } from 'react-native-paper';
import { Hub } from '@aws-amplify/core';
import type { HubPayload } from '@aws-amplify/core';
import CreateProfileScreen from './src/features/board/CreateProfileScreen';

type AmplifyAuthEvent =
  | { event: 'signedIn'; data: { username: string; userId: string } }
  | { event: 'signedOut' }
  | { event: 'signInWithRedirect_failure'; data: { error?: { name: string; message: string } } }
  | { event: 'signInWithRedirect' }
  | { event: 'tokenRefresh' }
  | { event: 'tokenRefresh_failure'; data: { error?: { name: string; message: string } } }
  | { event: 'customOAuthState'; data: string }

type AmplifyAuthHubPayload = HubPayload<AmplifyAuthEvent>;

type Props = {
  onComplete: () => void;
};

const Stack = createNativeStackNavigator();
const client = generateClient<Schema>();

function App({ user }: { user: any }) {
  //if (!user) return null;
  const [initialized, setInitialized] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // 👇 これ追加
  const handleProfileCreated = () => {
    setHasProfile(true);
  };

  useEffect(() => {
    //const listener = Hub.listen('auth', (data) => {
    //    console.log('Auth Event:', data);
    //});

    const createPersonIfNeeded = async () => {
      try {
      const user = await getCurrentUser();
      const userId = user.userId;
      console.log('ログイン済み ユーザー情報:', user);
      console.log('username:', user.username);
      console.log('userId:', user.userId);
      console.log('signInDetails:', user.signInDetails);

      const email = user.signInDetails?.loginId;

      if (!email) return;
      // 既存チェック
      const existing = await client.models.Person.list({
        filter: { userId: { eq: userId } },
      });
      console.log("Person list:", JSON.stringify(existing.data, null, 2)); // 👈 追加①
      if (existing.data.length > 0) {
        console.log("すでに存在");
        console.log("Person name:", JSON.stringify(existing.data[0].name, null, 2)); // 👈 追加②

        setHasProfile(existing.data.length > 0); // ← これが必要
        setInitialized(true); // ← これも重要

        return;
      }
      setHasProfile(existing.data.length > 0);
      setInitialized(true);

      //console.log('Person作成完了');
    } catch (e) {
      console.log('未ログイン or エラー', e);
    }
  };

    createPersonIfNeeded();

    //return () => {
    //  listener();
    //};
  }, []);

  if (!initialized) return null;

  // 👇 初回ユーザー
  if (!hasProfile) {
    return (
        <CreateProfileScreen
            onComplete={() => setHasProfile(true)}
        />
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ListBoard" component={ListBoard} />
          <Stack.Screen name="CreateBoard" component={CreateBoard} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default withAuthenticator(App, {
  loginMechanisms: ['email', 'phone_number'],
});
