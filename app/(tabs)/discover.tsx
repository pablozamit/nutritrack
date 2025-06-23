import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Search, Filter, Zap } from "lucide-react-native";
import { colors } from "@/constants/colors";
import SupplementCard from "@/components/SupplementCard";
import Button from "@/components/Button";
import { supplements, symptoms, goals } from "@/mocks/supplements";

export default function DiscoverScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "symptoms" | "goals">("all");
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const filteredSupplements = () => {
    let filtered = [...supplements];
    
    // Aplicar filtro de búsqueda
    if (searchQuery) {
      filtered = filtered.filter(
        supp => 
          supp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supp.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Aplicar filtro de síntomas
    if (activeTab === "symptoms" && selectedSymptom) {
      const symptom = symptoms.find(s => s.id === selectedSymptom);
      if (symptom) {
        filtered = filtered.filter(supp => symptom.supplements.includes(supp.id));
      }
    }
    
    // Aplicar filtro de objetivos
    if (activeTab === "goals" && selectedGoal) {
      const goal = goals.find(g => g.id === selectedGoal);
      if (goal) {
        filtered = filtered.filter(supp => goal.supplements.includes(supp.id));
      }
    }
    
    return filtered;
  };
  
  const handleAiRecommend = async () => {
    if (!aiQuery.trim()) return;
    
    setIsAiLoading(true);
    
    try {
      // Simular recomendación de IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generar recomendaciones basadas en la consulta
      let recommendedIds: string[] = [];
      
      // Verificar si la consulta coincide con algún síntoma
      const matchedSymptoms = symptoms.filter(
        s => aiQuery.toLowerCase().includes(s.name.toLowerCase())
      );
      
      // Verificar si la consulta coincide con algún objetivo
      const matchedGoals = goals.filter(
        g => aiQuery.toLowerCase().includes(g.name.toLowerCase())
      );
      
      // Combinar recomendaciones
      if (matchedSymptoms.length > 0) {
        matchedSymptoms.forEach(s => {
          recommendedIds = [...recommendedIds, ...s.supplements];
        });
      }
      
      if (matchedGoals.length > 0) {
        matchedGoals.forEach(g => {
          recommendedIds = [...recommendedIds, ...g.supplements];
        });
      }
      
      // Si no hay coincidencias, proporcionar algunas recomendaciones predeterminadas
      if (recommendedIds.length === 0) {
        recommendedIds = ["1", "3", "5"]; // Recomendaciones predeterminadas
      }
      
      // Eliminar duplicados
      recommendedIds = [...new Set(recommendedIds)];
      
      setAiRecommendations(recommendedIds);
    } catch (error) {
      console.error("Error al obtener recomendaciones de IA:", error);
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return (
          <View style={styles.supplementsGrid}>
            {filteredSupplements().map(supplement => (
              <SupplementCard key={supplement.id} supplement={supplement} />
            ))}
          </View>
        );
        
      case "symptoms":
        return (
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {symptoms.map(symptom => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.tagButton,
                    selectedSymptom === symptom.id && styles.tagButtonActive
                  ]}
                  onPress={() => setSelectedSymptom(
                    selectedSymptom === symptom.id ? null : symptom.id
                  )}
                >
                  <Text 
                    style={[
                      styles.tagText,
                      selectedSymptom === symptom.id && styles.tagTextActive
                    ]}
                  >
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.supplementsGrid}>
              {filteredSupplements().map(supplement => (
                <SupplementCard key={supplement.id} supplement={supplement} />
              ))}
            </View>
          </View>
        );
        
      case "goals":
        return (
          <View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {goals.map(goal => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.tagButton,
                    selectedGoal === goal.id && styles.tagButtonActive
                  ]}
                  onPress={() => setSelectedGoal(
                    selectedGoal === goal.id ? null : goal.id
                  )}
                >
                  <Text 
                    style={[
                      styles.tagText,
                      selectedGoal === goal.id && styles.tagTextActive
                    ]}
                  >
                    {goal.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.supplementsGrid}>
              {filteredSupplements().map(supplement => (
                <SupplementCard key={supplement.id} supplement={supplement} />
              ))}
            </View>
          </View>
        );
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar suplementos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.aiRecommendContainer}>
        <View style={styles.aiHeader}>
          <Zap size={20} color={colors.accent} />
          <Text style={styles.aiTitle}>Recomendador IA de Suplementos</Text>
        </View>
        
        <Text style={styles.aiDescription}>
          Describe tus síntomas u objetivos, y nuestra IA te recomendará suplementos.
        </Text>
        
        <View style={styles.aiInputContainer}>
          <TextInput
            style={styles.aiInput}
            placeholder="ej., Me siento cansado y estresado..."
            value={aiQuery}
            onChangeText={setAiQuery}
            placeholderTextColor={colors.textSecondary}
            multiline
          />
          
          <Button
            title="Obtener Recomendaciones"
            onPress={handleAiRecommend}
            loading={isAiLoading}
            disabled={isAiLoading || !aiQuery.trim()}
            style={styles.aiButton}
          />
        </View>
        
        {aiRecommendations.length > 0 && (
          <View style={styles.aiResultsContainer}>
            <Text style={styles.aiResultsTitle}>Recomendado para ti:</Text>
            
            <View style={styles.aiResultsList}>
              {aiRecommendations.map(id => {
                const supplement = supplements.find(s => s.id === id);
                if (!supplement) return null;
                
                return (
                  <SupplementCard 
                    key={supplement.id} 
                    supplement={supplement} 
                    compact 
                  />
                );
              })}
            </View>
          </View>
        )}
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text 
            style={[styles.tabText, activeTab === "all" && styles.activeTabText]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "symptoms" && styles.activeTab]}
          onPress={() => setActiveTab("symptoms")}
        >
          <Text 
            style={[styles.tabText, activeTab === "symptoms" && styles.activeTabText]}
          >
            Por Síntoma
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "goals" && styles.activeTab]}
          onPress={() => setActiveTab("goals")}
        >
          <Text 
            style={[styles.tabText, activeTab === "goals" && styles.activeTabText]}
          >
            Por Objetivo
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        renderContent()
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
  searchContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  aiRecommendContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  aiInputContainer: {
    marginBottom: 12,
  },
  aiInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    color: colors.text,
    marginBottom: 12,
  },
  aiButton: {
    marginTop: 8,
  },
  aiResultsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  aiResultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  aiResultsList: {
    gap: 8,
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  tagsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 8,
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  tagButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.text,
  },
  tagTextActive: {
    color: "#fff",
  },
  supplementsGrid: {
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
