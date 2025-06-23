import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { Bell, Plus, AlertTriangle } from "lucide-react-native";
import { useSupplementStore } from "@/store/supplement-store";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import ScheduleItem from "@/components/ScheduleItem";
import AdherenceChart from "@/components/AdherenceChart";
import Button from "@/components/Button";

export default function TodayScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { userSupplements, intakes, recordIntake, getLowStockSupplements } = useSupplementStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayIntakes, setTodayIntakes] = useState<any[]>([]);
  
  // Actualizar la hora actual cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = currentTime.toISOString().split("T")[0];
  const currentDay = currentTime.getDay();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  // Calcular las programaciones de hoy
  useEffect(() => {
    const schedules: any[] = [];
    
    userSupplements.forEach(userSupplement => {
      userSupplement.schedule.forEach(schedule => {
        if (schedule.days.includes(currentDay)) {
          const [hour, minute] = schedule.time.split(":").map(Number);
          const isPast = 
            currentHour > hour || 
            (currentHour === hour && currentMinute >= minute);
          
          const scheduleTime = new Date();
          scheduleTime.setHours(hour, minute, 0, 0);
          
          // Verificar si esta toma ha sido registrada
          const intakeRecord = intakes.find(
            intake => 
              intake.userSupplementId === userSupplement.id &&
              intake.scheduleId === schedule.id &&
              intake.timestamp.startsWith(today)
          );
          
          schedules.push({
            userSupplementId: userSupplement.id,
            supplementId: userSupplement.supplementId,
            scheduleId: schedule.id,
            time: schedule.time,
            dosage: schedule.dosage,
            isPast,
            taken: intakeRecord?.taken || false,
            timestamp: scheduleTime.toISOString(),
            name: userSupplement.supplementId // Reemplazaremos esto con el nombre real
          });
        }
      });
    });
    
    // Ordenar por hora
    schedules.sort((a, b) => {
      const [aHour, aMinute] = a.time.split(":").map(Number);
      const [bHour, bMinute] = b.time.split(":").map(Number);
      
      if (aHour !== bHour) return aHour - bHour;
      return aMinute - bMinute;
    });
    
    setTodayIntakes(schedules);
  }, [userSupplements, intakes, currentDay, currentHour, currentMinute]);
  
  const handleToggleIntake = (index: number, taken: boolean) => {
    const intake = todayIntakes[index];
    
    recordIntake({
      id: `${intake.userSupplementId}-${intake.scheduleId}-${today}`,
      userSupplementId: intake.userSupplementId,
      scheduleId: intake.scheduleId,
      timestamp: intake.timestamp,
      taken
    });
    
    // Actualizar estado local
    const updatedIntakes = [...todayIntakes];
    updatedIntakes[index].taken = taken;
    setTodayIntakes(updatedIntakes);
  };
  
  const calculateOverallAdherence = () => {
    if (todayIntakes.length === 0) return 0;
    
    const takenCount = todayIntakes.filter(intake => intake.taken).length;
    const pastIntakes = todayIntakes.filter(intake => intake.isPast);
    
    if (pastIntakes.length === 0) return 100;
    return (takenCount / pastIntakes.length) * 100;
  };
  
  const lowStockSupplements = getLowStockSupplements();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido a SupplementTracker</Text>
        <Text style={styles.subtitle}>Por favor inicia sesión para ver tus suplementos</Text>
        <Button 
          title="Iniciar Sesión" 
          onPress={() => router.push("/auth/login")} 
          style={styles.loginButton}
        />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user.username}</Text>
          <Text style={styles.date}>
            {currentTime.toLocaleDateString("es-ES", {
              weekday: "long",
              month: "long",
              day: "numeric"
            })}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.adherenceContainer}>
        <AdherenceChart rate={calculateOverallAdherence()} size="large" />
      </View>
      
      {lowStockSupplements.length > 0 && (
        <View style={styles.warningCard}>
          <AlertTriangle size={20} color={colors.warning} />
          <Text style={styles.warningText}>
            {lowStockSupplements.length} suplemento{lowStockSupplements.length > 1 ? "s" : ""} con pocas unidades
          </Text>
          <TouchableOpacity onPress={() => router.push("/supplements")}>
            <Text style={styles.warningAction}>Ver</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Programación de Hoy</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push("/supplement/add")}
        >
          <Plus size={18} color={colors.primary} />
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
      
      {todayIntakes.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No hay suplementos programados para hoy</Text>
          <Button 
            title="Añadir Suplemento" 
            onPress={() => router.push("/supplement/add")} 
            style={styles.emptyStateButton}
          />
        </View>
      ) : (
        todayIntakes.map((intake, index) => (
          <ScheduleItem
            key={`${intake.userSupplementId}-${intake.scheduleId}`}
            schedule={{
              id: intake.scheduleId,
              time: intake.time,
              dosage: intake.dosage,
              days: [currentDay]
            }}
            taken={intake.taken}
            onToggle={(taken) => handleToggleIntake(index, taken)}
          />
        ))
      )}
      
      <View style={styles.streakContainer}>
        <Text style={styles.streakTitle}>Racha Actual</Text>
        <Text style={styles.streakValue}>{user.streak} días</Text>
        <Text style={styles.streakDescription}>
          ¡Sigue tomando tus suplementos para mantener tu racha!
        </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  adherenceContainer: {
    alignItems: "center",
    marginBottom: 24,
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
  warningAction: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
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
  },
  emptyStateButton: {
    width: 200,
  },
  streakContainer: {
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.accent,
    marginBottom: 8,
  },
  streakDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: "center",
  },
  loginButton: {
    width: 200,
    alignSelf: "center",
  },
});
