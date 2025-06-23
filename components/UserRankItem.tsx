import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Award, Flame } from "lucide-react-native";
import { User } from "@/types";
import { colors } from "@/constants/colors";

type UserRankItemProps = {
  user: User;
  rank: number;
  isCurrentUser?: boolean;
};

export default function UserRankItem({
  user,
  rank,
  isCurrentUser = false,
}: UserRankItemProps) {
  const getAvatarUrl = () => {
    // Generar un avatar consistente basado en el nombre de usuario
    return `https://ui-avatars.com/api/?name=${user.username}&background=random&size=100`;
  };
  
  const getRankColor = () => {
    if (rank === 1) return "#FFD700"; // Oro
    if (rank === 2) return "#C0C0C0"; // Plata
    if (rank === 3) return "#CD7F32"; // Bronce
    return colors.textSecondary;
  };
  
  return (
    <View style={[styles.container, isCurrentUser && styles.currentUserContainer]}>
      <View style={styles.rankContainer}>
        {rank <= 3 ? (
          <Award size={24} color={getRankColor()} fill={getRankColor()} />
        ) : (
          <Text style={styles.rankText}>{rank}</Text>
        )}
      </View>
      
      <Image source={{ uri: getAvatarUrl() }} style={styles.avatar} />
      
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.points}>{user.points} puntos</Text>
      </View>
      
      <View style={styles.streakContainer}>
        <Flame size={16} color={colors.accent} />
        <Text style={styles.streakText}>{user.streak} días</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentUserContainer: {
    backgroundColor: "#F0F8FF", // Fondo azul claro
    borderWidth: 1,
    borderColor: colors.primary,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  points: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 4,
  },
});
