import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { usePointsStore } from "@/store/points-store";
import { User } from "@/types";
import UserRankItem from "@/components/UserRankItem";
import { colors } from "@/constants/colors";

export default function RankingScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const getRanking = usePointsStore((s) => s.getRanking);

  useEffect(() => {
    getRanking().then(setUsers);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ranking</Text>
      {users.map((u, idx) => (
        <View key={u.id} style={styles.item}>
          <UserRankItem user={{ ...u }} rank={idx + 1} />
          {idx === 0 && <Text style={styles.badge}>🏆</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  item: { position: "relative" },
  badge: {
    position: "absolute",
    right: 16,
    top: 18,
    fontSize: 20,
  },
});
