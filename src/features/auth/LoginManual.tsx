// src/features/auth/LoginManual.tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

interface LoginManualProps {
  onSignInSuccess?: () => void;
}

export default function LoginManual({ onSignInSuccess }: LoginManualProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [username, setUsername] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn({ username: username,
                                    password,
                                    options: {
                                        authFlowType: 'USER_PASSWORD_AUTH'
                                    }
     });
      console.log('Sign In Success:', result);
      onSignInSuccess?.();
    } catch (e: any) {
      console.log('Sign In Error:', e);
      Alert.alert('ログインエラー', e.message || '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },

        },
      });
      console.log('Sign Up Success:', result);
      setNeedsConfirmation(true);
    } catch (e: any) {
      console.log('Sign Up Error:', e);
      Alert.alert('サインアップエラー', e.message || '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmCode) {
      Alert.alert('確認コードを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const result = await confirmSignUp({
        username: username,
        confirmationCode: confirmCode,
      });
      console.log('Confirm Sign Up Success:', result);
      setNeedsConfirmation(false);
      // 確認後、サインインを試みる
      const signInResult = await signIn({ username: username, password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      });
      console.log('Auto Sign In Success:', signInResult);
      onSignInSuccess?.();
    } catch (e: any) {
      console.log('Confirm Error:', e);
      Alert.alert('確認エラー', e.message || '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>
          確認コードを入力してください
        </Text>
        <TextInput
          placeholder="確認コード"
          value={confirmCode}
          onChangeText={setConfirmCode}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginBottom: 10,
          }}
        />
        <Button
          title={isLoading ? '確認中...' : '確認'}
          onPress={handleConfirm}
          disabled={isLoading}
        />
        <Button
          title="戻る"
          onPress={() => {
            setNeedsConfirmation(false);
            setConfirmCode('');
            setIsSignUp(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}>
        {isSignUp ? 'サインアップ' : 'ログイン'}
      </Text>

      <TextInput
        placeholder="ユーザー名（UUID）"
        value={username}
        onChangeText={setUsername}
        style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TextInput
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Button
        title={isLoading ? (isSignUp ? 'サインアップ中...' : 'ログイン中...') : isSignUp ? 'サインアップ' : 'ログイン'}
        onPress={isSignUp ? handleSignUp : handleSignIn}
        disabled={isLoading}
      />

      <Button
        title={isSignUp ? 'ログイン画面へ' : 'サインアップ'}
        onPress={() => setIsSignUp(!isSignUp)}
      />
    </View>
  );
}
