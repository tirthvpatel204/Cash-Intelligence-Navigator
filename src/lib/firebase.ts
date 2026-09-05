import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Transaction, Budget, SavingsGoal, User } from '../types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_GOALS } from '../data/mockData';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Authentication Helpers
export async function registerWithEmail(email: string, pass: string, fullName: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (cred.user) {
    await updateProfile(cred.user, { displayName: fullName });
    // Also save user profile record in Firestore
    try {
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid,
        email: cred.user.email,
        fullName: fullName,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not write user profile to firestore:', err);
    }
    return {
      id: cred.user.uid,
      fullName: fullName,
      email: cred.user.email || email,
    };
  }
  throw new Error('Registration failed');
}

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return {
    id: cred.user.uid,
    fullName: cred.user.displayName || email.split('@')[0],
    email: cred.user.email || email,
  };
}

export async function loginWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const cred = await signInWithPopup(auth, provider);
  if (cred.user) {
    const fullName =
      cred.user.displayName || cred.user.email?.split('@')[0] || 'Google User';
    try {
      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          id: cred.user.uid,
          email: cred.user.email,
          fullName: fullName,
          photoURL: cred.user.photoURL || null,
          provider: 'google.com',
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Could not save user profile to firestore:', err);
    }
    return {
      id: cred.user.uid,
      fullName: fullName,
      email: cred.user.email || 'user@google.com',
    };
  }
  throw new Error('Google Sign-In was not completed');
}

export async function loginAnonymously(): Promise<User> {
  const cred = await signInAnonymously(auth);
  return {
    id: cred.user.uid,
    fullName: 'Guest User',
    email: 'guest@fintech.local',
  };
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      callback({
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
        email: firebaseUser.email || 'guest@fintech.local',
      });
    } else {
      callback(null);
    }
  });
}

// Real-time Firestore Sync - Transactions
export function subscribeTransactions(
  userId: string | number,
  onData: (transactions: Transaction[]) => void
) {
  const q = query(collection(db, 'transactions'), where('userId', '==', String(userId)));
  return onSnapshot(
    q,
    (snapshot) => {
      const txs: Transaction[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        txs.push({
          id: d.id,
          userId: data.userId,
          type: data.type,
          category: data.category,
          amount: Number(data.amount) || 0,
          paymentMethod: data.paymentMethod,
          transactionDate: data.transactionDate,
          description: data.description || '',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      // Sort newest first
      txs.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
      onData(txs);
    },
    (err) => {
      console.warn('Firestore transactions notice (using local state fallback):', err.message);
    }
  );
}

export async function addTransaction(
  txData: Omit<Transaction, 'id' | 'createdAt'>
): Promise<string> {
  const colRef = collection(db, 'transactions');
  const res = await addDoc(colRef, {
    ...txData,
    userId: String(txData.userId),
    amount: Number(txData.amount),
    createdAt: new Date().toISOString(),
  });
  return res.id;
}

export async function deleteTransaction(txId: string | number): Promise<void> {
  const docRef = doc(db, 'transactions', String(txId));
  await deleteDoc(docRef);
}

export async function clearAllUserTransactions(userId: string | number): Promise<void> {
  const q = query(collection(db, 'transactions'), where('userId', '==', String(userId)));
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  snapshot.forEach((d) => {
    batch.delete(d.ref);
  });
  await batch.commit();
}

// Real-time Firestore Sync - Budgets
export function subscribeBudgets(
  userId: string | number,
  onData: (budgets: Budget[]) => void
) {
  const q = query(collection(db, 'budgets'), where('userId', '==', String(userId)));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: Budget[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          userId: data.userId,
          category: data.category,
          monthYear: data.monthYear,
          allocatedAmount: Number(data.allocatedAmount) || 0,
        });
      });
      onData(list);
    },
    (err) => {
      console.warn('Firestore budgets notice (using local state fallback):', err.message);
    }
  );
}

export async function saveOrUpdateBudget(
  userId: string | number,
  category: string,
  allocatedAmount: number,
  monthYear = '2026-09'
): Promise<void> {
  const q = query(
    collection(db, 'budgets'),
    where('userId', '==', String(userId)),
    where('category', '==', category)
  );
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docToUpdate = snapshot.docs[0];
    await updateDoc(docToUpdate.ref, { allocatedAmount });
  } else {
    await addDoc(collection(db, 'budgets'), {
      userId: String(userId),
      category,
      allocatedAmount,
      monthYear,
      createdAt: new Date().toISOString(),
    });
  }
}

export async function deleteBudget(budgetId: string | number): Promise<void> {
  await deleteDoc(doc(db, 'budgets', String(budgetId)));
}

// Real-time Firestore Sync - Savings Goals
export function subscribeGoals(
  userId: string | number,
  onData: (goals: SavingsGoal[]) => void
) {
  const q = query(collection(db, 'goals'), where('userId', '==', String(userId)));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: SavingsGoal[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          userId: data.userId,
          goalName: data.goalName,
          targetAmount: Number(data.targetAmount) || 0,
          currentAmount: Number(data.currentAmount) || 0,
          targetDate: data.targetDate || '',
          status: data.status || 'in_progress',
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      onData(list);
    },
    (err) => {
      console.warn('Firestore goals notice (using local state fallback):', err.message);
    }
  );
}

export async function addGoalDeposit(
  goalId: string | number,
  depositAmount: number,
  targetAmount: number,
  currentAmount: number
): Promise<void> {
  const newCurrent = currentAmount + depositAmount;
  const status = newCurrent >= targetAmount ? 'completed' : 'in_progress';
  await updateDoc(doc(db, 'goals', String(goalId)), {
    currentAmount: newCurrent,
    status,
  });
}

// Seed workshop sample records directly into Firestore
export async function seedWorkshopToFirestore(userId: string | number): Promise<void> {
  const batch = writeBatch(db);
  const uIdStr = String(userId);

  // Seed transactions
  for (const t of INITIAL_TRANSACTIONS) {
    const txRef = doc(collection(db, 'transactions'));
    batch.set(txRef, {
      userId: uIdStr,
      type: t.type,
      category: t.category,
      amount: t.amount,
      paymentMethod: t.paymentMethod,
      transactionDate: t.transactionDate,
      description: t.description,
      createdAt: new Date().toISOString(),
    });
  }

  // Seed initial budgets if needed
  for (const b of INITIAL_BUDGETS) {
    const bRef = doc(collection(db, 'budgets'));
    batch.set(bRef, {
      userId: uIdStr,
      category: b.category,
      allocatedAmount: b.allocatedAmount,
      monthYear: b.monthYear,
      createdAt: new Date().toISOString(),
    });
  }

  // Seed initial goals if needed
  for (const g of INITIAL_GOALS) {
    const gRef = doc(collection(db, 'goals'));
    batch.set(gRef, {
      userId: uIdStr,
      goalName: g.goalName,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      targetDate: g.targetDate,
      status: g.status,
      createdAt: new Date().toISOString(),
    });
  }

  await batch.commit();
}
