import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import './amplifyConfig';

// ★ 重要：v6のimport
import { signIn } from 'aws-amplify/auth';
import { TextEncoder, TextDecoder } from 'fast-text-encoding';

(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// ↓ ここで確認
console.log('TextEncoder after set:', typeof globalThis.TextEncoder);
console.log('TextEncoder:', typeof TextEncoder);
console.log('TextDecoder:', typeof TextDecoder);

export default function App() {

  console.log('TextEncoder in component:', typeof globalThis.TextEncoder);

  useEffect(() => {
    const login = async () => {
      try {
        const res = await signIn({
//          username: 'a7048a78-3021-7073-930b-0dda792980c6', // ← 実際のユーザーに変更
          username: 'hi64sa10@yahoo.co.jp', // ← 実際のユーザーに変更
          password: '3Ti5hi64!',     // ← 実際のパスワードに変更
        });

        console.log('=== SUCCESS ===');
        console.log(res);

      } catch (e: any) {
        console.log('=== ERROR START ===');
        console.log('name:', e?.name);
        console.log('message:', e?.message);
        console.log('full error:', e);
        console.log('=== ERROR END ===');
      }
    };

    login();
  }, []);

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Login Test Running...</Text>
    </View>
  );
}
