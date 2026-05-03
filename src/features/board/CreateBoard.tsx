
import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
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
    } catch (e) {
      console.error(e);
      Alert.alert("エラー", "投稿に失敗しました。");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Create new Board:
      </Text>

      {/* message */}
      <Text>Message</Text>
      <TextInput
        value={fmsg}
        onChangeText={setFmsg}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* email */}
      <Text>Email</Text>
      <TextInput
        value={femail}
        onChangeText={setFemail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* image */}
      <Text>Image(URL)</Text>
      <TextInput
        value={fimg}
        onChangeText={setFimg}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      {/* button */}
      <Button title="Create" onPress={onCreate} />

      {/* 画面遷移（Create → List）ボタン */}
      <Button
          title="戻る"
          onPress={() => navigation.goBack()}
      />
    </View>
  );
}

export default CreateBoard;
