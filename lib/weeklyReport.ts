import { collection, doc, getDocs, setDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firestore';
import { UserSupplement } from '@/types';

export type WeeklyReport = {
  startDate: string;
  endDate: string;
  totalScheduled: number;
  totalTaken: number;
  adherenceRate: number;
  pointsGained: number;
  worstSupplements: { id: string; name: string; adherence: number }[];
};

export async function generateWeeklyReport(uid: string): Promise<WeeklyReport> {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const suppSnap = await getDocs(collection(db, `users/${uid}/supplements`));
  const supplements = suppSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as UserSupplement[];

  let totalScheduled = 0;
  let totalTaken = 0;
  const adherences: { id: string; name: string; adherence: number }[] = [];

  for (const s of supplements) {
    let scheduled = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (s.days.includes(d.getDay())) scheduled++;
    }
    const taken = (s.lastTakenAt || []).filter(t => {
      const ts = new Date(t);
      return ts >= start && ts <= end;
    }).length;

    totalScheduled += scheduled;
    totalTaken += Math.min(taken, scheduled);
    const adherence = scheduled ? (taken / scheduled) * 100 : 100;
    adherences.push({ id: s.id, name: s.name, adherence });
  }

  const pointsQ = query(
    collection(db, `users/${uid}/pointsHistory`),
    where('createdAt', '>=', start.toISOString()),
    where('createdAt', '<=', end.toISOString())
  );
  const pointsSnap = await getDocs(pointsQ);
  const pointsGained = pointsSnap.docs.reduce((sum, d) => sum + (d.data().value || 0), 0);

  adherences.sort((a, b) => a.adherence - b.adherence);
  const worstSupplements = adherences.filter(a => a.adherence < 100).slice(0, 3);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    totalScheduled,
    totalTaken,
    adherenceRate: totalScheduled ? (totalTaken / totalScheduled) * 100 : 0,
    pointsGained,
    worstSupplements,
  };
}

export async function saveWeeklyReport(uid: string, report: WeeklyReport) {
  await setDoc(doc(db, `users/${uid}/weeklyReports/${report.endDate}`), report);
}

export async function getLatestWeeklyReport(uid: string): Promise<WeeklyReport | null> {
  const list = await getLastWeeklyReports(uid, 1);
  return list[0] || null;
}

export async function getLastWeeklyReports(uid: string, count: number): Promise<WeeklyReport[]> {
  const q = query(
    collection(db, `users/${uid}/weeklyReports`),
    orderBy('endDate', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as WeeklyReport);
}
