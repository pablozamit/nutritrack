import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFeedStore } from "@/store/feed-store";
import { colors } from "@/constants/colors";

export default function CommunityFeed() {
  const { feed, subscribe } = useFeedStore();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, []);

  const renderItem = ({ item }: any) => {
    let text = "";
    if (item.type === "review") {
      const { supplementName, rating } = item.data || {};
      text = `⭐ Alguien dejó una review ${rating}\u2605 sobre ${supplementName}`;
    } else if (item.type === "ranking") {
      text = `🎯 Una persona logró ${item.data?.racha} días seguidos tomando todos sus suplementos`;
    } else if (item.type === "added") {
      text = `🧪 ${item.data?.supplementName} fue añadida por varios usuarios`;
    }
    return (
      <View style={styles.item}>
        <Text style={styles.text}>{text}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={feed}
      keyExtractor={(i) => i.id}
      renderItem={renderItem}
      style={styles.container}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  item: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  text: { color: colors.text },
});
