// src/amplify-client.ts
import { generateClient } from 'aws-amplify/data';

// generateClient は型引数を持たずにシンプルに呼び出す
export const client = generateClient();
