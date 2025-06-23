import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock } from "lucide-react-native";
import { useSupplementStore } from "@/store/supplement-store";
import { colors } from "@/constants/colors";
import Button from "@/components/Button";
import Input from "@/components/Input";

export default function ScheduleScreen() {
  const { id, scheduleId } = useLocalSearchParams();
  const router = useRouter();
  const { 
    userSupplements, 
    addSchedule, 
    updateSchedule, 
    removeSchedule 
  } = useSupplementStore();
  
  const [userSupplement, setUserSupplement] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);
  const [time, setTime] = useState("08:00");
  const [dosage, setDosage] = useState("1");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundUserSupplement = userSupplements.find(s => s.id === id);
      setUserSupplement(foundUserSupplement);
      
      if (scheduleId && foundUserSupplement) {
        const foundSchedule = foundUserSupplement.schedule.find(
          (s: any) => s.id === scheduleId
        );
        
        if (foundSchedule) {
          setIsEditing(true);
          setSchedule(foundSchedule);
          setTime(foundSchedule.time);
          setDosage(String(foundSchedule.dosage));
          setSelectedDays(foundSchedule.days);
        }
      }
    }
  }, [id, scheduleId, userSupplements]);
  
  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
  };
  
  const handleDosageChange = (value: string) => {
    // Solo permitir números
    if (/^\d*$/.test(value)) {
      setDosage(value);
    }
  };
  
  const handleDayToggle = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };
  
  const handleSelectAllDays = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
  };
  
  const handleClearDays = () => {
    setSelectedDays([]);
  };
  
  const handleSave = () => {
    if (!userSupplement) {
      Alert.alert("Error", "Suplemento no encontrado");
      return;
    }
    
    if (selectedDays.length === 0) {
      Alert.alert("Error", "Por favor selecciona al menos un día");
      return;
    }
    
    if (!time) {
      Alert.alert("Error", "Por favor establece una hora");
      return;
    }
    
    if (!dosage || parseInt(dosage) < 1) {
      Alert.alert("Error", "Por favor introduce una dosis válida");
      return;
    }
    
    const scheduleData = {
      id: isEditing ? schedule.id : `schedule-${Date.now()}`,
      time,
      dosage: parseInt(dosage),
      days: selectedDays
    };
    
    if (isEditing) {
      updateSchedule(userSupplement.id, schedule.id, scheduleData);
    } else {
      addSchedule(userSupplement.id, scheduleData);
    }
    
    router.back();
  };
  
  const handleDelete = () => {
    if (!userSupplement || !isEditing) return;
    
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
            removeSchedule(userSupplement.id, schedule.id);
            router.back();
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const renderDaySelector = () => {
    const days = [
      { name: "Dom", value: 0 },
      { name: "Lun", value: 1 },
      { name: "Mar", value: 2 },
      { name: "Mié", value: 3 },
      { name: "Jue", value: 4 },
      { name: "Vie", value: 5 },
      { name: "Sáb", value: 6 }
    ];
    
    return (
      <View style={styles.daysContainer}>
        <View style={styles.daysHeader}>
          <Text style={styles.daysTitle}>Días</Text>
          <View style={styles.daysActions}>
            <TouchableOpacity onPress={handleSelectAllDays}>
              <Text style={styles.daysActionText}>Seleccionar Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearDays}>
              <Text style={styles.daysActionText}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.daysList}>
          {days.map(day => (
            <TouchableOpacity
              key={day.value}
              style={[
                styles.dayButton,
                selectedDays.includes(day.value) && styles.dayButtonSelected
              ]}
              onPress={() => handleDayToggle(day.value)}
            >
              <Text 
                style={[
                  styles.dayText,
                  selectedDays.includes(day.value) && styles.dayTextSelected
                ]}
              >
                {day.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  if (!userSupplement) {
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
        <Text style={styles.title}>
          {isEditing ? "Editar Horario" : "Añadir Horario"}
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.sectionTitle}>Hora</Text>
          <View style={styles.timePickerContainer}>
            <Clock size={20} color={colors.primary} style={styles.timeIcon} />
            <Input
              placeholder="HH:MM"
              value={time}
              onChangeText={handleTimeChange}
              keyboardType="numbers-and-punctuation"
              style={styles.timeInput}
            />
          </View>
          <Text style={styles.timeHint}>Introduce la hora en formato 24 horas (ej., 08:00, 14:30)</Text>
        </View>
        
        <View style={styles.dosageContainer}>
          <Text style={styles.sectionTitle}>Dosis</Text>
          <View style={styles.dosageInputContainer}>
            <Input
              placeholder="1"
              value={dosage}
              onChangeText={handleDosageChange}
              keyboardType="number-pad"
              style={styles.dosageInput}
            />
            <Text style={styles.pillsText}>
              píldora{parseInt(dosage) !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
        
        {renderDaySelector()}
        
        <View style={styles.actionButtons}>
          {isEditing && (
            <Button 
              title="Eliminar" 
              onPress={handleDelete} 
              variant="danger" 
              style={styles.deleteButton}
            />
          )}
          
          <Button 
            title="Cancelar" 
            onPress={() => router.back()} 
            variant="outline" 
            style={styles.cancelButton}
          />
          
          <Button 
            title="Guardar" 
            onPress={handleSave} 
            style={styles.saveButton}
          />
        </View>
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
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  timeContainer: {
    marginBottom: 24,
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timeIcon: {
    marginRight: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeHint: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dosageContainer: {
    marginBottom: 24,
  },
  dosageInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dosageInput: {
    width: 80,
    marginRight: 12,
  },
  pillsText: {
    fontSize: 16,
    color: colors.text,
  },
  daysContainer: {
    marginBottom: 24,
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  daysTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  daysActions: {
    flexDirection: "row",
  },
  daysActionText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 16,
  },
  daysList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayButton: {
    width: "13%",
    aspectRatio: 1,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dayButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: colors.text,
  },
  dayTextSelected: {
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
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
