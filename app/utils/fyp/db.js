// In-browser stand-in for the FYP's backend: an Express API on AWS Lambda in front of a PostgreSQL database on RDS,
// with its 'accounts' and 'attendance' tables. The demo keeps both tables in this browser's localStorage, so it runs
// on a static host and nothing (including face photos) leaves the browser. The functions mirror the original routes.

const DB_KEY = 'fyp-demo-db';
const SESSION_KEY = 'fyp-demo-session';
const SCHEMA_VERSION = 1;

export const DEMO_PASSWORD = 'demo1234';
export const VISITOR_EMAIL = 'you@fyp.demo';
export const EMPLOYEE_EMAIL = 'daniel.lim@fyp.demo';
// the terminal flagged anything over 37 °C
export const FEVER_THRESHOLD = 37;

// the branches from the original Maps page, each with its own access terminal
export const BRANCHES = [
  { id: 'A', name: 'Branch A', lat: 3.0079312936374625, lng: 101.72011515409301 },
  { id: 'B', name: 'Branch B', lat: 2.8656357608536567, lng: 101.52241445479191 },
  { id: 'C', name: 'Branch C', lat: 2.846867031777766, lng: 101.87539548085807 },
];

const SEED_ACCOUNTS = [
  // the visitor administers the demo, so every page is open to them
  { email: VISITOR_EMAIL, is_admin: true, first_name: 'Guest', last_name: '' },
  { email: EMPLOYEE_EMAIL, is_admin: false, first_name: 'Daniel', last_name: 'Lim', branch: 'A' },
  { email: 'priya.nair@fyp.demo', is_admin: false, first_name: 'Priya', last_name: 'Nair', branch: 'A' },
  { email: 'hafiz.ismail@fyp.demo', is_admin: false, first_name: 'Hafiz', last_name: 'Ismail', branch: 'B' },
  { email: 'meiling.tan@fyp.demo', is_admin: false, first_name: 'Mei Ling', last_name: 'Tan', branch: 'C' },
];

// API latency, so the original loading states still show
const delay = () => new Promise((resolve) => setTimeout(resolve, 250));

const sha256 = async (text) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

// deterministic pseudo-random numbers, so the seeded history looks the same on every visit
const mulberry32 = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// a week of check-ins before today, with one fever and one missing mask for the dashboard to flag
const seedAttendance = (accounts) => {
  const random = mulberry32(2021);
  const rows = [];
  const days = [];
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  while (days.length < 5) {
    day.setDate(day.getDate() - 1);
    if (day.getDay() !== 0 && day.getDay() !== 6) days.unshift(new Date(day));
  }

  const employees = accounts.filter(({ branch }) => branch);
  days.forEach((date, d) => {
    employees.forEach((account, e) => {
      const time = new Date(date);
      time.setHours(8, 15 + Math.floor(random() * 60), Math.floor(random() * 60));
      const fever = d === 2 && e === 2;
      rows.push({
        user_id: account.user_id,
        temperature: fever ? 37.6 : Math.round((36.1 + random() * 0.8) * 10) / 10,
        mask: !(d === 3 && e === 1),
        datetime: time.toISOString(),
        branch: account.branch,
      });
    });
    // someone the terminal didn't recognize
    if (d % 2 === 0) {
      const time = new Date(date);
      time.setHours(10, Math.floor(random() * 60));
      rows.push({ user_id: null, temperature: 36.5, mask: true, datetime: time.toISOString(), branch: 'A' });
    }
  });
  return rows.sort((a, b) => a.datetime.localeCompare(b.datetime)).map((row, i) => ({ id: i + 1, ...row }));
};

const createDb = async () => {
  const passwd = await sha256(DEMO_PASSWORD);
  const accounts = SEED_ACCOUNTS.map((account, i) => ({ user_id: i + 1, passwd, image: null, embedding: null, ...account }));
  const attendance = seedAttendance(accounts);
  // the branch only places the seeded check-ins; accounts have no branch column
  accounts.forEach((account) => delete account.branch);
  return { version: SCHEMA_VERSION, accounts, attendance };
};

const read = async () => {
  try {
    const db = JSON.parse(localStorage.getItem(DB_KEY));
    if (db?.version === SCHEMA_VERSION) return db;
  } catch {}
  const db = await createDb();
  write(db);
  return db;
};

const write = (db) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    // photos are the only large values, and a full localStorage is the only likely failure
    throw new Error('Your browser storage is full. Try a smaller photo, or reset the demo data.', { cause: error });
  }
};

const nextId = (rows, key) => rows.reduce((max, row) => Math.max(max, row[key]), 0) + 1;

// the API never returned password hashes
const toPublic = (account) => Object.fromEntries(Object.entries(account).filter(([key]) => key !== 'passwd'));

