import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { useCatalogStore } from '@/store/catalog-store';
import { CatalogSupplement } from '@/types';

const ADMIN_UID = 'admin-uid-placeholder';

export default function AdminPanel() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { catalog, subscribe, add, update, remove } = useCatalogStore();
  const [editing, setEditing] = useState<CatalogSupplement | null>(null);
  const [form, setForm] = useState<Omit<CatalogSupplement, 'id'>>({
    name: '',
    description: '',
    type: '',
    objectives: [],
    priceEstimate: 0,
    baseScore: 0,
  });

  useEffect(() => {
    if (!user || user.id !== ADMIN_UID) {
      router.replace('/');
    }
  }, [user]);

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, []);

  const startNew = () => {
    setEditing(null);
    setForm({ name: '', description: '', type: '', objectives: [], priceEstimate: 0, baseScore: 0 });
  };

  const startEdit = (s: CatalogSupplement) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description,
      type: s.type,
      objectives: s.objectives,
      priceEstimate: s.priceEstimate,
      baseScore: s.baseScore,
    });
  };

  const handleSave = async () => {
    if (editing) {
      await update(editing.id, { ...form });
    } else {
      await add(form);
    }
    startNew();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catálogo de Suplementos</Text>
      <Button title="Nuevo" onPress={startNew} style={styles.newBtn} />
      {(editing || form.name) && (
        <View style={styles.form}>
          <Input label="Nombre" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} />
          <Input label="Descripción" value={form.description} onChangeText={(t) => setForm({ ...form, description: t })} />
          <Input label="Tipo" value={form.type} onChangeText={(t) => setForm({ ...form, type: t })} />
          <Input label="Objetivos (coma separados)" value={form.objectives.join(',')} onChangeText={(t) => setForm({ ...form, objectives: t.split(',').map((v) => v.trim()).filter(Boolean) })} />
          <Input label="Precio Estimado" value={String(form.priceEstimate)} keyboardType="numeric" onChangeText={(t) => setForm({ ...form, priceEstimate: parseFloat(t) || 0 })} />
          <Input label="Base Score" value={String(form.baseScore)} keyboardType="numeric" onChangeText={(t) => setForm({ ...form, baseScore: parseFloat(t) || 0 })} />
          <Button title="Guardar" onPress={handleSave} style={styles.saveBtn} />
        </View>
      )}
      {catalog.map((c) => (
        <View key={c.id} style={styles.item}>
          <TouchableOpacity onPress={() => startEdit(c)}>
            <Text style={styles.name}>{c.name}</Text>
            <Text style={styles.desc}>{c.description}</Text>
          </TouchableOpacity>
          <View style={styles.actions}>
            <Button title="Editar" onPress={() => startEdit(c)} size="small" style={styles.actionBtn} />
            <Button title="Eliminar" onPress={() => handleDelete(c.id)} variant="danger" size="small" style={styles.actionBtn} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  item: { backgroundColor: colors.card, padding: 12, borderRadius: 8, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  desc: { fontSize: 14, color: colors.textSecondary },
  actions: { flexDirection: 'row', marginTop: 8 },
  actionBtn: { marginRight: 8 },
  form: { marginBottom: 16 },
  newBtn: { marginBottom: 16 },
  saveBtn: { marginTop: 8 },
});

