import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Star } from "lucide-react-native";
import { Review } from "@/types";
import { colors } from "@/constants/colors";

type ReviewItemProps = {
  review: Review;
};

export default function ReviewItem({ review }: ReviewItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={colors.accent}
          fill={i <= review.rating ? colors.accent : "none"}
        />
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{review.username}</Text>
        <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
      </View>
      
      {renderStars()}
      
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
