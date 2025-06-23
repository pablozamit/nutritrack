import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { collection, orderBy, query, limit as limitDocs, onSnapshot } from "firebase/firestore";
import { usePointsStore } from "@/store/points-store";
import { useAuthStore } from "@/store/auth-store";
import { db } from "@/lib/firestore";
import { User } from "@/types";
import UserRankItem from "@/components/UserRankItem";
import { colors } from "@/constants/colors";

export default function RankingScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentRank, setCurrentRank] = useState<number | null>(null);
  const getUserRank = usePointsStore((s) => s.getUserRank);
  const points = usePointsStore((s) => s.points);
  const { user } = useAuthStore();

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("points", "desc"),
      limitDocs(10)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ ...(d.data() as User), id: d.id }));
      setUsers(data);
    });
    getUserRank().then(setCurrentRank);
    return unsub;
  }, [points]);

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <View style={styles.item}>
      <UserRankItem
        user={{ ...item }}
        rank={index + 1}
        isCurrentUser={user?.id === item.id}
      />
      {index === 0 && <Text style={styles.badge}>🏆</Text>}
    </View>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(u) => u.id}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.title}>Ranking</Text>}
      ListFooterComponent={
        currentRank && user && !users.some((u) => u.id === user.id) ? (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Tu Posición</Text>
            <UserRankItem user={user} rank={currentRank} isCurrentUser />
          </View>
        ) : null
      }
      contentContainerStyle={styles.content}
      style={styles.container}
    />
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
  footer: { marginTop: 24 },
  footerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  badge: {
    position: "absolute",
    right: 16,
    top: 18,
    fontSize: 20,
  },
});
