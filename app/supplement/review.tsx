import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Star } from "lucide-react-native";
import { useCommunityStore } from "@/store/community-store";
import { colors } from "@/constants/colors";
import { supplements } from "@/mocks/supplements";
import Button from "@/components/Button";

export default function ReviewScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addReview } = useCommunityStore();
  
  const [supplement, setSupplement] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  
  useEffect(() => {
    if (id) {
      const foundSupplement = supplements.find(s => s.id === id);
      setSupplement(foundSupplement);
    }
  }, [id]);
  
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  const validateInputs = () => {
    let isValid = true;
    
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona una valoración");
      isValid = false;
    }
    
    if (!comment.trim()) {
      setCommentError("Por favor escribe un comentario");
      isValid = false;
    } else if (comment.length < 10) {
      setCommentError("La reseña debe tener al menos 10 caracteres");
      isValid = false;
    } else {
      setCommentError("");
    }
    
    return isValid;
  };
  
  const handleSubmit = () => {
    if (!validateInputs()) return;
    
    addReview(id as string, rating, comment);
    
    Alert.alert(
      "Reseña Enviada",
      "¡Gracias por tu reseña!",
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingChange(i)}
        >
          <Star
            size={36}
            color={colors.accent}
            fill={i <= rating ? colors.accent : "none"}
            style={styles.star}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };
  
  if (!supplement) {
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Escribir una Reseña</Text>
      </View>
      
      <View style={styles.supplementInfo}>
        <Text style={styles.supplementName}>{supplement.name}</Text>
        <Text style={styles.supplementCategory}>{supplement.category}</Text>
      </View>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingTitle}>Tu Valoración</Text>
        {renderStars()}
        <Text style={styles.ratingText}>
          {rating === 0 ? "Toca para valorar" : `${rating} estrella${rating !== 1 ? "s" : ""}`}
        </Text>
      </View>
      
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>Tu Reseña</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Comparte tu experiencia con este suplemento..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={6}
          placeholderTextColor={colors.textSecondary}
        />
        {commentError ? (
          <Text style={styles.errorText}>{commentError}</Text>
        ) : (
          <Text style={styles.commentHint}>
            Tu reseña ayuda a otros a tomar mejores decisiones.
          </Text>
        )}
      </View>
      
      <View style={styles.actionButtons}>
        <Button 
          title="Cancelar" 
          onPress={() => router.back()} 
          variant="outline" 
          style={styles.cancelButton}
        />
        
        <Button 
          title="Enviar Reseña" 
          onPress={handleSubmit} 
          style={styles.submitButton}
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
  supplementInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  supplementName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  supplementCategory: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 8,
  },
  commentContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  commentInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    color: colors.text,
    textAlignVertical: "top",
    marginBottom: 8,
  },
  commentHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
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
