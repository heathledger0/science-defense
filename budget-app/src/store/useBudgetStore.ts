import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Budget, CardEntry, Entry } from '../types';

interface BudgetState {
  entries: Entry[];
  budgets: Budget[];
  cardEntries: CardEntry[];

  addEntry: (entry: Omit<Entry, 'id'>) => void;
  updateEntry: (id: string, patch: Omit<Entry, 'id'>) => void;
  removeEntry: (id: string) => void;

  setBudget: (categoryId: string, year: number, month: number, amount: number) => void;

  addCardEntry: (entry: Omit<CardEntry, 'id'>) => void;
  updateCardEntry: (id: string, patch: Omit<CardEntry, 'id'>) => void;
  removeCardEntry: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      entries: [],
      budgets: [],
      cardEntries: [],

      addEntry: (entry) =>
        set((state) => ({ entries: [...state.entries, { ...entry, id: uuid() }] })),
      updateEntry: (id, patch) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...patch, id } : e)),
        })),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      setBudget: (categoryId, year, month, amount) =>
        set((state) => {
          const existing = state.budgets.find(
            (b) => b.categoryId === categoryId && b.year === year && b.month === month,
          );
          if (existing) {
            return {
              budgets: state.budgets.map((b) =>
                b.id === existing.id ? { ...b, amount } : b,
              ),
            };
          }
          return {
            budgets: [...state.budgets, { id: uuid(), categoryId, year, month, amount }],
          };
        }),

      addCardEntry: (entry) =>
        set((state) => ({ cardEntries: [...state.cardEntries, { ...entry, id: uuid() }] })),
      updateCardEntry: (id, patch) =>
        set((state) => ({
          cardEntries: state.cardEntries.map((e) => (e.id === id ? { ...patch, id } : e)),
        })),
      removeCardEntry: (id) =>
        set((state) => ({ cardEntries: state.cardEntries.filter((e) => e.id !== id) })),
    }),
    { name: 'budget-app:v1' },
  ),
);
