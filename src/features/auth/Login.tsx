import { signIn } from 'aws-amplify/auth';

await signIn({
  username: 'test@example.com',
  password: 'password123',
});
