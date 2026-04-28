import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  apiAdminPatchIssue,
  apiCreateComment,
  apiGetIssue,
  apiListComments,
  apiUpvoteIssue,
  ApiError,
  Comment,
  Issue,
} from '../lib/api';
import { timeAgo } from '../lib/time';
import {
  ArrowLeft,
  Building2,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Shield,
  ThumbsUp,
  TriangleAlert,
  Wrench,
} from 'lucide-react';

const categoryMeta = {
  road: { label: 'Roads & Traffic', color: '#f97316', bg: '#fff1e8' },
  water: { label: 'Water & Plumbing', color: '#3b82f6', bg: '#eff6ff' },
  light: { label: 'Streetlights', color: '#eab308', bg: '#fff8e1' },
  waste: { label: 'Waste Management', color: '#16a34a', bg: '#ecfdf5' },
  park: { label: 'Parks & Trees', color: '#22c55e', bg: '#f0fdf4' },
  other: { label: 'Other', color: '#6b7280', bg: '#f3f4f6' },
} as const;

const severityMeta = {
  low: 'bg-[#eff6ff] text-[#2563eb]',
  medium: 'bg-[#fff8e1] text-[#d97706]',
  high: 'bg-[#fff7ed] text-[#ea580c]',
  critical: 'bg-[#fef2f2] text-[#dc2626]',
} as const;

const statusMeta = {
  pending: 'bg-[#fff8e1] text-[#d97706]',
  inprogress: 'bg-[#eff6ff] text-[#2563eb]',
  resolved: 'bg-[#f0fdf4] text-[#16a34a]',
  rejected: 'bg-[#fef2f2] text-[#dc2626]',
} as const;

