import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';

console.log('=== Amplify Config Start ===');
console.log('Auth Config:', outputs.auth);
console.log('Data Config:', outputs.data);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      loginWith: {
        email: true,
      },
    },
  },
});

console.log('=== Amplify Configured ===');
