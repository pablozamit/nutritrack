import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Plus, AlertTriangle } from "lucide-react-native";
import { useSupplementStore } from "@/store/supplement-store";
import { colors } from "@/constants/colors";
import Button from "@/components/Button";
import { supplements } from "@/mocks/supplements";

export default function SupplementsScreen() {
  const router = useRouter();
  const { userSupplements, removeUserSupplement, getLowStockSupplements } = useSupplementStore();
  
  const handleAddSupplement = () => {
    router.push("/supplement/add");
  };
  
  const handleViewSupplement = (id: string) => {
    router.push(`/supplement/${id}`);
  };
  
  const handleDeleteSupplement = (id: string) => {
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
          onPress: () => removeUserSupplement(id),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleReplenish = (supplementId: string) => {
    router.push(`/supplement/replenish?categoryId=${supplementId}`);
  };
  
  const getSupplementName = (supplementId: string) => {
    const supplement = supplements.find(s => s.id === supplementId);
    return supplement ? supplement.name : "Suplemento Desconocido";
  };
  
  const getSupplementImage = (supplementId: string) => {
    const supplement = supplements.find(s => s.id === supplementId);
    return supplement ? supplement.imageUrl : "";
  };
  
  const getSupplementCategory = (supplementId: string) => {
    const supplement = supplements.find(s => s.id === supplementId);
    return supplement ? supplement.category : "";
  };
  
  const lowStockSupplements = getLowStockSupplements();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Suplementos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddSupplement}
        >
          <Plus size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {lowStockSupplements.length > 0 && (
        <View style={styles.warningCard}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            {lowStockSupplements.length} suplemento{lowStockSupplements.length > 1 ? "s" : ""} con pocas dosis
          </Text>
        </View>
      )}
      
      {userSupplements.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Aún no has añadido ningún suplemento</Text>
          <Button 
            title="Añadir Tu Primer Suplemento" 
            onPress={handleAddSupplement} 
            style={styles.emptyStateButton}
          />
        </View>
      ) : (
        userSupplements.map(userSupplement => {
          const percentRemaining = (userSupplement.pillsRemaining / userSupplement.totalPills) * 100;
          const isLowStock = percentRemaining <= 15;
          
          return (
            <TouchableOpacity
              key={userSupplement.id}
              style={[styles.supplementCard, isLowStock && styles.lowStockCard]}
              onPress={() => handleViewSupplement(userSupplement.id)}
            >
              <View style={styles.supplementInfo}>
                <Text style={styles.supplementName}>
                  {getSupplementName(userSupplement.supplementId)}
                </Text>
                
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleText}>
                    {userSupplement.schedule.length} horario{userSupplement.schedule.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                
                <View style={styles.pillsContainer}>
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
                  
                  {isLowStock && (
                    <View style={styles.lowStockBadge}>
                      <Text style={styles.lowStockText}>{Math.round(percentRemaining)}%</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.adherenceInfo}>
                  <Text style={styles.adherenceText}>
                    Adherencia: {userSupplement.adherenceRate}%
                  </Text>
                </View>
              </View>
              
              <View style={styles.supplementActions}>
                {isLowStock && (
                  <TouchableOpacity 
                    style={styles.replenishButton}
                    onPress={() => handleReplenish(userSupplement.supplementId)}
                  >
                    <Text style={styles.replenishButtonText}>Reponer</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSupplement(userSupplement.id)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      )}
      
      <Button 
        title="Añadir Nuevo Suplemento" 
        onPress={handleAddSupplement} 
        style={styles.addNewButton}
      />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 24,
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  emptyStateButton: {
    width: 240,
  },
  supplementCard: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  lowStockCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  scheduleInfo: {
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  pillsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pillsInfo: {
    flex: 1,
  },
  pillsText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  pillsProgressContainer: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  pillsProgress: {
    height: "100%",
    borderRadius: 3,
  },
  lowStockBadge: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  lowStockText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.warning,
  },
  adherenceInfo: {
    marginTop: 8,
  },
  adherenceText: {
    fontSize: 14,
    color: colors.text,
  },
  supplementActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  replenishButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  replenishButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.danger,
  },
  addNewButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});
