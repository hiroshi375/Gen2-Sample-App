import './amplifyConfig';

import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListBoard from './src/features/board/ListBoard';
import CreateBoard from './src/features/board/CreateBoard';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

function App({ user }: { user: any }) {
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
