
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

type RootStackParamList = {
  ListBoard: undefined;
  CreateBoard: undefined;
};

function CreateBoard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'CreateBoard'>>();
  const [fmsg, setFmsg] = useState("");
  const [femail, setFemail] = useState("");
  const [fimg, setFimg] = useState("");

  // -----------------------------
  // 作成処理
  // -----------------------------
  const onCreate = async () => {
    try {
      // -----------------------------
      // ① Person取得（email一致）
      // -----------------------------
      const result = await client.models.Person.list({
        filter: {
          email: { eq: femail },
        },
      });
      console.log("取得結果:", result);
      console.log("Personデータ本体:", result.data);

      if (result.data.length !== 1) {
        Alert.alert("エラー", "アカウントが見つかりませんでした。");
        return;
      }

      const user = result.data[0];

      // -----------------------------
      // ② Board作成
      // -----------------------------
      await client.models.Board.create({
        message: fmsg,
        name: user.name,
        image: fimg === "" ? null : fimg,
        personID: user.id,
      });

      Alert.alert("成功", "メッセージを投稿しました。");

      // 入力リセット
      setFmsg("");
      setFemail("");
      setFimg("");

      navigation.goBack();

    } catch (e) {
      console.error(e);
      Alert.alert("エラー", "投稿に失敗しました。");
    }
  };

  return (
    <View style={{ flex: 1,padding: 16 }}>
      <Card>
        <Card.Content>
            <Text variant="titleLarge">Create Board</Text>
            <TextInput
                label="Message"
                value={fmsg}
                onChangeText={setFmsg}
                mode="outlined"
                style={{ marginTop: 10 }}
            />
            <TextInput
                label="Email"
                value={femail}
                onChangeText={setFemail}
                mode="outlined"
                style={{ marginTop: 10 }}
            />
            <TextInput
                label="Image URL"
                value={fimg}
                onChangeText={setFimg}
                mode="outlined"
                style={{ marginTop: 10 }}
            />

            <Button
                mode="contained"
                onPress={onCreate}
                style={{ marginTop: 20 }}
            >
            Create
            </Button>

            {/* 画面遷移（Create → List）ボタン */}
            <Button
                mode="contained"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 10 }}>
            戻る
            </Button>
        </Card.Content>
      </Card>

    </View>
  );
}

export default CreateBoard;
