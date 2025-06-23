import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSupplement, Schedule, Intake } from "@/types";
import { userSupplements } from "@/mocks/users";

interface SupplementState {
  userSupplements: UserSupplement[];
  intakes: Intake[];
  isLoading: boolean;
  error: string | null;
  
  // Gestión de suplementos
  addUserSupplement: (supplement: UserSupplement) => void;
  updateUserSupplement: (id: string, data: Partial<UserSupplement>) => void;
  removeUserSupplement: (id: string) => void;
  
  // Gestión de horarios
  addSchedule: (userSupplementId: string, schedule: Schedule) => void;
  updateSchedule: (userSupplementId: string, scheduleId: string, data: Partial<Schedule>) => void;
  removeSchedule: (userSupplementId: string, scheduleId: string) => void;
  
  // Seguimiento de tomas
  recordIntake: (intake: Intake) => void;
  getAdherenceRate: (userSupplementId: string, days?: number) => number;
  
  // Gestión de inventario
  decrementPills: (userSupplementId: string, amount: number) => void;
  resetPills: (userSupplementId: string, newTotal: number) => void;
  getLowStockSupplements: () => UserSupplement[];
}

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set, get) => ({
      userSupplements: [...userSupplements],
      intakes: [],
      isLoading: false,
      error: null,
      
      addUserSupplement: (supplement) => {
        set(state => ({
          userSupplements: [...state.userSupplements, supplement]
        }));
      },
      
      updateUserSupplement: (id, data) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === id ? { ...supp, ...data } : supp
          )
        }));
      },
      
      removeUserSupplement: (id) => {
        set(state => ({
          userSupplements: state.userSupplements.filter(supp => supp.id !== id)
        }));
      },
      
      addSchedule: (userSupplementId, schedule) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === userSupplementId 
              ? { ...supp, schedule: [...supp.schedule, schedule] } 
              : supp
          )
        }));
      },
      
      updateSchedule: (userSupplementId, scheduleId, data) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === userSupplementId 
              ? { 
                  ...supp, 
                  schedule: supp.schedule.map(sched => 
                    sched.id === scheduleId ? { ...sched, ...data } : sched
                  ) 
                } 
              : supp
          )
        }));
      },
      
      removeSchedule: (userSupplementId, scheduleId) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === userSupplementId 
              ? { 
                  ...supp, 
                  schedule: supp.schedule.filter(sched => sched.id !== scheduleId) 
                } 
              : supp
          )
        }));
      },
      
      recordIntake: (intake) => {
        set(state => ({
          intakes: [...state.intakes, intake]
        }));
        
        // Si se tomó, decrementar el recuento de píldoras
        if (intake.taken) {
          const supplement = get().userSupplements.find(s => s.id === intake.userSupplementId);
          if (supplement) {
            const schedule = supplement.schedule.find(s => s.id === intake.scheduleId);
            if (schedule) {
              get().decrementPills(intake.userSupplementId, schedule.dosage);
            }
          }
        }
      },
      
      getAdherenceRate: (userSupplementId, days = 7) => {
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - days);
        
        const supplement = get().userSupplements.find(s => s.id === userSupplementId);
        if (!supplement) return 0;
        
        const relevantIntakes = get().intakes.filter(intake => 
          intake.userSupplementId === userSupplementId &&
          new Date(intake.timestamp) >= startDate
        );
        
        const takenCount = relevantIntakes.filter(intake => intake.taken).length;
        const totalScheduled = supplement.schedule.length * days;
        
        return totalScheduled > 0 ? (takenCount / totalScheduled) * 100 : 0;
      },
      
      decrementPills: (userSupplementId, amount) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === userSupplementId 
              ? { 
                  ...supp, 
                  pillsRemaining: Math.max(0, supp.pillsRemaining - amount) 
                } 
              : supp
          )
        }));
      },
      
      resetPills: (userSupplementId, newTotal) => {
        set(state => ({
          userSupplements: state.userSupplements.map(supp => 
            supp.id === userSupplementId 
              ? { 
                  ...supp, 
                  pillsRemaining: newTotal,
                  totalPills: newTotal
                } 
              : supp
          )
        }));
      },
      
      getLowStockSupplements: () => {
        return get().userSupplements.filter(supp => 
          (supp.pillsRemaining / supp.totalPills) * 100 <= 15
        );
      }
    }),
    {
      name: "supplement-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
