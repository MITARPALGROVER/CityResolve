import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { StatusBadge } from '../components/ui/StatusBadge';
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
import { MapPin, ThumbsUp, MessageCircle, ArrowLeft, Shield } from 'lucide-react';

export const IssueDetail: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load issue');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function onAdminStatusChange(nextStatus: 'pending' | 'inprogress' | 'resolved' | 'rejected') {
    if (!id || !issue) return;
    try {
      const res = await apiAdminPatchIssue(id, { status: nextStatus });
      setIssue(res.issue);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  }

  if (loading) {
    return <div className="text-text-muted">Loading…</div>;
  }

  if (!issue) {
    return <div className="text-text-muted">Issue not found.</div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <Link to="/issues" className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-gray-900">
          <ArrowLeft size={16} /> Back to issues
        </Link>
        <div className="text-xs text-text-muted font-mono">{timeAgo(issue.createdAt)}</div>
      </div>

      {error && (
        <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <GlassCard elevated className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{issue.title}</h1>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
              <MapPin size={12} />
              <span className="truncate">{issue.addressLabel || 'Location provided'}</span>
              {coords && (
                <span className="text-gray-300">·</span>
              )}
              {coords && (
                <span className="font-mono text-[10px]">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={issue.status} />
            {isAdmin && (
              <div className="flex items-center gap-2 text-xs">
                <Shield size={14} className="text-text-muted" />
                <select
                  value={issue.status}
                  onChange={(e) => onAdminStatusChange(e.target.value as any)}
                  className="text-xs rounded-lg px-2 py-1 border border-gray-200 bg-gray-50"
                >
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {issue.description && (
          <p className="text-sm text-text-secondary leading-relaxed mt-4">{issue.description}</p>
        )}

        {issue.photoUrls?.length > 0 && (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {issue.photoUrls.map((url) => (
              <a key={url} href={url} target="_blank" rel="noreferrer" className="block rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={url} alt="Issue" className="w-full h-28 object-cover" />
              </a>
            ))}
          </div>
        )}

        <div className="h-px bg-gray-100 my-6" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <button onClick={onUpvote} className="inline-flex items-center gap-2 hover:text-gray-900 transition-colors">
              <ThumbsUp size={16} /> {issue.upvoteCount}
            </button>
            <span className="inline-flex items-center gap-2">
              <MessageCircle size={16} /> {issue.commentCount}
            </span>
          </div>
        </div>
      </GlassCard>

      <GlassCard elevated className="p-6">
        <h2 className="text-lg font-bold text-gray-900">Comments</h2>

        <form onSubmit={onSubmitComment} className="mt-4 flex gap-3">
          <input
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-xl"
            placeholder="Add a comment…"
          />
          <button
            disabled={submittingComment}
            className="px-5 py-3 rounded-xl bg-primary-green text-background font-semibold hover:bg-accent-lime transition-colors disabled:opacity-60"
          >
            {submittingComment ? 'Posting…' : 'Post'}
          </button>
        </form>

        <div className="mt-5 space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-text-muted">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    {typeof c.authorId === 'string' ? 'Citizen' : c.authorId.name}
                  </p>
                  <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">{timeAgo(c.createdAt)}</p>
                </div>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};
