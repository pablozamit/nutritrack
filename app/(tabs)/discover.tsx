import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { getSuggestedSupplements, getSuggestedSupplementsAI } from '@/lib/recommendation';
import { RecommendedSupplement } from '@/types';
import { useSupplementStore } from '@/store/supplement-store';

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendedSupplement[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { addSupplement, userSupplements } = useSupplementStore();

  const handleSearch = async () => {
    setMessage('');
    let list = getSuggestedSupplements(query);
    if (list.length === 0) {
      setLoading(true);
      list = await getSuggestedSupplementsAI(query);
      setLoading(false);
    }
    if (list.length === 0) {
      setMessage('No se encontraron sugerencias');
    }
    setResults(list);
  };

  const handleAdd = async (s: RecommendedSupplement) => {
    if (userSupplements.some(u => u.name.toLowerCase() === s.name.toLowerCase())) return;
    await addSupplement({
      name: s.name,
      time: '08:00',
      quantity: 1,
      days: [0,1,2,3,4,5,6],
      createdAt: new Date().toISOString()
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Descubrir suplementos</Text>
      <Input
        placeholder="Ej: dormir mejor"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Buscar" onPress={handleSearch} loading={loading} style={styles.searchBtn} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {results.map(r => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.cardTitle}>{r.name}</Text>
          <Text style={styles.reason}>{r.reason}</Text>
          <Button title="Añadir" onPress={() => handleAdd(r)} size="small" style={styles.addBtn} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:16},
  title:{fontSize:24,fontWeight:'bold',color:colors.text,marginBottom:16},
  searchBtn:{marginBottom:16},
  message:{color:colors.textSecondary,marginBottom:8},
  card:{backgroundColor:colors.card,padding:16,borderRadius:8,marginBottom:12},
  cardTitle:{fontSize:18,fontWeight:'600',color:colors.text,marginBottom:4},
  reason:{fontSize:14,color:colors.textSecondary,marginBottom:8},
  addBtn:{alignSelf:'flex-start'},
});
