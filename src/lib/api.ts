const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');

  const isFormData = typeof FormData !== 'undefined' && init?.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type') && init?.method && init.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(data?.error?.message || 'Request failed', res.status, data?.error?.details);
  }

  return data as T;
}

export type AuthUser = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  avatarUrl?: string;
  points?: number;
  level?: number;
  badges?: string[];
};

export async function apiRegister(input: { name: string; email: string; password: string }) {
  return apiFetch<{ token: string; user: AuthUser }>(`/auth/register`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function apiLogin(input: { email: string; password: string }) {
  return apiFetch<{ token: string; user: AuthUser }>(`/auth/login`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function apiMe() {
  return apiFetch<{ user: AuthUser }>(`/auth/me`);
}

export type IssueStatus = 'pending' | 'inprogress' | 'resolved' | 'rejected';
export type IssueCategory = 'road' | 'water' | 'light' | 'waste' | 'park' | 'other';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type Issue = {
  _id: string;
  reporterId: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  addressLabel: string;
  location: { type: 'Point'; coordinates: [number, number] };
  photoUrls: string[];
  upvoteCount: number;
  commentCount: number;
  assignedDepartment?: string;
  progressPercent?: number;
  createdAt: string;
  updatedAt: string;
};

export async function apiCreateIssue(input: {
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  addressLabel: string;
  lat: number;
  lng: number;
  photoUrls: string[];
}) {
  return apiFetch<{ issue: Issue }>(`/issues`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function apiListIssues(params: {
  q?: string;
  category?: string;
  status?: string;
  severity?: string;
  sort?: 'newest' | 'upvoted' | 'commented';
  page?: number;
  pageSize?: number;
}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (typeof v === 'undefined' || v === '' || v === 'all') continue;
    qs.set(k, String(v));
  }
  return apiFetch<{ issues: Issue[]; page: number; pageSize: number; total: number }>(`/issues?${qs.toString()}`);
}

export async function apiIssueCounts() {
  return apiFetch<{ total: number; pending: number; inprogress: number; resolved: number; rejected: number }>(`/issues/counts`);
}

export async function apiGetIssue(id: string) {
  return apiFetch<{ issue: Issue }>(`/issues/${id}`);
}

export async function apiUpvoteIssue(id: string) {
  return apiFetch<{ upvoted: boolean; upvoteCount: number }>(`/issues/${id}/upvote`, { method: 'POST' });
}

export type Comment = {
  _id: string;
  issueId: string;
  authorId: { _id: string; name: string; avatarUrl?: string } | string;
  body: string;
  createdAt: string;
};

export async function apiListComments(issueId: string) {
  return apiFetch<{ comments: Comment[] }>(`/issues/${issueId}/comments`);
}

export async function apiCreateComment(issueId: string, body: string) {
  return apiFetch<{ comment: Comment }>(`/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function apiAdminPatchIssue(issueId: string, patch: { status?: IssueStatus; assignedDepartment?: string; progressPercent?: number }) {
  return apiFetch<{ issue: Issue }>(`/issues/${issueId}`, { method: 'PATCH', body: JSON.stringify(patch) });
}

export async function apiUploadImages(files: File[]) {
  const fd = new FormData();
  for (const f of files) fd.append('images', f);
  return apiFetch<{ urls: string[] }>(`/uploads/images`, { method: 'POST', body: fd });
}

export type Notification = {
  _id: string;
  type: 'resolved' | 'info' | 'badge' | 'comment' | 'upvote';
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
};

export async function apiListNotifications() {
  return apiFetch<{ notifications: Notification[] }>(`/notifications`);
}

export async function apiMarkNotificationRead(id: string) {
  return apiFetch<{ notification: Notification }>(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function apiDashboardSummary() {
  return apiFetch<{
    kpis: { totalIssues: number; pending: number; inprogress: number; resolvedThisMonth: number };
    healthScore: number;
    recentIssues: Issue[];
    monthlyTrend: { month: string; reported: number; resolved: number; pending: number }[];
    categoryBreakdown: { key: IssueCategory; name: string; value: number }[];
    activeProjects: { id: string; name: string; progress: number; status: string; category: IssueCategory }[];
    events: ActivityEvent[];
  }>(
    `/dashboard/summary`
  );
}

export type ActivityEvent = {
  _id: string;
  type: 'resolved' | 'reported' | 'assigned' | 'upvoted' | 'commented' | 'escalated' | 'badge';
  userId?: { _id: string; name: string; avatarUrl?: string };
  title: string;
  locationLabel?: string;
  createdAt: string;
};

export async function apiActivity() {
  return apiFetch<{ events: ActivityEvent[] }>(`/activity`);
}

export async function apiRewardsMe() {
  return apiFetch<{ user: { name: string; avatarUrl?: string; points: number; level: number; badges: string[] } }>(`/rewards/me`);
}

export async function apiLeaderboard(period: 'month' | 'alltime') {
  const qs = new URLSearchParams({ period });
  return apiFetch<{ period: string; leaderboard: { id: string; name: string; avatarUrl?: string; points: number; level: number; resolvedReports: number }[] }>(
    `/rewards/leaderboard?${qs.toString()}`
  );
}

export type MapMarker = {
  id: string;
  title: string;
  status: IssueStatus;
  category: IssueCategory;
  upvotes: number;
  addressLabel: string;
  lat: number;
  lng: number;
  createdAt: string;
};

export async function apiMapIssues(params: { bbox?: string; status?: string; category?: string }) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v || v === 'all' || v === 'active') continue;
    qs.set(k, v);
  }
  return apiFetch<{ markers: MapMarker[] }>(`/issues/map?${qs.toString()}`);
}
