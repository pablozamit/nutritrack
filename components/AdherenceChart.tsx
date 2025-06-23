import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type AdherenceChartProps = {
  rate: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
};

export default function AdherenceChart({
  rate,
  size = "medium",
  showLabel = true,
}: AdherenceChartProps) {
  const getSize = () => {
    switch (size) {
      case "small":
        return 60;
      case "medium":
        return 100;
      case "large":
        return 150;
      default:
        return 100;
    }
  };
  
  const getFontSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "medium":
        return 20;
      case "large":
        return 28;
      default:
        return 20;
    }
  };
  
  const getColor = () => {
    if (rate >= 80) return colors.success;
    if (rate >= 50) return colors.warning;
    return colors.danger;
  };
  
  const chartSize = getSize();
  const strokeWidth = chartSize * 0.1;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (rate / 100) * circumference;
  
  return (
    <View style={styles.container}>
      <View style={[styles.chart, { width: chartSize, height: chartSize }]}>
        <View style={styles.backgroundCircle} />
        <View
          style={[
            styles.progressCircle,
            {
              width: chartSize,
              height: chartSize,
              borderRadius: chartSize / 2,
              borderWidth: strokeWidth,
              borderColor: getColor(),
              transform: [{ rotateZ: "-90deg" }],
              borderTopColor: "transparent",
              borderRightColor: "transparent",
              opacity: rate > 50 ? 1 : rate / 50,
            },
          ]}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.rateText, { fontSize: getFontSize(), color: getColor() }]}>
            {Math.round(rate)}%
          </Text>
        </View>
      </View>
      
      {showLabel && (
        <Text style={styles.label}>Tasa de Adherencia</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chart: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
  },
  progressCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  rateText: {
    fontWeight: "bold",
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
