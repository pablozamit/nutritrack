import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useCatalogStore } from '@/store/catalog-store';
import { useSupplementStore } from '@/store/supplement-store';
import { CatalogSupplement } from '@/types';

export default function ReplenishScreen() {
  const { catalog, subscribe } = useCatalogStore();
  const { addSupplement, userSupplements } = useSupplementStore();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, []);

  const handleAdd = async (sup: CatalogSupplement) => {
    if (userSupplements.some(u => u.name.toLowerCase() === sup.name.toLowerCase())) return;
    await addSupplement({
      name: sup.name,
      time: '08:00',
      quantity: 1,
      days: [0,1,2,3,4,5,6],
      createdAt: new Date().toISOString(),
    });
  };

  if (catalog.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Catálogo no disponible</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catálogo</Text>
      {catalog.map(c => (
        <View key={c.id} style={styles.item}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.desc}>{c.description}</Text>
          <Button title="Añadir" onPress={() => handleAdd(c)} size="small" style={styles.addBtn} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:16},
  center:{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:colors.background},
  title:{fontSize:24,fontWeight:'bold',color:colors.text,marginBottom:16},
  item:{backgroundColor:colors.card,padding:16,borderRadius:8,marginBottom:12},
  name:{fontSize:18,fontWeight:'600',color:colors.text,marginBottom:4},
  desc:{fontSize:14,color:colors.textSecondary,marginBottom:8},
  addBtn:{alignSelf:'flex-start'},
  text:{color:colors.textSecondary,fontSize:16}
});
