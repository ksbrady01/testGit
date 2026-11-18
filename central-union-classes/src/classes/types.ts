export type LessonType = "text" | "video" | "pdf";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** Minutes as entered; the editor keeps the raw input string until saved. */
  minutes: number | string;
  /** Text content, or notes shown alongside a video/PDF. */
  body: string;
  /** YouTube link (video) or PDF link (pdf). */
  url: string;
  /** Uploaded file id (video or PDF), when file storage is connected. */
  assetId: string;
  fileName: string;
}

export interface CourseData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  hue: number;
  lessons: Lesson[];
  authorId?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

export interface Course extends CourseData {
  id: string;
}

export interface Enrollment {
  startedAt?: string | undefined;
  updatedAt?: string | undefined;
  done: string[];
  last?: string | null | undefined;
  completedAt?: string | undefined;
  certId?: string | undefined;
  /** Seconds watched per uploaded-video lesson, so playback resumes. */
  vpos?: Record<string, number> | undefined;
}

export type FreqId = "daily" | "3days" | "weekly" | "off";

export interface IncompleteItem {
  courseId: string;
  title: string;
  pct: number;
  next: string;
  updatedAt: string | null;
}

export interface Learner {
  xp: number;
  enrolled: Record<string, Enrollment>;
  streak: { count: number; best: number; last: string | null };
  reminders: { freq: FreqId; email: boolean };
  badges: string[];
  createdAt?: string | undefined;
  incomplete?: IncompleteItem[] | undefined;
  lastActive?: string | null | undefined;
  nextReminderAt?: string | null | undefined;
  email?: string | null | undefined;
  name?: string | undefined;
  updatedAt?: string | undefined;
}

export interface LeaderRow {
  id: string;
  xp: number;
  completed?: number | undefined;
  updatedAt?: string | undefined;
}

export interface Progress {
  enrolled: boolean;
  done: number;
  total: number;
  pct: number;
  completed: boolean;
  e: Enrollment | undefined;
}

export interface Level {
  idx: number;
  n: number;
  name: string;
  next: { name: string; xp: number } | undefined;
  pct: number;
  toNext: number;
}

export interface Me {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string;
  color: string;
  isOwner: boolean;
  canEdit: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  avatarUrl: string;
  color: string;
  isMe: boolean;
}

export type ToastKind = "xp" | undefined;
export interface Toast {
  id: number;
  text: string;
  icon: string;
  kind: ToastKind;
}

export type Modal =
  | { kind: "complete"; course: Course; levelUp: Level | null }
  | { kind: "level"; lv: Level };
