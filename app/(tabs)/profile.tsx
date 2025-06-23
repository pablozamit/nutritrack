import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Settings, 
  LogOut, 
  Award, 
  Bell, 
  HelpCircle, 
  Shield, 
  Flame 
} from "lucide-react-native";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import Button from "@/components/Button";
import AdherenceChart from "@/components/AdherenceChart";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Cerrar Sesión",
          onPress: () => {
            logout();
            router.replace("/auth/login");
          },
          style: "destructive"
        }
      ]
    );
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>Por favor inicia sesión para ver tu perfil</Text>
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
        <Text style={styles.title}>Perfil</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileCard}>
        <Image 
          source={{ uri: `https://ui-avatars.com/api/?name=${user.username}&background=random&size=100` }} 
          style={styles.avatar} 
        />
        
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.points}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.streak}</Text>
            <Text style={styles.statLabel}>Racha</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.adherenceContainer}>
        <Text style={styles.sectionTitle}>Adherencia General</Text>
        <AdherenceChart rate={85} size="large" showLabel={false} />
        <Text style={styles.adherenceText}>
          Has tomado el 85% de tus suplementos programados este mes.
        </Text>
      </View>
      
      <View style={styles.streakCard}>
        <View style={styles.streakHeader}>
          <Flame size={24} color={colors.accent} />
          <Text style={styles.streakTitle}>Racha Actual</Text>
        </View>
        
        <Text style={styles.streakValue}>{user.streak} días</Text>
        <Text style={styles.streakDescription}>
          ¡Sigue tomando tus suplementos para mantener tu racha!
        </Text>
        
        <View style={styles.streakProgress}>
          <View style={styles.streakProgressBar}>
            <View 
              style={[
                styles.streakProgressFill, 
                { width: `${Math.min(100, (user.streak / 30) * 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.streakGoal}>Meta de 30 días</Text>
        </View>
      </View>
      
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Bell size={20} color={colors.primary} />
          <Text style={styles.menuItemText}>Notificaciones</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Award size={20} color={colors.primary} />
          <Text style={styles.menuItemText}>Logros</Text>
        </TouchableOpacity>

        {user?.id === 'admin-uid-placeholder' && (
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin-panel')}>
            <Shield size={20} color={colors.primary} />
            <Text style={styles.menuItemText}>Panel Admin</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuItem}>
          <Shield size={20} color={colors.primary} />
          <Text style={styles.menuItemText}>Privacidad</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <HelpCircle size={20} color={colors.primary} />
          <Text style={styles.menuItemText}>Ayuda y Soporte</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  adherenceContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  adherenceText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  streakCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
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
    marginBottom: 16,
  },
  streakProgress: {
    marginTop: 8,
  },
  streakProgressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  streakProgressFill: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  streakGoal: {
    fontSize: 12,
    color: colors.textSecondary,
    alignSelf: "flex-end",
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    marginLeft: 12,
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
