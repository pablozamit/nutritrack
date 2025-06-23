import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useSupplementStore } from '@/store/supplement-store';

export default function SupplementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userSupplements, deleteSupplement } = useSupplementStore();
  const [supplement, setSupplement] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const found = userSupplements.find(s => s.id === id);
      setSupplement(found);
    }
  }, [id, userSupplements]);

  if (!supplement) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Suplemento no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} />
      </View>
    );
  }

  const handleDelete = async () => {
    await deleteSupplement(supplement.id);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{supplement.name}</Text>
      <Text style={styles.info}>Hora: {supplement.time}</Text>
      <Text style={styles.info}>Días: {supplement.days.join(', ')}</Text>
      <Text style={styles.info}>Cantidad: {supplement.quantity}</Text>
      <Button title="Eliminar" onPress={handleDelete} style={styles.delete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background,padding:16},
  title:{fontSize:24,fontWeight:'bold',color:colors.text,marginBottom:8},
  info:{fontSize:16,color:colors.text,marginBottom:4},
  notFound:{fontSize:18,color:colors.text,marginBottom:16},
  delete:{marginTop:16}
});
