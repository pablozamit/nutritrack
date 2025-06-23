import React from "react";
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from "react-native";
import { colors } from "@/constants/colors";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle: ViewStyle = {};
    
    // Estilos de variante
    switch (variant) {
      case "primary":
        buttonStyle.backgroundColor = colors.primary;
        break;
      case "secondary":
        buttonStyle.backgroundColor = colors.secondary;
        break;
      case "outline":
        buttonStyle.backgroundColor = "transparent";
        buttonStyle.borderWidth = 1;
        buttonStyle.borderColor = colors.primary;
        break;
      case "danger":
        buttonStyle.backgroundColor = colors.danger;
        break;
    }
    
    // Estilos de tamaño
    switch (size) {
      case "small":
        buttonStyle.paddingVertical = 6;
        buttonStyle.paddingHorizontal = 12;
        break;
      case "medium":
        buttonStyle.paddingVertical = 10;
        buttonStyle.paddingHorizontal = 16;
        break;
      case "large":
        buttonStyle.paddingVertical = 14;
        buttonStyle.paddingHorizontal = 20;
        break;
    }
    
    // Ancho completo
    if (fullWidth) {
      buttonStyle.width = "100%";
    }
    
    // Estado deshabilitado
    if (disabled || loading) {
      buttonStyle.opacity = 0.6;
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    let style: TextStyle = {};
    
    // Estilos de texto por variante
    switch (variant) {
      case "outline":
        style.color = colors.primary;
        break;
      default:
        style.color = "#fff";
        break;
    }
    
    // Estilos de texto por tamaño
    switch (size) {
      case "small":
        style.fontSize = 14;
        break;
      case "medium":
        style.fontSize = 16;
        break;
      case "large":
        style.fontSize = 18;
        break;
    }
    
    return style;
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === "outline" ? colors.primary : "#fff"} 
          size={size === "small" ? "small" : "small"} 
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
});
