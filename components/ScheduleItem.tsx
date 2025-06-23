import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Edit, Trash2 } from "lucide-react-native";
import { Schedule } from "@/types";
import { colors } from "@/constants/colors";

type ScheduleItemProps = {
  schedule: Schedule;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: (taken: boolean) => void;
  taken?: boolean;
  showActions?: boolean;
};

export default function ScheduleItem({
  schedule,
  onEdit,
  onDelete,
  onToggle,
  taken = false,
  showActions = true,
}: ScheduleItemProps) {
  const getDayNames = () => {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    if (schedule.days.length === 7) return "Todos los días";
    if (schedule.days.length === 0) return "Ningún día seleccionado";
    
    return schedule.days.map(day => days[day]).join(", ");
  };
  
  return (
    <View style={[styles.container, taken && styles.takenContainer]}>
      <View style={styles.timeContainer}>
        <Clock size={18} color={colors.primary} />
        <Text style={styles.time}>{schedule.time}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.dosage}>{schedule.dosage} {schedule.dosage > 1 ? "píldoras" : "píldora"}</Text>
        <Text style={styles.days}>{getDayNames()}</Text>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          {onToggle && (
            <TouchableOpacity 
              style={[styles.actionButton, taken ? styles.takenButton : styles.notTakenButton]} 
              onPress={() => onToggle(!taken)}
            >
              <Text style={taken ? styles.takenText : styles.notTakenText}>
                {taken ? "Tomada" : "Tomar"}
              </Text>
            </TouchableOpacity>
          )}
          
          {onEdit && (
            <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
              <Edit size={18} color={colors.primary} />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity style={styles.iconButton} onPress={onDelete}>
              <Trash2 size={18} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  takenContainer: {
    backgroundColor: "#F0F8FF", // Fondo azul claro para elementos tomados
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  time: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    color: colors.text,
  },
  infoContainer: {
    flex: 1,
  },
  dosage: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  days: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  notTakenButton: {
    backgroundColor: colors.primary,
  },
  takenButton: {
    backgroundColor: colors.success,
  },
  notTakenText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  takenText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
});
