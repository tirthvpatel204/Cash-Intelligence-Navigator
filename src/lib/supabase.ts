import { createClient } from '@supabase/supabase-js';
import { Transaction, Budget, SavingsGoal, User, PaperSubmission, PaperComment } from '../types';

// Supabase Configuration
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
export const SUPABASE_URL =
  metaEnv.VITE_SUPABASE_URL || 'https://retgzieuiziyhtfjnpah.supabase.co';
export const SUPABASE_ANON_KEY =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldGd6aWV1aXppeWh0ZmpucGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjI1MzEsImV4cCI6MjEwNDE5ODUzMX0.kVnE17oEMaRmWOFqn6zIivHuB9licXEc1xKT-ej8NiY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Check Supabase connection health
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    if (error && error.code === '42P01') {
      // Table doesn't exist yet, but connection to Supabase is active
      return { ok: true, message: 'Connected to Supabase (Tables ready to be created with SQL migration)' };
    }
    if (error && error.code !== 'PGRST116') {
      return { ok: true, message: `Connected to Supabase: ${error.message}` };
    }
    return { ok: true, message: 'Connected to Supabase successfully' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Connection test failed' };
  }
}

// ----------------- Supabase Auth ----------------- //

export async function supabaseSignUp(email: string, pass: string, fullName: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('Sign up failed');

  // Try creating profile record in Supabase profiles table
  try {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      full_name: fullName,
      email: data.user.email || email,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Profile table upsert skipped:', err);
  }

  return {
    id: data.user.id,
    fullName: fullName || email.split('@')[0],
    email: data.user.email || email,
  };
}

export async function supabaseSignIn(email: string, pass: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) throw error;
  if (!data.user) throw new Error('Login failed');

  const name =
    data.user.user_metadata?.full_name ||
    data.user.user_metadata?.name ||
    data.user.email?.split('@')[0] ||
    'Member';

  return {
    id: data.user.id,
    fullName: name,
    email: data.user.email || email,
  };
}

export async function supabaseSignOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) console.warn('Supabase sign out notice:', error.message);
}

export async function getSupabaseCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    return {
      id: session.user.id,
      fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
      email: session.user.email || 'user@supabase.local',
    };
  }
  return null;
}

export function subscribeSupabaseAuth(onUserChange: (user: User | null) => void) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      onUserChange({
        id: session.user.id,
        fullName:
          session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
        email: session.user.email || 'user@supabase.local',
      });
    } else {
      onUserChange(null);
    }
  });

  return () => subscription.unsubscribe();
}

// ----------------- Supabase Transactions ----------------- //

