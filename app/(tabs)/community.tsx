import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { Award, MessageCircle, TrendingUp } from "lucide-react-native";
import { useCommunityStore } from "@/store/community-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import UserRankItem from "@/components/UserRankItem";
import ReviewItem from "@/components/ReviewItem";

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { reviews, getTopUsers } = useCommunityStore();
  
  const topUsers = getTopUsers(5);
  const recentReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);
  
  const getCurrentUserRank = () => {
    if (!user) return null;
    
    const allUsers = getTopUsers();
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return null;
    return userIndex + 1;
  };
  
  const currentUserRank = getCurrentUserRank();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunidad</Text>
      </View>
      
      {user && (
        <View style={styles.userStatsCard}>
          <View style={styles.userStatsHeader}>
            <Image 
              source={{ uri: `https://ui-avatars.com/api/?name=${user.username}&background=random&size=100` }} 
              style={styles.userAvatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.userJoined}>
                Se unió el {new Date(user.joinedAt).toLocaleDateString("es-ES")}
              </Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.points}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.streak}</Text>
              <Text style={styles.statLabel}>Racha</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentUserRank ? `#${currentUserRank}` : "-"}
              </Text>
              <Text style={styles.statLabel}>Rango</Text>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Award size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Clasificación</Text>
        </View>
        
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.leaderboardContainer}>
        {topUsers.map((topUser, index) => (
          <UserRankItem 
            key={topUser.id} 
            user={topUser} 
            rank={index + 1} 
            isCurrentUser={user?.id === topUser.id}
          />
        ))}
      </View>
      
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MessageCircle size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Reseñas Recientes</Text>
        </View>
        
        <TouchableOpacity>
          <Text style={styles.seeAllText}>Ver Todo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.reviewsContainer}>
        {recentReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aún no hay reseñas</Text>
          </View>
        ) : (
          recentReviews.map(review => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
      </View>
      
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Suplementos Populares</Text>
        </View>
      </View>
      
      <View style={styles.trendingContainer}>
        <View style={styles.trendingItem}>
          <Text style={styles.trendingRank}>#1</Text>
          <Text style={styles.trendingName}>Vitamina D3</Text>
          <Text style={styles.trendingUsers}>128 usuarios</Text>
        </View>
        
        <View style={styles.trendingItem}>
          <Text style={styles.trendingRank}>#2</Text>
          <Text style={styles.trendingName}>Magnesio Glicinato</Text>
          <Text style={styles.trendingUsers}>96 usuarios</Text>
        </View>
        
        <View style={styles.trendingItem}>
          <Text style={styles.trendingRank}>#3</Text>
          <Text style={styles.trendingName}>Ashwagandha</Text>
          <Text style={styles.trendingUsers}>87 usuarios</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  userStatsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userStatsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  userJoined: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  leaderboardContainer: {
    marginBottom: 24,
  },
  reviewsContainer: {
    marginBottom: 24,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  trendingContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  trendingRank: {
    width: 30,
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  trendingName: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  trendingUsers: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
