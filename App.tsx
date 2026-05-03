import './amplifyConfig';

import { withAuthenticator } from '@aws-amplify/ui-react-native';
import TodoScreen from './src/features/todo/TodoScreen';

function App({ user }: { user: any }) {
  return <TodoScreen user={user} />;
}

export default withAuthenticator(App, {
  loginMechanisms: ['email', 'phone_number'],
});
