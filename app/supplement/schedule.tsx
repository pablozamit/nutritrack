import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useSupplementStore } from '@/store/supplement-store';

type ScheduleForm = {
  time: string;
  days: number[];
};

export default function ScheduleScreen() {
  const { userSupplements, updateSupplement } = useSupplementStore();
  const [forms, setForms] = useState<Record<string, ScheduleForm>>({});

  useEffect(() => {
    const initial: Record<string, ScheduleForm> = {};
    userSupplements.forEach((s) => {
      initial[s.id] = { time: s.time, days: [...s.days] };
    });
    setForms(initial);
  }, [userSupplements]);

  const handleTimeChange = (id: string, value: string) => {
    setForms((prev) => ({
      ...prev,
      [id]: { ...prev[id], time: value },
    }));
  };

  const toggleDay = (id: string, day: number) => {
    setForms((prev) => {
      const current = prev[id];
      const days = current.days.includes(day)
        ? current.days.filter((d) => d !== day)
        : [...current.days, day];
      return { ...prev, [id]: { ...current, days } };
    });
  };

  const handleSave = async (id: string) => {
    const data = forms[id];
    if (!data) return;
    await updateSupplement(id, { time: data.time, days: data.days });
  };

  const renderDay = (id: string, day: number, label: string) => (
    <TouchableOpacity
      key={day}
      style={[styles.day, forms[id]?.days.includes(day) && styles.dayActive]}
      onPress={() => toggleDay(id, day)}
    >
      <Text style={[styles.dayText, forms[id]?.days.includes(day) && styles.dayTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Programación</Text>
      {userSupplements.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aún no tienes suplementos</Text>
        </View>
      ) : (
        userSupplements.map((s) => (
          <View key={s.id} style={styles.item}>
            <Text style={styles.name}>{s.name}</Text>
            <Input
              label="Hora"
              value={forms[s.id]?.time}
              onChangeText={(v) => handleTimeChange(s.id, v)}
              containerStyle={styles.input}
            />
            <View style={styles.daysRow}>
              {[
                ['Dom', 0],
                ['Lun', 1],
                ['Mar', 2],
                ['Mié', 3],
                ['Jue', 4],
                ['Vie', 5],
                ['Sáb', 6],
              ].map(([l, d]) => renderDay(s.id, d as number, l as string))}
            </View>
            <Button title="Guardar" onPress={() => handleSave(s.id)} size="small" style={styles.saveBtn} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  empty: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, fontSize: 16 },
  item: { backgroundColor: colors.card, padding: 16, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 },
  input: { marginBottom: 12 },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  day: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { color: colors.textSecondary, fontSize: 14 },
  dayTextActive: { color: '#fff' },
  saveBtn: { alignSelf: 'flex-start' },
});
