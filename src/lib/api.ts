import { projectId, publicAnonKey } from "../../utils/supabase/info";

function uuid(): string {
  // crypto.randomUUID requires a secure context (HTTPS/localhost); fall back for HTTP LAN dev
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (crypto as any).randomUUID();
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}

const REST = `https://${projectId}.supabase.co/rest/v1/kv_store_5a760fd9`;
const HEADERS = {
  "Content-Type": "application/json",
  "apikey": publicAnonKey,
  "Authorization": `Bearer ${publicAnonKey}`,
};

// ── Low-level KV helpers ───────────────────────────────────────────────────────
async function kvGet(key: string): Promise<any> {
  try {
    const res = await fetch(`${REST}?key=eq.${encodeURIComponent(key)}&select=value`, { headers: HEADERS });
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

async function kvSet(key: string, value: any): Promise<void> {
  const res = await fetch(REST, {
    method: "POST",
    headers: { ...HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`kvSet failed (${res.status}): ${err}`);
  }
}

// ── FEATURES ──────────────────────────────────────────────────────────────────
export async function getFeatures() {
  const list: any[] = (await kvGet("features")) ?? [];
  return list.filter((f) => f.status === "approved");
}

export async function getPendingFeatures() {
  return (await kvGet("features")) ?? [];
}

export async function submitFeature(body: { title: string; category: string; description: string }) {
  const list: any[] = (await kvGet("features")) ?? [];
  const entry = { id: uuid(), ...body, votes: 0, status: "pending", createdAt: new Date().toISOString() };
  await kvSet("features", [...list, entry]);
  return entry;
}

export async function updateFeature(id: string, patch: object) {
  const list: any[] = (await kvGet("features")) ?? [];
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Not found");
  list[idx] = { ...list[idx], ...patch };
  await kvSet("features", list);
  return list[idx];
}

export async function deleteFeature(id: string) {
  const list: any[] = (await kvGet("features")) ?? [];
  await kvSet("features", list.filter((f) => f.id !== id));
}

export async function voteFeature(id: string, direction: number, prevDirection: number) {
  const list: any[] = (await kvGet("features")) ?? [];
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Not found");
  list[idx].votes = (list[idx].votes || 0) + (direction - prevDirection);
  await kvSet("features", list);
  return list[idx];
}

// ── FAQS ──────────────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  { id: "1", order: 0, question: "What is WordsWave?", answer: "WordsWave is a gamified mobile vocabulary learning application designed to make mastering new words engaging and fun. Through an interactive database, daily challenges, and a rewarding progression system, users can build their vocabulary effectively over time." },
  { id: "2", order: 1, question: "Who is Fin?", answer: "Fin is our official dolphin mascot! He will be your personal guide and companion throughout the app, cheering you on as you hit new milestones and complete your daily vocabulary goals." },
  { id: "3", order: 2, question: "Is WordsWave free to use?", answer: "Yes! You can download WordsWave and access core vocabulary features for free. For users looking for deeper insights into their learning habits, we offer a premium upgrade." },
  { id: "4", order: 3, question: "How do I keep track of my daily learning?", answer: "WordsWave features a built-in streak tracking mechanic. By completing your vocabulary goals every day, you will build a streak. If you miss a day, your streak will reset, so consistency is key!" },
  { id: "5", order: 4, question: "How do Achievements work?", answer: "As you progress, you will unlock Achievement badges (like the \"7-Day Streak\" or \"Quiz Master\" tiers). You can view all available badges on your Account Profile. Tapping on any badge will display the specific metrics and requirements needed to earn it." },
  { id: "6", order: 5, question: "What are Seasonal Events?", answer: "WordsWave regularly hosts limited-time Seasonal Events, such as the Football Season event. These events feature unique themes, special challenges, and a countdown timer so you know exactly how long you have left to participate." },
];

export async function getFaqs() {
  const list = (await kvGet("faqs")) ?? DEFAULT_FAQS;
  return [...list].sort((a, b) => a.order - b.order);
}

export async function createFaq(body: { question: string; answer: string }) {
  const list: any[] = (await kvGet("faqs")) ?? DEFAULT_FAQS;
  const entry = { id: uuid(), ...body, order: list.length };
  await kvSet("faqs", [...list, entry]);
  return entry;
}

export async function updateFaq(id: string, patch: object) {
  const list: any[] = (await kvGet("faqs")) ?? DEFAULT_FAQS;
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error("Not found");
  list[idx] = { ...list[idx], ...patch };
  await kvSet("faqs", list);
  return list[idx];
}

export async function deleteFaq(id: string) {
  const list: any[] = (await kvGet("faqs")) ?? DEFAULT_FAQS;
  await kvSet("faqs", list.filter((f) => f.id !== id));
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
export async function getEvents() {
  const list: any[] = (await kvGet("events")) ?? [];
  return list.filter((e) => e.visible !== false);
}

export async function getAllEvents() {
  return (await kvGet("events")) ?? [];
}

export async function createEvent(body: object) {
  const list: any[] = (await kvGet("events")) ?? [];
  const entry = { id: uuid(), visible: true, badge: "🎉", createdAt: new Date().toISOString(), ...body };
  await kvSet("events", [...list, entry]);
  return entry;
}

export async function updateEvent(id: string, patch: object) {
  const list: any[] = (await kvGet("events")) ?? [];
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Not found");
  list[idx] = { ...list[idx], ...patch };
  await kvSet("events", list);
  return list[idx];
}

export async function deleteEvent(id: string) {
  const list: any[] = (await kvGet("events")) ?? [];
  await kvSet("events", list.filter((e) => e.id !== id));
}

// ── CONTACT MESSAGES ─────────────────────────────────────────────────────────
export async function sendContactMessage(name: string, email: string, message: string) {
  const list: any[] = (await kvGet("contact_messages")) ?? [];
  list.push({ id: uuid(), name, email, message, sentAt: new Date().toISOString(), read: false });
  await kvSet("contact_messages", list);
}

export async function getContactMessages() {
  const list: any[] = (await kvGet("contact_messages")) ?? [];
  return [...list].reverse();
}

export async function markMessageRead(id: string) {
  const list: any[] = (await kvGet("contact_messages")) ?? [];
  const idx = list.findIndex((m) => m.id === id);
  if (idx !== -1) { list[idx].read = true; await kvSet("contact_messages", list); }
}

export async function deleteMessage(id: string) {
  const list: any[] = (await kvGet("contact_messages")) ?? [];
  await kvSet("contact_messages", list.filter((m) => m.id !== id));
}

// ── ADMIN PASSWORD ────────────────────────────────────────────────────────────
export async function getAdminPassword(): Promise<string | null> {
  try {
    const stored = await kvGet("admin_password");
    return typeof stored === "string" && stored.length > 0 ? stored : null;
  } catch {
    return null;
  }
}

export async function setAdminPassword(newPassword: string): Promise<void> {
  await kvSet("admin_password", newPassword);
}