export const IssueDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [savingAdmin, setSavingAdmin] = useState(false);
  const [adminStatus, setAdminStatus] = useState<Issue['status']>('pending');
  const [adminDepartment, setAdminDepartment] = useState('');
  const [adminProgress, setAdminProgress] = useState(15);

  const isAdmin = user?.role === 'admin';

  const coords = useMemo(() => {
    if (!issue) return null;
    const [lng, lat] = issue.location.coordinates;
    return { lat, lng };
  }, [issue]);

  async function refresh() {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [issueRes, commentsRes] = await Promise.all([apiGetIssue(id), apiListComments(id)]);
      setIssue(issueRes.issue);
      setComments(commentsRes.comments);
      setAdminStatus(issueRes.issue.status);
      setAdminDepartment(issueRes.issue.assignedDepartment || '');
      setAdminProgress(issueRes.issue.progressPercent || 15);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load issue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, [id]);

  async function onUpvote() {
    if (!id || !issue) return;
    try {
      const res = await apiUpvoteIssue(id);
      setIssue({ ...issue, upvoteCount: res.upvoteCount });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Upvote failed');
    }
  }

  async function onSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !commentBody.trim()) return;
    setSubmittingComment(true);
    try {
      await apiCreateComment(id, commentBody.trim());
      setCommentBody('');
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Comment failed');
    } finally {
      setSubmittingComment(false);
    }
  }

  async function onSaveAdmin() {
    if (!id || !issue) return;
    setSavingAdmin(true);
    try {
      const res = await apiAdminPatchIssue(id, {
        status: adminStatus,
        assignedDepartment: adminDepartment.trim(),
        progressPercent: adminProgress,
      });
      setIssue(res.issue);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    } finally {
      setSavingAdmin(false);
    }
  }

  if (loading) return <div className="text-sm text-[var(--color-text-muted)]">Loading issue details...</div>;
  if (!issue) return <div className="text-sm text-[var(--color-text-muted)]">Issue not found.</div>;

  const category = categoryMeta[issue.category];

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center justify-between">
        <Link to="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
          <ArrowLeft size={16} /> Back to issues
        </Link>
        <div className="text-xs font-medium text-[var(--color-text-muted)]">{timeAgo(issue.createdAt)}</div>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#dc2626]">
          {error}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <article className="app-card p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="pill-badge" style={{ background: category.bg, color: category.color }}>{category.label}</span>
                  <span className={`pill-badge ${statusMeta[issue.status]}`}>{issue.status === 'inprogress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</span>
                  <span className={`pill-badge ${severityMeta[issue.severity]}`}>{issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}</span>
                </div>
                <h1 className="text-3xl font-extrabold leading-tight">{issue.title}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                  <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {issue.addressLabel || 'Location provided'}</span>
                  {coords && <span className="font-mono text-xs">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>}
                </div>
                <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)]">{issue.description || 'No description added yet.'}</p>
              </div>
              <div className="rounded-2xl bg-[var(--color-bg-card-alt)] px-4 py-3 text-sm">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Issue Progress</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--color-green-primary)]">{issue.progressPercent || 15}%</p>
                <div className="mt-3 h-2 rounded-full bg-[#d8e4d5]">
                  <div className="h-full rounded-full bg-[#0D3A1D]" style={{ width: `${issue.progressPercent || 15}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <button onClick={onUpvote} className="app-card flex items-center justify-center gap-2 p-4 text-sm font-semibold">
                <ThumbsUp size={16} /> {issue.upvoteCount} Upvotes
              </button>
              <div className="app-card flex items-center justify-center gap-2 p-4 text-sm font-semibold">
                <MessageCircle size={16} /> {issue.commentCount} Comments
              </div>
              <div className="app-card flex items-center justify-center gap-2 p-4 text-sm font-semibold">
                <Building2 size={16} /> {issue.assignedDepartment || 'Unassigned'}
              </div>
            </div>

            {issue.photoUrls?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--color-text-primary)]">
                  <ImageIcon size={16} /> Evidence Photos
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {issue.photoUrls.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)]">
                      <img src={url} alt="Issue" className="h-32 w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </article>

          <article className="app-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-[var(--color-green-primary)]" />
              <h2 className="text-xl font-bold">Comments</h2>
            </div>

            <form onSubmit={onSubmitComment} className="flex gap-3">
              <input
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="flex-1 px-4 py-3 text-sm"
                placeholder="Add a comment..."
              />
              <button
                disabled={submittingComment}
                className="primary-button px-5 py-3 text-sm font-semibold disabled:opacity-60"
              >
                {submittingComment ? 'Posting...' : 'Post'}
              </button>
            </form>

            <div className="mt-5 space-y-3">
              {comments.length === 0 ? (
                <div className="rounded-2xl bg-[var(--color-bg-card-alt)] px-4 py-5 text-sm text-[var(--color-text-muted)]">
                  No comments yet. Be the first to add context for the city team.
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="rounded-2xl border border-black/5 bg-[var(--color-bg-card-alt)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {typeof comment.authorId === 'string' ? 'Citizen' : comment.authorId.name}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)]">{timeAgo(comment.createdAt)}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">{comment.body}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        <div className="space-y-5">
          <article className="app-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-[var(--color-green-primary)]" />
              <h2 className="text-xl font-bold">Issue Tracking</h2>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Workflow Status</p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">{issue.status === 'inprogress' ? 'In Progress' : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Assigned Department</p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">{issue.assignedDepartment || 'Not assigned yet'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Current Progress</p>
                <p className="mt-1 font-semibold text-[var(--color-text-primary)]">{issue.progressPercent || 15}% completed</p>
                <div className="mt-2 h-2 rounded-full bg-[#d8e4d5]">
                  <div className="h-full rounded-full bg-[#0D3A1D]" style={{ width: `${issue.progressPercent || 15}%` }} />
                </div>
              </div>
            </div>
          </article>

          {isAdmin && (
            <article className="app-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Shield size={18} className="text-[var(--color-green-primary)]" />
                <h2 className="text-xl font-bold">Authority Controls</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Status</label>
                  <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value as Issue['status'])} className="w-full px-4 py-3 text-sm">
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Assigned Department</label>
                  <input value={adminDepartment} onChange={(e) => setAdminDepartment(e.target.value)} className="w-full px-4 py-3 text-sm" placeholder="e.g. Public Works Department" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Progress Percentage</label>
                  <input type="range" min="0" max="100" value={adminProgress} onChange={(e) => setAdminProgress(Number(e.target.value))} className="w-full" />
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">0%</span>
                    <strong className="text-[var(--color-green-primary)]">{adminProgress}%</strong>
                    <span className="text-[var(--color-text-muted)]">100%</span>
                  </div>
                </div>
                <button onClick={onSaveAdmin} disabled={savingAdmin} className="primary-button w-full px-4 py-3 text-sm font-semibold disabled:opacity-60">
                  {savingAdmin ? 'Saving...' : 'Save Issue Updates'}
                </button>
              </div>
            </article>
          )}

          <article className="app-card p-6">
            <div className="mb-4 flex items-center gap-2">
              <TriangleAlert size={18} className="text-[var(--color-green-primary)]" />
              <h2 className="text-xl font-bold">Location Snapshot</h2>
            </div>
            <div className="rounded-2xl border border-[#dbe7d7] bg-[linear-gradient(135deg,#eff6ee_0%,#f9fbf8_100%)] p-4">
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{issue.addressLabel}</p>
              {coords && <p className="mt-2 font-mono text-xs text-[var(--color-text-muted)]">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>}
              <div className="mt-4 h-32 rounded-2xl border border-[#dbe7d7] bg-[radial-gradient(circle_at_35%_35%,rgba(76,175,125,0.14),transparent_22%),linear-gradient(90deg,rgba(13,58,29,0.06)_1px,transparent_1px),linear-gradient(rgba(13,58,29,0.06)_1px,transparent_1px)] bg-[length:100%_100%,38px_38px,38px_38px]">
                <div className="relative h-full w-full">
                  <div className="absolute left-[48%] top-[40%] h-4 w-4 rounded-full border-2 border-white bg-[#0D3A1D] shadow-md" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
