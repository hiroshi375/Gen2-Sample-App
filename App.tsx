import { Amplify } from 'aws-amplify';
import { View, Text, Button } from 'react-native';
import outputs from './amplify_outputs.json';
import TodoScreen from './src/features/todo/TodoScreen';

console.log('BEFORE CONFIGURE')

Amplify.configure(outputs);

console.log('AFTER CONFIGURE')
console.log('Amplify object:', Amplify)

export default function App() {
  return <TodoScreen />;
}
