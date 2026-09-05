import React, { useState, useEffect } from 'react';
import { PaperSubmission, PaperComment, User } from '../types';
import {
  fetchPaperSubmissions,
  createPaperSubmission,
  fetchPaperComments,
  addPaperComment,
  subscribeSupabaseTable,
} from '../lib/supabase';
import {
  FileText,
  MessageSquare,
  Send,
  Plus,
  Clock,
  User as UserIcon,
  Tag,
  CheckCircle,
  Database,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PapersSectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const PapersSection: React.FC<PapersSectionProps> = ({ currentUser, onOpenAuth }) => {
  const [papers, setPapers] = useState<PaperSubmission[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, PaperComment[]>>({});
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingPaper, setIsSubmittingPaper] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [authors, setAuthors] = useState(currentUser?.fullName || '');
  const [category, setCategory] = useState('FinTech & AI Economics');
  const [fileUrl, setFileUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadPapers();

    // Subscribe to realtime changes on paper_submissions and paper_comments
    const unsubPapers = subscribeSupabaseTable('paper_submissions', () => {
      loadPapers();
    });

    const unsubComments = subscribeSupabaseTable('paper_comments', (payload) => {
      if (payload?.new?.paper_id) {
        loadComments(payload.new.paper_id);
      }
    });

    return () => {
      unsubPapers();
      unsubComments();
    };
  }, []);

  const loadPapers = async () => {
    const list = await fetchPaperSubmissions();
    if (list.length > 0) {
      setPapers(list);
    } else {
      // Provide initial default academic samples if empty
      setPapers([
        {
          id: 'p-1',
          title: 'Real-Time Dynamic Budget Optimization Using Predictive Financial Time Series',
          abstract:
            'This paper presents a robust architecture for personal finance management using client-side streaming and Postgres-backed transaction reconciliation. Empirical tests demonstrate a 32% increase in savings retention among active users.',
          authors: 'Dr. R. Verma, Prof. A. Mehta',
          category: 'FinTech & AI Economics',
          status: 'accepted',
          submittedById: 'u-admin',
          submittedByName: 'Dr. R. Verma',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'p-2',
          title: 'Decentralized Micro-Savings and UPI Settlement Latency in Emerging Markets',
          abstract:
            'An exploratory analysis of automated micro-deposit mechanisms integrated with national real-time payment interfaces such as UPI.',
          authors: 'Kunal Patel, Sneha Roy',
          category: 'Algorithmic Finance',
          status: 'under_review',
          submittedById: 'u-user2',
          submittedByName: 'Kunal Patel',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }
  };

  const loadComments = async (paperId: string) => {
    const comments = await fetchPaperComments(paperId);
    setCommentsMap((prev) => ({ ...prev, [paperId]: comments }));
  };

  const toggleExpand = (paperId: string) => {
    if (selectedPaperId === paperId) {
      setSelectedPaperId(null);
    } else {
      setSelectedPaperId(paperId);
      loadComments(paperId);
    }
  };

  const handleSubmitPaper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!title.trim() || !abstract.trim() || !authors.trim()) return;

    setIsPosting(true);
    try {
      const newPaper = await createPaperSubmission({
        title: title.trim(),
        abstract: abstract.trim(),
        authors: authors.trim(),
        category,
        status: 'submitted',
        fileUrl: fileUrl.trim() || undefined,
        submittedById: String(currentUser.id),
        submittedByName: currentUser.fullName,
      });

      setPapers((prev) => [newPaper, ...prev]);
      setTitle('');
      setAbstract('');
      setFileUrl('');
      setIsSubmittingPaper(false);
      setNotification('Paper submitted successfully to the Supabase database!');
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      console.error('Paper submit failed:', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handlePostComment = async (paperId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newCommentText.trim()) return;

    const text = newCommentText.trim();
    setNewCommentText('');

    const newComment = await addPaperComment(
      paperId,
      String(currentUser.id),
      currentUser.fullName,
      text
    );

    setCommentsMap((prev) => ({
      ...prev,
      [paperId]: [...(prev[paperId] || []), newComment],
    }));
  };

  const copySqlScript = () => {
    const sql = `-- Supabase Real-Time Schema
CREATE TABLE IF NOT EXISTS public.paper_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  authors TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'FinTech & AI',
  status TEXT NOT NULL DEFAULT 'submitted',
  file_url TEXT,
  submitted_by_id TEXT NOT NULL,
  submitted_by_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.paper_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_id UUID REFERENCES public.paper_submissions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.paper_comments;`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase">
            <Database className="w-4 h-4" />
            <span>Supabase Connected &bull; retgzieuiziyhtfjnpah</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Research Papers & Peer Review
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Submit academic papers, discuss research insights, and comment in real time via Supabase PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copySqlScript}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
            title="Copy Supabase SQL Schema to Clipboard"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied SQL!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>SQL Schema</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                setIsSubmittingPaper((prev) => !prev);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Paper</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Submission Form Modal/Panel */}
      {isSubmittingPaper && (
        <form
          onSubmit={handleSubmitPaper}
          className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-900/90 border border-emerald-500/30 shadow-md space-y-4 transition-all"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Submit Academic Paper</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsSubmittingPaper(false)}
              className="text-xs font-semibold text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Paper Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real-Time Financial Reconciliations with PostgreSQL"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Authors *
                </label>
                <input
                  type="text"
                  required
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="e.g. Priya Sharma, Prof. Mehta"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="FinTech & AI Economics">FinTech & AI Economics</option>
                  <option value="Algorithmic Finance">Algorithmic Finance</option>
                  <option value="Distributed Ledger Systems">Distributed Ledger Systems</option>
                  <option value="Behavioral Micro-Economics">Behavioral Micro-Economics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Abstract *
              </label>
              <textarea
                required
                rows={3}
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                placeholder="Comprehensive summary of research findings, methodology, and empirical results..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Manuscript / PDF Link (Optional)
              </label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://example.com/papers/my-paper.pdf"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmittingPaper(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPosting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer disabled:opacity-50"
            >
              {isPosting ? 'Submitting to Supabase...' : 'Publish Submission'}
            </button>
          </div>
        </form>
      )}

      {/* Submissions List */}
      <div className="space-y-4">
        {papers.map((paper) => {
          const isExpanded = selectedPaperId === paper.id;
          const comments = commentsMap[paper.id] || [];

          return (
            <div
              key={paper.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs transition-all hover:border-stone-300 dark:hover:border-stone-700"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Tag className="w-3 h-3" />
                      {paper.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        paper.status === 'accepted'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200'
                          : paper.status === 'under_review'
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {paper.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    {paper.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3.5 h-3.5 text-stone-400" />
                      {paper.authors}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {new Date(paper.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpand(paper.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer self-start"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Comments {comments.length > 0 && `(${comments.length})`}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Abstract */}
              <p className="mt-3 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed bg-stone-50/70 dark:bg-stone-950/50 p-3.5 rounded-2xl border border-stone-100 dark:border-stone-800/80">
                {paper.abstract}
              </p>

              {/* Collapsible Comments Section */}
              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Peer Discussion & Comments</span>
                    </h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Real-time synced
                    </span>
                  </div>

                  {/* Comment List */}
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-stone-400 italic py-2">
                        No peer reviews or comments yet. Be the first to share feedback!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {comment.userName}
                            </span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-stone-700 dark:text-stone-300 leading-normal">
                            {comment.commentText}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePostComment(paper.id);
                        }
                      }}
                      placeholder={
                        currentUser
                          ? `Comment as ${currentUser.fullName}...`
                          : 'Sign in to participate in discussion'
                      }
                      className="flex-1 px-3 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handlePostComment(paper.id)}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shrink-0"
                      title="Post Comment"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
