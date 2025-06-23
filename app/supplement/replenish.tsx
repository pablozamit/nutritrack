import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export default function ReplenishScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Catálogo no disponible</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.background},
  text:{color:colors.textSecondary,fontSize:16}
});
