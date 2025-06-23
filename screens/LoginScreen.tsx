import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const validateInputs = () => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError("El email es obligatorio");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Por favor introduce un email válido");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateInputs()) return;
    
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
    }
  };
  
  const handleRegister = () => {
    router.push("/auth/register");
  };
  
  // Para fines de demostración, agreguemos una función de inicio de sesión rápido
  const handleDemoLogin = async () => {
    try {
      await login("health@example.com", "password");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error de inicio de sesión demo:", error);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Bienvenido de Nuevo</Text>
          <Text style={styles.subtitle}>Inicia sesión para seguir tus suplementos</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Introduce tu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          
          <Input
            label="Contraseña"
            placeholder="Introduce tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            fullWidth
          />
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu Contraseña?</Text>
          </TouchableOpacity>
          
          <Button
            title="Inicio de Sesión Demo"
            onPress={handleDemoLogin}
            variant="outline"
            style={styles.demoButton}
            fullWidth
          />
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 16,
  },
  forgotPassword: {
    alignSelf: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  demoButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 4,
  },
  registerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
