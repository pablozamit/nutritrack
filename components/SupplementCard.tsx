import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { Supplement } from "@/types";
import { colors } from "@/constants/colors";

type SupplementCardProps = {
  supplement: Supplement;
  compact?: boolean;
};

export default function SupplementCard({ supplement, compact = false }: SupplementCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/supplement/${supplement.id}`);
  };
  
  const renderPriceLevel = () => {
    const dots = [];
    for (let i = 0; i < 5; i++) {
      dots.push(
        <View 
          key={i} 
          style={[
            styles.priceDot, 
            i < supplement.priceLevel ? styles.priceDotActive : null
          ]} 
        />
      );
    }
    return <View style={styles.priceContainer}>{dots}</View>;
  };
  
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={handlePress}>
        <Image source={{ uri: supplement.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactName}>{supplement.name}</Text>
          <View style={styles.compactRating}>
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{supplement.rating.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: supplement.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{supplement.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {supplement.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Star size={16} color={colors.accent} fill={colors.accent} />
            <Text style={styles.ratingText}>{supplement.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({supplement.reviewCount})</Text>
          </View>
          {renderPriceLevel()}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: "row",
  },
  priceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  priceDotActive: {
    backgroundColor: colors.primary,
  },
  compactContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  compactImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  compactName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  compactRating: {
    flexDirection: "row",
    alignItems: "center",
  },
});
