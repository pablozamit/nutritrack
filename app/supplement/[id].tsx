import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useSupplementStore } from '@/store/supplement-store';
import { useReviewsStore } from '@/store/reviews-store';
import { useAuthStore } from '@/store/auth-store';
import ReviewItem from '@/components/ReviewItem';
import { Star } from 'lucide-react-native';

export default function SupplementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userSupplements, deleteSupplement } = useSupplementStore();
  const { reviews, subscribeToReviews } = useReviewsStore();
  const { user } = useAuthStore();
  const [supplement, setSupplement] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const unsub = subscribeToReviews(id as string);
    const found = userSupplements.find((s) => s.id === id);
    setSupplement(found);
    return unsub;
  }, [id, userSupplements]);

  const supplementReviews = reviews[id as string] || [];
  const averageRating =
    supplementReviews.reduce((acc, r) => acc + r.rating, 0) /
    (supplementReviews.length || 1);
  const userReview = supplementReviews.find((r) => r.uid === user?.id);

  if (!supplement) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Suplemento no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  const handleDelete = async () => {
    await deleteSupplement(supplement.id);
    router.back();
  };

  const renderStars = (value: number) => {
    const items = [];
    for (let i = 1; i <= 5; i++) {
      items.push(
        <Star
          key={i}
          size={24}
          color={colors.accent}
          fill={i <= value ? colors.accent : "none"}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={styles.stars}>{items}</View>;
  };

  const handleReview = () => {
    router.push(`/supplement/review?id=${id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{supplement.name}</Text>
      <Text style={styles.info}>Hora: {supplement.time}</Text>
      <Text style={styles.info}>Días: {supplement.days.join(', ')}</Text>
      <Text style={styles.info}>Cantidad: {supplement.quantity}</Text>
      <Button title="Eliminar" onPress={handleDelete} style={styles.delete} />

      <Button
        title={userReview ? 'Editar Reseña' : 'Añadir Reseña'}
        onPress={handleReview}
        style={styles.reviewBtn}
      />

      {supplementReviews.length > 0 && (
        <View style={styles.ratingContainer}>
          {renderStars(Math.round(averageRating))}
          <Text style={styles.ratingText}>
            {averageRating.toFixed(1)} / 5 ({supplementReviews.length})
          </Text>
        </View>
      )}

      {supplementReviews.map((r) => (
        <ReviewItem key={r.id} review={r} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:16},
  title:{fontSize:24,fontWeight:'bold',color:colors.text,marginBottom:8},
  info:{fontSize:16,color:colors.text,marginBottom:4},
  notFound:{fontSize:18,color:colors.text,marginBottom:16},
  delete:{marginTop:16,marginBottom:16},
  reviewBtn:{marginBottom:16},
  ratingContainer:{flexDirection:'row',alignItems:'center',marginBottom:8},
  stars:{flexDirection:'row',marginRight:4},
  ratingText:{fontSize:16,color:colors.text},
});
