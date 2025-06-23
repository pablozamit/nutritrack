import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
  Clock, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  MessageCircle,
  AlertTriangle
} from "lucide-react-native";
import { useSupplementStore } from "@/store/supplement-store";
import { useCommunityStore } from "@/store/community-store";
import { colors } from "@/constants/colors";
import { supplements } from "@/mocks/supplements";
import ScheduleItem from "@/components/ScheduleItem";
import Button from "@/components/Button";
import ReviewItem from "@/components/ReviewItem";
import AdherenceChart from "@/components/AdherenceChart";

export default function SupplementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userSupplements, removeUserSupplement, resetPills } = useSupplementStore();
  const { reviews, getReviewsBySupplementId } = useCommunityStore();
  
  const [userSupplement, setUserSupplement] = useState<any>(null);
  const [supplement, setSupplement] = useState<any>(null);
  const [supplementReviews, setSupplementReviews] = useState<any[]>([]);
  
  useEffect(() => {
    if (id) {
      // Encontrar suplemento del usuario
      const foundUserSupplement = userSupplements.find(s => s.id === id);
      setUserSupplement(foundUserSupplement);
      
      // Encontrar detalles del suplemento
      if (foundUserSupplement) {
        const foundSupplement = supplements.find(s => s.id === foundUserSupplement.supplementId);
        setSupplement(foundSupplement);
      }
      
      // Obtener reseñas
      if (foundUserSupplement) {
        const foundReviews = getReviewsBySupplementId(foundUserSupplement.supplementId);
        setSupplementReviews(foundReviews);
      }
    }
  }, [id, userSupplements, reviews]);
  
  const handleAddSchedule = () => {
    router.push(`/supplement/schedule?id=${id}`);
  };
  
  const handleEditSchedule = (scheduleId: string) => {
    router.push(`/supplement/schedule?id=${id}&scheduleId=${scheduleId}`);
  };
  
  const handleDeleteSchedule = (scheduleId: string) => {
    Alert.alert(
      "Eliminar Horario",
      "¿Estás seguro de que quieres eliminar este horario?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            // En una aplicación real, llamaríamos a una función para eliminar el horario
            Alert.alert("Horario eliminado");
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleRefill = () => {
    Alert.alert(
      "Rellenar Suplemento",
      "¿Cuántas dosis estás añadiendo?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Frasco Completo",
          onPress: () => {
            if (userSupplement) {
              resetPills(userSupplement.id, userSupplement.totalPills);
            }
          }
        }
      ]
    );
  };
  
  const handleReplenish = () => {
    if (supplement) {
      router.push(`/supplement/replenish?categoryId=${supplement.id}`);
    }
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Eliminar Suplemento",
      "¿Estás seguro de que quieres eliminar este suplemento de tu lista?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: () => {
            if (userSupplement) {
              removeUserSupplement(userSupplement.id);
              router.back();
            }
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleAddReview = () => {
    router.push(`/supplement/review?id=${supplement?.id}`);
  };
  
  if (!userSupplement || !supplement) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Suplemento no encontrado</Text>
        <Button 
          title="Volver" 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const percentRemaining = (userSupplement.pillsRemaining / userSupplement.totalPills) * 100;
  const isLowStock = percentRemaining <= 15;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Image source={{ uri: supplement.imageUrl }} style={styles.image} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{supplement.name}</Text>
        <Text style={styles.category}>{supplement.category}</Text>
        
        <View style={styles.ratingContainer}>
          <Star size={18} color={colors.accent} fill={colors.accent} />
          <Text style={styles.rating}>{supplement.rating.toFixed(1)}</Text>
          <Text style={styles.reviewCount}>({supplement.reviewCount} reseñas)</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{supplement.description}</Text>
      
      {isLowStock && (
        <View style={styles.warningCard}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            ¡Quedan pocas dosis! Solo {Math.round(percentRemaining)}% restante.
          </Text>
          <View style={styles.warningActions}>
            <TouchableOpacity onPress={handleRefill}>
              <Text style={styles.warningAction}>Rellenar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReplenish}>
              <Text style={styles.warningAction}>Reponer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <View style={styles.pillsContainer}>
        <Text style={styles.sectionTitle}>Inventario</Text>
        
        <View style={styles.pillsInfo}>
          <Text style={styles.pillsText}>
            {userSupplement.pillsRemaining} / {userSupplement.totalPills} dosis restantes
          </Text>
          <View style={styles.pillsProgressContainer}>
            <View 
              style={[
                styles.pillsProgress, 
                { 
                  width: `${percentRemaining}%`,
                  backgroundColor: isLowStock ? colors.warning : colors.primary
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.pillsActions}>
          <Button 
            title="Rellenar" 
            onPress={handleRefill} 
            size="small" 
            style={styles.pillsActionButton}
          />
          {isLowStock && (
            <Button 
              title="Reponer" 
              onPress={handleReplenish} 
              size="small" 
              variant="secondary"
              style={styles.pillsActionButton}
            />
          )}
        </View>
      </View>
      
      <View style={styles.adherenceContainer}>
        <Text style={styles.sectionTitle}>Adherencia</Text>
        <AdherenceChart rate={userSupplement.adherenceRate} />
      </View>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.sectionTitle}>Beneficios</Text>
        <View style={styles.benefitsList}>
          {supplement.benefits.map((benefit: string, index: number) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitDot} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.scheduleContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Horario</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddSchedule}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Añadir</Text>
          </TouchableOpacity>
        </View>
        
        {userSupplement.schedule.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aún no hay horarios añadidos</Text>
            <Button 
              title="Añadir Horario" 
              onPress={handleAddSchedule} 
              size="small" 
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          userSupplement.schedule.map((schedule: any) => (
            <ScheduleItem
              key={schedule.id}
              schedule={schedule}
              onEdit={() => handleEditSchedule(schedule.id)}
              onDelete={() => handleDeleteSchedule(schedule.id)}
              showActions
            />
          ))
        )}
      </View>
      
      <View style={styles.reviewsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reseñas</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAddReview}
          >
            <MessageCircle size={16} color={colors.primary} />
            <Text style={styles.addButtonText}>Añadir Reseña</Text>
          </TouchableOpacity>
        </View>
        
        {supplementReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aún no hay reseñas</Text>
            <Button 
              title="Añadir Reseña" 
              onPress={handleAddReview} 
              size="small" 
              style={styles.emptyStateButton}
            />
          </View>
        ) : (
          supplementReviews.slice(0, 3).map(review => (
            <ReviewItem key={review.id} review={review} />
          ))
        )}
        
        {supplementReviews.length > 3 && (
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Ver todas las {supplementReviews.length} reseñas</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <Button 
          title="Eliminar" 
          onPress={handleDelete} 
          variant="danger" 
          style={styles.deleteButton}
        />
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
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  header: {
    padding: 16,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    padding: 16,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  warningActions: {
    flexDirection: "row",
    gap: 12,
  },
  warningAction: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  pillsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  pillsInfo: {
    marginBottom: 12,
  },
  pillsText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  pillsProgressContainer: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  pillsProgress: {
    height: "100%",
    borderRadius: 4,
  },
  pillsActions: {
    flexDirection: "row",
    gap: 8,
  },
  pillsActionButton: {
    flex: 1,
  },
  adherenceContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
    alignItems: "center",
  },
  benefitsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  benefitsList: {
    marginTop: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 16,
    color: colors.text,
  },
  scheduleContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateButton: {
    minWidth: 120,
  },
  reviewsContainer: {
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  seeAllButton: {
    alignItems: "center",
    padding: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  actionButtons: {
    padding: 16,
  },
  deleteButton: {
    marginTop: 8,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  backButton: {
    width: 120,
    alignSelf: "center",
  },
});
