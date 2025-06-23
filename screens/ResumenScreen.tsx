import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import AdherenceChart from '@/components/AdherenceChart';
import { colors } from '@/constants/colors';
import {
  generateWeeklyReport,
  saveWeeklyReport,
  getLastWeeklyReports,
  WeeklyReport,
} from '@/lib/weeklyReport';

export default function ResumenScreen() {
  const { user } = useAuthStore();
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [previous, setPrevious] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setLoading(true);
      const reports = await getLastWeeklyReports(user.id, 2);
      let latest = reports[0] || null;
      let prev = reports[1] || null;

      const now = new Date();
      const diff = now.getDay();
      const lastSunday = new Date(now);
      lastSunday.setDate(now.getDate() - diff);
      lastSunday.setHours(23, 59, 59, 999);
      const lastEnd = lastSunday.toISOString().split('T')[0];

      if (!latest || latest.endDate !== lastEnd) {
        const newReport = await generateWeeklyReport(user.id);
        await saveWeeklyReport(user.id, newReport);
        prev = latest;
        latest = newReport;
      }

      setReport(latest);
      setPrevious(prev);
      setLoading(false);
    }
    load();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Inicia sesión para ver tu resumen.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Aún no hay datos suficientes. ¡Empieza a registrar tus tomas!
        </Text>
      </View>
    );
  }

  const improvement = previous
    ? report.adherenceRate - previous.adherenceRate
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumen Semanal</Text>

      <AdherenceChart rate={report.adherenceRate} size="large" />
      <Text style={styles.stat}>
        Programadas: {report.totalScheduled}
      </Text>
      <Text style={styles.stat}>Tomadas: {report.totalTaken}</Text>
      <Text style={styles.stat}>Puntos ganados: {report.pointsGained}</Text>

      {improvement > 0 && (
        <Text style={styles.highlight}>
          ¡Mejoraste {improvement.toFixed(1)}% respecto a la semana anterior!
        </Text>
      )}

      {report.worstSupplements.length > 0 && (
        <View style={styles.worstSection}>
          <Text style={styles.subtitle}>Suplementos con peor adherencia</Text>
          {report.worstSupplements.map((s) => (
            <Text key={s.id} style={styles.worstItem}>
              {s.name} - {s.adherence.toFixed(0)}%
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  stat: { fontSize: 16, color: colors.text, marginTop: 8 },
  highlight: { fontSize: 16, color: colors.success, marginTop: 12, textAlign: 'center' },
  message: { fontSize: 16, color: colors.text, textAlign: 'center', marginTop: 32 },
  subtitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginTop: 24 },
  worstSection: { width: '100%', marginTop: 16 },
  worstItem: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});
