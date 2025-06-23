import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  TextInput
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Search, Filter, ArrowDown, ArrowUp, Star, Users, Clock } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { supplements } from "@/mocks/supplements";
import { useSupplementStore } from "@/store/supplement-store";
import Button from "@/components/Button";

type SortOption = "rating" | "popularity" | "recent" | "price";

export default function ReplenishScreen() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();
  const { addUserSupplement } = useSupplementStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filteredSupplements, setFilteredSupplements] = useState<any[]>([]);
  
  // Obtener la categoría del suplemento actual
  const getCurrentCategory = () => {
    const supplement = supplements.find(s => s.id === categoryId);
    return supplement ? supplement.category : "";
  };
  
  const currentCategory = getCurrentCategory();
  
  // Filtrar suplementos por categoría y búsqueda
  useEffect(() => {
    let filtered = supplements.filter(s => s.category === currentCategory);
    
    if (searchQuery) {
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             s.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Ordenar según la opción seleccionada
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "popularity":
          comparison = a.reviewCount - b.reviewCount;
          break;
        case "recent":
          // Simulamos que los IDs más altos son más recientes
          comparison = parseInt(a.id) - parseInt(b.id);
          break;
        case "price":
          comparison = a.priceLevel - b.priceLevel;
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    setFilteredSupplements(filtered);
  }, [categoryId, searchQuery, sortBy, sortDirection]);
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };
  
  const handleAddToMySupplements = (supplement: any) => {
    // Crear un nuevo suplemento de usuario
    const newUserSupplement = {
      id: `user-supp-${Date.now()}`,
      supplementId: supplement.id,
      userId: "1", // En una aplicación real, esto sería el ID del usuario actual
      schedule: [],
      pillsRemaining: supplement.totalPills,
      totalPills: supplement.totalPills,
      lowStockThreshold: Math.floor(supplement.totalPills * 0.15), // 15% como umbral
      startDate: new Date().toISOString(),
      adherenceRate: 0
    };
    
    addUserSupplement(newUserSupplement);
    router.push(`/supplement/${newUserSupplement.id}`);
  };
  
  const renderSortButton = (option: SortOption, label: string, icon: React.ReactNode) => {
    const isActive = sortBy === option;
    
    return (
      <TouchableOpacity
        style={[styles.sortButton, isActive && styles.activeSortButton]}
        onPress={() => {
          if (isActive) {
            toggleSortDirection();
          } else {
            setSortBy(option);
            setSortDirection("desc");
          }
        }}
      >
        {icon}
        <Text style={[styles.sortButtonText, isActive && styles.activeSortButtonText]}>
          {label}
        </Text>
        {isActive && (
          sortDirection === "desc" ? 
            <ArrowDown size={14} color={colors.primary} /> : 
            <ArrowUp size={14} color={colors.primary} />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Reponer {currentCategory}</Text>
        <Text style={styles.subtitle}>
          Encuentra alternativas para reponer tu suplemento
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar suplementos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.sortContainer}
        contentContainerStyle={styles.sortButtons}
      >
        {renderSortButton("rating", "Valoración", <Star size={14} color={sortBy === "rating" ? colors.primary : colors.textSecondary} />)}
        {renderSortButton("popularity", "Popularidad", <Users size={14} color={sortBy === "popularity" ? colors.primary : colors.textSecondary} />)}
        {renderSortButton("recent", "Recientes", <Clock size={14} color={sortBy === "recent" ? colors.primary : colors.textSecondary} />)}
        {renderSortButton("price", "Precio", <Text style={sortBy === "price" ? {color: colors.primary} : {color: colors.textSecondary}}>€</Text>)}
      </ScrollView>
      
      <Text style={styles.resultsCount}>
        {filteredSupplements.length} suplemento{filteredSupplements.length !== 1 ? "s" : ""} encontrado{filteredSupplements.length !== 1 ? "s" : ""}
      </Text>
      
      <View style={styles.supplementsList}>
        {filteredSupplements.map(supplement => (
          <View key={supplement.id} style={styles.supplementCard}>
            <Image source={{ uri: supplement.imageUrl }} style={styles.supplementImage} />
            
            <View style={styles.supplementContent}>
              <Text style={styles.supplementName}>{supplement.name}</Text>
              
              <View style={styles.ratingContainer}>
                <Star size={16} color={colors.accent} fill={colors.accent} />
                <Text style={styles.ratingText}>{supplement.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({supplement.reviewCount})</Text>
              </View>
              
              <Text style={styles.supplementDescription} numberOfLines={2}>
                {supplement.description}
              </Text>
              
              <View style={styles.priceContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View 
                    key={i} 
                    style={[
                      styles.priceDot, 
                      i < supplement.priceLevel ? styles.priceDotActive : null
                    ]} 
                  />
                ))}
              </View>
              
              <Button
                title="Añadir a Mis Suplementos"
                onPress={() => handleAddToMySupplements(supplement)}
                size="small"
                style={styles.addButton}
              />
            </View>
          </View>
        ))}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
  },
  sortContainer: {
    marginBottom: 16,
  },
  sortButtons: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeSortButton: {
    backgroundColor: "#E6F0FF",
    borderColor: colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  activeSortButtonText: {
    color: colors.primary,
    fontWeight: "500",
  },
  resultsCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  supplementsList: {
    gap: 16,
  },
  supplementCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supplementImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  supplementContent: {
    padding: 16,
  },
  supplementName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  supplementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  priceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginRight: 4,
  },
  priceDotActive: {
    backgroundColor: colors.primary,
  },
  addButton: {
    alignSelf: "flex-start",
  },
});
