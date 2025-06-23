import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useSupplementStore } from '@/store/supplement-store';

export default function AddSupplementScreen() {
  const router = useRouter();
  const { addSupplement } = useSupplementStore();
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [quantity, setQuantity] = useState('1');
  const [days, setDays] = useState<number[]>([0,1,2,3,4,5,6]);

  const toggleDay = (day: number) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    await addSupplement({ name, time, days, quantity: parseInt(quantity), createdAt: new Date().toISOString() });
    router.back();
  };

  const renderDay = (d: number, label: string) => (
    <TouchableOpacity key={d} style={[styles.day, days.includes(d) && styles.dayActive]} onPress={() => toggleDay(d)}>
      <Text style={[styles.dayText, days.includes(d) && styles.dayTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nuevo Suplemento</Text>
      <Input label="Nombre" value={name} onChangeText={setName} />
      <Input label="Hora" value={time} onChangeText={setTime} />
      <Input label="Cantidad" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
      <View style={styles.days}>{[
        ['Dom',0],['Lun',1],['Mar',2],['Mié',3],['Jue',4],['Vie',5],['Sáb',6]
      ].map(([l,v])=>renderDay(v as number,l as string))}</View>
      <Button title="Guardar" onPress={handleSave} style={styles.save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.background},
  content:{padding:16},
  title:{fontSize:24,fontWeight:'bold',color:colors.text,marginBottom:16},
  days:{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:16},
  day:{paddingHorizontal:12,paddingVertical:6,borderRadius:8,backgroundColor:colors.card},
  dayActive:{backgroundColor:colors.primary},
  dayText:{color:colors.textSecondary},
  dayTextActive:{color:'#fff'},
  save:{marginTop:8}
});