/* ---------- POST /users/login ---------- */
export const login = async (email, password) => {
  await delay();
  const db = await read();
  const account = db.accounts.find((row) => row.email === email.trim().toLowerCase());
  if (!account) throw new Error('User Not Found');
  if (account.passwd !== (await sha256(password))) throw new Error('Wrong Password');
  setSession(account.user_id);
  return toPublic(account);
};

/* ---------- GET /users ---------- */
export const getUsers = async () => {
  await delay();
  return (await read()).accounts.map(toPublic);
};

export const getUser = async (userId) => {
  const account = (await read()).accounts.find((row) => row.user_id === userId);
  return account ? toPublic(account) : null;
};

/* ---------- POST /users/new ---------- */
export const newUser = async ({ email, password, is_admin, first_name, last_name }) => {
  await delay();
  const db = await read();
  email = email.trim().toLowerCase();
  // the message PostgreSQL's unique constraint gave, which the API passed through
  if (db.accounts.some((row) => row.email === email)) throw new Error(`Key (email)=(${email}) already exists.`);
  db.accounts.push({
    user_id: nextId(db.accounts, 'user_id'),
    email,
    passwd: await sha256(password),
    is_admin: Boolean(is_admin),
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    image: null,
    embedding: null,
  });
  write(db);
};

/* ---------- PATCH /user ---------- */
export const updateUser = async (userId, changes) => {
  await delay();
  const db = await read();
  const account = db.accounts.find((row) => row.user_id === userId);
  if (!account) throw new Error('User Not Found');
  const { first_name, last_name, image } = changes;
  if (first_name !== undefined) account.first_name = first_name.trim();
  if (last_name !== undefined) account.last_name = last_name.trim();
  if (image !== undefined && image !== account.image) {
    account.image = image;
    // a new photo needs a new face encoding, which the terminal computes on start-up
    account.embedding = null;
  }
  write(db);
  return toPublic(account);
};

/* ---------- DELETE /users/:id (a TODO in the original) ---------- */
export const deleteUser = async (userId) => {
  await delay();
  const db = await read();
  db.accounts = db.accounts.filter((row) => row.user_id !== userId);
  // ON DELETE CASCADE
  db.attendance = db.attendance.filter((row) => row.user_id !== userId);
  write(db);
  if (getSession() === userId) clearSession();
};

/* ---------- attendance, which the terminal wrote straight to the database ---------- */
export const getAttendance = async ({ userId } = {}) => {
  await delay();
  const rows = (await read()).attendance;
  return (userId === undefined ? rows : rows.filter((row) => row.user_id === userId)).toReversed();
};

export const recordAttendance = async ({ userId, temperature, mask, branch }) => {
  const db = await read();
  const row = {
    id: nextId(db.attendance, 'id'),
    user_id: userId,
    temperature,
    mask,
    datetime: new Date().toISOString(),
    branch,
  };
  db.attendance.push(row);
  write(db);
  return row;
};

/* ---------- face encodings: the terminal's cache of each photo's FaceNet embedding ---------- */
export const getFaces = async () => (await read()).accounts.filter((row) => row.image).map(toPublic);

export const saveEmbedding = async (userId, image, embedding) => {
  const db = await read();
  const account = db.accounts.find((row) => row.user_id === userId);
  // skip it if the photo changed while the embedding was being computed
  if (account?.image !== image) return;
  account.embedding = embedding.map((value) => Math.round(value * 1e5) / 1e5);
  write(db);
};

/* ---------- session (the original kept the logged-in user in localStorage too) ---------- */
export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

export const setSession = (userId) => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userId));
  } catch {}
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
};

export const resetDemo = () => {
  try {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SESSION_KEY);
  } catch {}
};

export const visitorId = async () => (await read()).accounts.find((row) => row.email === VISITOR_EMAIL)?.user_id ?? null;

export const fullName = (account) => [account?.first_name, account?.last_name].filter(Boolean).join(' ');

export const isFever = (row) => row.temperature > FEVER_THRESHOLD;
export const isCompliant = (row) => row.mask && !isFever(row);

// the original only warned about a missing photo; administrators now also see the week's SOP breaches
export const getNotifications = async (user) => {
  const notifications = [];
  if (!user.image) notifications.push({ id: 'photo', type: 'photo' });
  if (user.is_admin) {
    const db = await read();
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const names = new Map(db.accounts.map((account) => [account.user_id, fullName(account)]));
    db.attendance
      .filter((row) => !isCompliant(row) && Date.parse(row.datetime) > weekAgo)
      .toReversed()
      .forEach((row) => notifications.push({ id: `sop-${row.id}`, type: 'sop', row, name: names.get(row.user_id) }));
  }
  return notifications;
};
