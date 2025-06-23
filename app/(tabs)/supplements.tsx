import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import { useSupplementStore } from '@/store/supplement-store';

export default function SupplementsScreen() {
  const router = useRouter();
  const { userSupplements } = useSupplementStore();

  const handleAdd = () => {
    router.push('/supplement/add');
  };

  const handleView = (id: string) => {
    router.push(`/supplement/${id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Suplementos</Text>
        <Button title="Añadir" onPress={handleAdd} size="small" />
      </View>
      {userSupplements.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Aún no tienes suplementos</Text></View>
      ) : (
        userSupplements.map(s => (
          <TouchableOpacity key={s.id} style={styles.item} onPress={() => handleView(s.id)}>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.info}>{s.time} - {s.days.join(', ')}</Text>
            <Text style={styles.info}>Cantidad: {s.quantity}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:16},
  header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16},
  title:{fontSize:24,fontWeight:'bold',color:colors.text},
  empty:{alignItems:'center',marginTop:40},
  emptyText:{color:colors.textSecondary,fontSize:16},
  item:{backgroundColor:colors.card,padding:16,borderRadius:8,marginBottom:12},
  name:{fontSize:18,fontWeight:'600',color:colors.text},
  info:{fontSize:14,color:colors.text}
});
