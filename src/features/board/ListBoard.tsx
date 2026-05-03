import { useEffect, useState,useCallback } from 'react';
import { View , FlatList, Image } from 'react-native';
import { TextInput, Button, Card, Text, FAB } from 'react-native-paper';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { BoardComponent } from '../../../ui-components';

const client = generateClient<Schema>();

type RootStackParamList = {
  ListBoard: undefined;
  CreateBoard: undefined;
};

function ListBoard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ListBoard'>>();
  const [items, setItems] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");

  // -----------------------------
  // 検索入力
  // -----------------------------
  const doChange = (e: any) => {
    setInput(e.target.value);
  };

  const doFilter = () => {
    setFind(input);
  };

  // -----------------------------
  // データ取得
  // -----------------------------
  const load = async () => {
    let result;

    if (find) {
      const filter = {
        or: [
          { name: { contains: find } },
          { message: { contains: find } },
        ],
      } as any;

      result = await client.models.Board.list({ filter });
      console.log("取得結果:", result);
      console.log("Boardデータ本体:", result.data);
    } else {
      result = await client.models.Board.list();
      console.log("取得結果:", result);
      console.log("Boardデータ本体:", result.data);
    }

    setItems(result.data);
  };

  useEffect(() => {
    const init = async () => {
        // -----------------------------
        // ① 初回ロード
        // -----------------------------
        const result = await client.models.Board.list();

        // -----------------------------
        // ② データが0件なら作成
        // -----------------------------
        if (result.data.length === 0) {
            console.log("初期データ作成");

            // Person を作成
            const person = await client.models.Person.create({
                name: "テストユーザー",
                email: "test@example.com",
            } as any);

            if (person.data) {
                await client.models.Board.create({
                    name: "テストユーザー",
                    message: "最初の投稿",
                    personID: person.data.id,
                } as any);
            }
        }
    };

    init();

    // -----------------------------
    // リアルタイム監視（observeの代替）
    // -----------------------------
    const sub = client.models.Board.observeQuery().subscribe({
      next: ({ items }) => {
        setItems(items);
      },
    });

    return () => sub.unsubscribe();
  }, [find]);

  useFocusEffect(
    useCallback(() => {
        console.log("ListBoardフォーカスされた → 再取得");

        load();

        return () => {};
    }, [find])
  );

  return (
    <View style={{ flex: 1, padding: 8 }}>
      {/* 検索 */}
      <TextInput
        value={input}
        onChangeText={setInput}
        style={{
          fontSize: 16,
          borderWidth: 1,
          margin: 4,
          padding: 1,
        }}
      />
      <Button mode="contained" onPress={() => setFind(input)}>
        フィルター
      </Button>

      {/* リスト */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (

            <Card style={{ marginBottom: 10 }}>
                <Card.Content>
                    <Text
                        style={{
                                fontSize: 14,
                                color: '#888',
                                lineHeight: 22,
                                marginTop: 4,
                            }}
                    >{item.name}</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#000',
                            lineHeight: 22,
                            marginTop: 4,
                        }}
                    >{item.message}</Text>
                    {item.image && (
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 100, height: 100 }}
                        />
                    )}
                </Card.Content>
            </Card>
        )}
      />
      {/* 画面遷移（List → Create）ボタン */}
      {/* FAB（右下ボタン） */}
      <FAB
        icon="plus"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={() => navigation.navigate('CreateBoard')}
      />
    </View>
  );
}

export default ListBoard;
