import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Search, Plus, Minus } from "lucide-react-native";
import { useSupplementStore } from "@/store/supplement-store";
import { colors } from "@/constants/colors";
import { supplements } from "@/mocks/supplements";
import Button from "@/components/Button";
import SupplementCard from "@/components/SupplementCard";

export default function AddSupplementScreen() {
  const router = useRouter();
  const { addUserSupplement, userSupplements } = useSupplementStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplement, setSelectedSupplement] = useState<any>(null);
  const [pillCount, setPillCount] = useState(60);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  
  const filteredSupplements = supplements.filter(
    supp => 
      supp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectSupplement = (supplement: any) => {
    setSelectedSupplement(supplement);
    setPillCount(supplement.totalPills);
  };
  
  const handleIncrementPills = () => {
    setPillCount(prev => prev + 1);
  };
  
  const handleDecrementPills = () => {
    setPillCount(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleIncrementThreshold = () => {
    setLowStockThreshold(prev => prev + 1);
  };
  
  const handleDecrementThreshold = () => {
    setLowStockThreshold(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const handleAddSupplement = () => {
    if (!selectedSupplement) {
      Alert.alert("Error", "Por favor selecciona un suplemento");
      return;
    }
    
    // Comprobar si el suplemento ya está añadido
    const existingSupplement = userSupplements.find(
      s => s.supplementId === selectedSupplement.id
    );
    
    if (existingSupplement) {
      Alert.alert(
        "Suplemento Ya Añadido",
        "Este suplemento ya está en tu lista. ¿Quieres verlo?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Ver",
            onPress: () => router.push(`/supplement/${existingSupplement.id}`)
          }
        ]
      );
      return;
    }
    
    // Crear nuevo suplemento de usuario
    const newUserSupplement = {
      id: `user-supp-${Date.now()}`,
      supplementId: selectedSupplement.id,
      userId: "1", // En una aplicación real, esto sería el ID del usuario actual
      schedule: [],
      pillsRemaining: pillCount,
      totalPills: pillCount,
      lowStockThreshold,
      startDate: new Date().toISOString(),
      adherenceRate: 0
    };
    
    addUserSupplement(newUserSupplement);
    
    Alert.alert(
      "Suplemento Añadido",
      "¿Quieres añadir un horario ahora?",
      [
        {
          text: "Más Tarde",
          onPress: () => router.back(),
          style: "cancel"
        },
        {
          text: "Añadir Horario",
          onPress: () => router.push(`/supplement/schedule?id=${newUserSupplement.id}`)
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Añadir Suplemento</Text>
      </View>
      
      {!selectedSupplement ? (
        <>
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
          
          <Text style={styles.resultsText}>
            {filteredSupplements.length} suplemento{filteredSupplements.length !== 1 ? "s" : ""} encontrado{filteredSupplements.length !== 1 ? "s" : ""}
          </Text>
          
          <View style={styles.supplementsList}>
            {filteredSupplements.map(supplement => (
              <TouchableOpacity
                key={supplement.id}
                style={styles.supplementItem}
                onPress={() => handleSelectSupplement(supplement)}
              >
                <Image source={{ uri: supplement.imageUrl }} style={styles.supplementImage} />
                <View style={styles.supplementInfo}>
                  <Text style={styles.supplementName}>{supplement.name}</Text>
                  <Text style={styles.supplementCategory}>{supplement.category}</Text>
                  <Text style={styles.supplementDescription} numberOfLines={2}>
                    {supplement.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <SupplementCard supplement={selectedSupplement} />
          
          <View style={styles.configSection}>
            <Text style={styles.configTitle}>Configura Tu Suplemento</Text>
            
            <View style={styles.counterContainer}>
              <Text style={styles.counterLabel}>Número de Píldoras:</Text>
              <View style={styles.counter}>
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleDecrementPills}
                >
                  <Minus size={16} color={colors.text} />
                </TouchableOpacity>
                
                <Text style={styles.counterValue}>{pillCount}</Text>
                
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleIncrementPills}
                >
                  <Plus size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.counterContainer}>
              <Text style={styles.counterLabel}>Umbral de Alerta de Stock Bajo:</Text>
              <View style={styles.counter}>
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleDecrementThreshold}
                >
                  <Minus size={16} color={colors.text} />
                </TouchableOpacity>
                
                <Text style={styles.counterValue}>{lowStockThreshold}</Text>
                
                <TouchableOpacity 
                  style={styles.counterButton} 
                  onPress={handleIncrementThreshold}
                >
                  <Plus size={16} color={colors.text} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.thresholdDescription}>
              Recibirás una alerta cuando tengas {lowStockThreshold} o menos píldoras restantes.
            </Text>
          </View>
          
          <View style={styles.actionButtons}>
            <Button 
              title="Cancelar" 
              onPress={() => setSelectedSupplement(null)} 
              variant="outline" 
              style={styles.cancelButton}
            />
            
            <Button 
              title="Añadir Suplemento" 
              onPress={handleAddSupplement} 
              style={styles.addButton}
            />
          </View>
        </View>
      )}
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
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  supplementsList: {
    marginBottom: 24,
  },
  supplementItem: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  supplementImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  supplementInfo: {
    flex: 1,
    padding: 12,
  },
  supplementName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  supplementCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  supplementDescription: {
    fontSize: 14,
    color: colors.text,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  configSection: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  counterLabel: {
    fontSize: 16,
    color: colors.text,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: "hidden",
  },
  counterButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.border,
  },
  counterValue: {
    width: 40,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  thresholdDescription: {
    fontSize: 14,
    color: colors.textSecondary,
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
  addButton: {
    flex: 1,
    marginLeft: 8,
  },
});