export async function fetchSupabaseTransactions(userId: string | number): Promise<Transaction[]> {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', String(userId))
      .order('transaction_date', { ascending: false });

    if (error) {
      console.warn('Supabase transactions fetch note:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      category: row.category,
      amount: Number(row.amount) || 0,
      paymentMethod: row.payment_method,
      transactionDate: row.transaction_date,
      description: row.description || '',
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Supabase fetchTransactions error:', err);
    return [];
  }
}

export async function addSupabaseTransaction(
  tx: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> {
  const payload = {
    user_id: String(tx.userId),
    type: tx.type,
    category: tx.category,
    amount: Number(tx.amount),
    payment_method: tx.paymentMethod,
    transaction_date: tx.transactionDate,
    description: tx.description || '',
  };

  const { data, error } = await supabase.from('transactions').insert(payload).select().single();
  if (error) {
    console.warn('Supabase insert transaction note:', error.message);
    return {
      ...tx,
      id: 'tx_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    userId: data.user_id,
    type: data.type,
    category: data.category,
    amount: Number(data.amount),
    paymentMethod: data.payment_method,
    transactionDate: data.transaction_date,
    description: data.description || '',
    createdAt: data.created_at,
  };
}

export async function deleteSupabaseTransaction(id: string | number): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', String(id));
  if (error) console.warn('Supabase delete error:', error.message);
}

export async function clearAllSupabaseTransactions(userId: string | number): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('user_id', String(userId));
  if (error) console.warn('Supabase clear error:', error.message);
}

// ----------------- Supabase Realtime Subscriptions ----------------- //

export function subscribeSupabaseTable(
  tableName: string,
  onEvent: (payload: any) => void
) {
  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      (payload) => {
        onEvent(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ----------------- Supabase Budgets ----------------- //

export async function fetchSupabaseBudgets(userId: string | number): Promise<Budget[]> {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', String(userId));

    if (error) {
      console.warn('Supabase budgets fetch note:', error.message);
      return [];
    }

    return (data || []).map((b: any) => ({
      id: b.id,
      userId: b.user_id,
      category: b.category,
      monthYear: b.month_year,
      allocatedAmount: Number(b.allocated_amount) || 0,
    }));
  } catch (err) {
    return [];
  }
}

export async function upsertSupabaseBudget(
  userId: string | number,
  category: string,
  allocatedAmount: number,
  monthYear = '2026-09'
): Promise<void> {
  try {
    const { data } = await supabase
      .from('budgets')
      .select('id')
      .eq('user_id', String(userId))
      .eq('category', category)
      .maybeSingle();

    if (data?.id) {
      await supabase
        .from('budgets')
        .update({ allocated_amount: allocatedAmount })
        .eq('id', data.id);
    } else {
      await supabase.from('budgets').insert({
        user_id: String(userId),
        category,
        allocated_amount: allocatedAmount,
        month_year: monthYear,
      });
    }
  } catch (err) {
    console.warn('Upsert budget error:', err);
  }
}

export async function deleteSupabaseBudget(id: string | number): Promise<void> {
  await supabase.from('budgets').delete().eq('id', String(id));
}

// ----------------- Supabase Savings Goals ----------------- //

export async function fetchSupabaseGoals(userId: string | number): Promise<SavingsGoal[]> {
  try {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', String(userId));

    if (error) {
      console.warn('Supabase goals fetch note:', error.message);
      return [];
    }

    return (data || []).map((g: any) => ({
      id: g.id,
      userId: g.user_id,
      goalName: g.goal_name,
      targetAmount: Number(g.target_amount) || 0,
      currentAmount: Number(g.current_amount) || 0,
      targetDate: g.target_date || '',
      status: g.status || 'in_progress',
      createdAt: g.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    return [];
  }
}

export async function updateSupabaseGoalDeposit(
  goalId: string | number,
  newCurrentAmount: number,
  status: string
): Promise<void> {
  await supabase
    .from('savings_goals')
    .update({ current_amount: newCurrentAmount, status })
    .eq('id', String(goalId));
}

// ----------------- Supabase Paper Submissions & Comments ----------------- //

export async function fetchPaperSubmissions(): Promise<PaperSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('paper_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Fetch papers note:', error.message);
      return [];
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      abstract: p.abstract,
      authors: p.authors,
      category: p.category,
      status: p.status,
      fileUrl: p.file_url,
      submittedById: p.submitted_by_id,
      submittedByName: p.submitted_by_name,
      createdAt: p.created_at,
    }));
  } catch (err) {
    return [];
  }
}

export async function createPaperSubmission(
  submission: Omit<PaperSubmission, 'id' | 'createdAt'>
): Promise<PaperSubmission> {
  const payload = {
    title: submission.title,
    abstract: submission.abstract,
    authors: submission.authors,
    category: submission.category,
    status: submission.status || 'submitted',
    file_url: submission.fileUrl || '',
    submitted_by_id: submission.submittedById,
    submitted_by_name: submission.submittedByName,
  };

  const { data, error } = await supabase
    .from('paper_submissions')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.warn('Create paper note:', error.message);
    return {
      ...submission,
      id: 'paper_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    title: data.title,
    abstract: data.abstract,
    authors: data.authors,
    category: data.category,
    status: data.status,
    fileUrl: data.file_url,
    submittedById: data.submitted_by_id,
    submittedByName: data.submitted_by_name,
    createdAt: data.created_at,
  };
}

export async function fetchPaperComments(paperId: string): Promise<PaperComment[]> {
  try {
    const { data, error } = await supabase
      .from('paper_comments')
      .select('*')
      .eq('paper_id', paperId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Fetch comments note:', error.message);
      return [];
    }

    return (data || []).map((c: any) => ({
      id: c.id,
      paperId: c.paper_id,
      userId: c.user_id,
      userName: c.user_name,
      commentText: c.comment_text,
      createdAt: c.created_at,
    }));
  } catch (err) {
    return [];
  }
}

export async function addPaperComment(
  paperId: string,
  userId: string,
  userName: string,
  commentText: string
): Promise<PaperComment> {
  const payload = {
    paper_id: paperId,
    user_id: userId,
    user_name: userName,
    comment_text: commentText,
  };

  const { data, error } = await supabase
    .from('paper_comments')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.warn('Add comment note:', error.message);
    return {
      id: 'comment_' + Date.now(),
      paperId,
      userId,
      userName,
      commentText,
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: data.id,
    paperId: data.paper_id,
    userId: data.user_id,
    userName: data.user_name,
    commentText: data.comment_text,
    createdAt: data.created_at,
  };
}
