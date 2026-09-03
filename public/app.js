// Shared client helpers for Smart QR Manager

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let data = null;
  try { data = await res.json(); } catch { /* no body */ }
  if (!res.ok) throw new Error((data && data.error) || `请求失败 (${res.status})`);
  return data;
}

async function getMe() {
  try { return await api('/api/auth/me'); }
  catch { return null; }
}

// Redirect to login if not authenticated; returns the user otherwise.
async function requireAuth() {
  const me = await getMe();
  if (!me) { location.href = '/login.html'; return null; }
  return me;
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
}

function showMsg(el, text, type = 'err') {
  el.textContent = text;
  el.className = `msg show ${type}`;
}

function hideMsg(el) { el.className = 'msg'; }

function fmtDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function fmtNum(n) {
  return Number(n || 0).toLocaleString('zh-CN');
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------------------------------------------------------------------
   Icons — a small line-icon set (24px grid, 1.8 stroke)
   --------------------------------------------------------------------- */
const ICON_PATHS = {
  plus: '<path d="M12 5v14M5 12h14"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
  'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
  'arrow-down': '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  check: '<path d="M5 12l5 5L20 7"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart: '<path d="M4 19h16M7 16v-6M12 16V6M17 16v-4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1.5-1.5"/>',
  form: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  inbox: '<path d="M4 13l2-8h12l2 8v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6z"/><path d="M4 13h5l1 2h4l1-2h5"/>',
  edit: '<path d="M4 20l4.5-1L19 8.5a2.1 2.1 0 0 0-3-3L5.5 16 4 20z"/><path d="M13.5 7l3 3"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-8 8"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM19 14h2M14 19h2M18 18h3v3h-3z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  shield: '<path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
};

function icon(name, size = 16, stroke = 1.8) {
  if (name === 'logo') return logoSvg(size);
  const d = ICON_PATHS[name];
  if (!d) return '';
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

function logoSvg(size = 20) {
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="14" y="2.5" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="2.5" y="14" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="5" y="5" width="2.5" height="2.5" rx="0.6" fill="currentColor"/>
    <rect x="16.5" y="5" width="2.5" height="2.5" rx="0.6" fill="currentColor"/>
    <rect x="5" y="16.5" width="2.5" height="2.5" rx="0.6" fill="currentColor"/>
    <rect x="14" y="14" width="3" height="3" rx="0.8" fill="currentColor"/>
    <rect x="18.5" y="14" width="3" height="3" rx="0.8" fill="currentColor"/>
    <rect x="14" y="18.5" width="3" height="3" rx="0.8" fill="currentColor"/>
    <rect x="18.5" y="18.5" width="3" height="3" rx="0.8" fill="currentColor" opacity="0.45"/>
  </svg>`;
}

// Replace <span data-icon="name" data-size="16"> placeholders with SVG.
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, el.dataset.size || 16, el.dataset.stroke || 1.8);
    el.removeAttribute('data-icon');
  });
}

/* ---------------------------------------------------------------------
   Navigation + footer
   --------------------------------------------------------------------- */
function brandHtml() {
  return `<a class="brand" href="/">${logoSvg(20)}<span>Smart QR<span class="brand-ext"> Manager</span></span></a>`;
}

async function renderNav(active) {
  const el = document.getElementById('nav');
  if (!el) return;
  const me = await getMe();
  const link = (href, label, key) =>
    `<a href="${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
  let right;
  if (me) {
    right =
      link('/dashboard.html', '二维码', 'dashboard') +
      link('/forms.html', '表单', 'forms') +
      link('/profile.html', '我的', 'profile') +
      (me.isAdmin ? link('/admin.html', '管理', 'admin') : '') +
      `<a href="#" id="logoutBtn">退出</a>`;
  } else {
    right = link('/', '首页', 'home') + `<a href="/login.html" class="nav-cta">登录</a>`;
  }
  el.innerHTML = `
    <div class="nav-inner">
      ${brandHtml()}
      <nav class="nav-links">${right}</nav>
    </div>`;
  const lo = document.getElementById('logoutBtn');
  if (lo) lo.addEventListener('click', async (e) => {
    e.preventDefault();
    await api('/api/auth/logout', { method: 'POST' });
    location.href = '/';
  });
  renderFooter();
  hydrateIcons();
  return me;
}

function renderFooter() {
  const el = document.getElementById('footer');
  if (!el) return;
  el.className = 'footer';
  el.innerHTML = `
    <span>© ${new Date().getFullYear()} Smart QR Manager</span>
    <span class="footer-links">
      <a href="/">首页</a>
      <a href="/dashboard.html">二维码</a>
      <a href="/forms.html">表单</a>
    </span>`;
}

function emptyState(iconName, title, sub, actionHtml = '') {
  return `<div class="empty">
    <div class="empty-icon">${icon(iconName, 30, 1.5)}</div>
    <h3>${title}</h3>
    <p>${sub}</p>
    ${actionHtml}
  </div>`;
}

// Rows with data-href behave like links, without nesting anchors.
document.addEventListener('click', (e) => {
  const row = e.target.closest('[data-href]');
  if (!row) return;
  if (e.target.closest('a, button, input, select, textarea, label')) return;
  location.href = row.dataset.href;
});
