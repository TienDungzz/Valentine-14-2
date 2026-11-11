import '../shared/styles/main.css';
import items from '../content/chocolates.json';
import { shapeSvg } from '../content/shapes.js';
import { createStory } from '../domain/gift/story.js';
import { readMotion, saveMotion } from '../shared/lib/preferences.js';

const heart = '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 34 6 20C-2 7 14 1 20 12 26 1 42 7 34 20Z" stroke="currentColor" stroke-width="1.5"/><path d="m20 12-3 7 6 5-3 9" stroke="currentColor" stroke-width="1.3"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.5"/></svg>';
const gear = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/><path d="m10 3-1 3-3 1-3 3v4l3 1 1 3 3 3h4l1-3 3-1 3-3v-4l-3-1-1-3-3-3Z" stroke="currentColor" stroke-width="1.2"/></svg>';
const close = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5"/></svg>';
const app = document.querySelector('#app');
app.innerHTML = `
  <main class="page">
    <div class="corner-row">
      <div class="brand" aria-label="Valentine Red">
        <div class="brand__icon">${heart}</div>
        <div class="brand__name">VALENTINE RED<span>MADE FOR TWO</span></div>
      </div>
      <button class="icon-button" data-action="settings" aria-label="Thiết lập chuyển động">${gear}</button>
    </div>
    <section class="hero" aria-labelledby="title">
      <div class="eyebrow hero__date">VALENTINE · 14 THÁNG 2</div>
      <h1 id="title">Hai nửa, <em>một tình yêu.</em></h1>
      <p class="hero__subtitle">2 người <span>·</span> 2 nửa trái tim <span>·</span> 14 điều thương</p>
    </section>
    <section class="stage" aria-label="Buổi hẹn trong khu vườn sân thượng">
      <img class="stage__poster" src="${import.meta.env.BASE_URL}posters/garden.jpg" alt="Hai người bên hộp quà trong khu vườn lúc chạng vạng" />
      <canvas class="stage__canvas" aria-label="Cảnh 3D hai nhân vật và hộp chocolate. Dùng danh sách Chọn chocolate phía dưới để chọn bằng bàn phím."></canvas>
      <div class="stage__vignette"></div>
      <div class="stage__chapter"><span id="chapter-number">01</span><span id="chapter-label">MỘT MÓN QUÀ, HAI NGƯỜI</span></div>
      <span class="stage__note">A LITTLE LOVE, IN EVERY PIECE</span>
      <div class="stage__status" id="load-status" role="status">
        <span class="loader" aria-hidden="true"></span><p>Đang chuẩn bị món quà…</p>
        <button class="text-button" data-action="fallback">Đọc lời nhắn không cần 3D</button>
      </div>
    </section>
    <section class="controls" id="controls" aria-label="Điều khiển câu chuyện"></section>
    <p class="sr-only" id="announce" aria-live="polite"></p>
    <details class="picker" id="picker" hidden>
      <summary>Chọn chocolate · 14 điều thương dành cho em</summary>
      <div class="picker__grid">${items.map((item) => `
        <button class="picker__item" data-chocolate="${item.id}" aria-label="Chocolate ${Number(item.id.slice(1))}, ${item.shape}, chưa đọc">
          <span class="picker__check" aria-hidden="true"></span>
          ${shapeSvg(item.id)}<span>${String(Number(item.id.slice(1))).padStart(2, '0')} · ${item.shape}</span>
        </button>`).join('')}</div>
    </details>
    <footer class="footer"><span>MỘT CHÚT NGỌT NGÀO, MỘT CHÚT THƯƠNG.</span><span>GỬI BẰNG <span class="footer__heart">♡</span> VALENTINE RED</span></footer>
  </main>
  <dialog class="message-dialog" id="message-dialog" aria-labelledby="message-title" aria-describedby="message-text">
    <button class="icon-button message-dialog__close" data-action="close-message" aria-label="Đóng lời nhắn">${close}</button>
    <div class="message-dialog__shape" id="message-shape"></div>
    <p class="message-dialog__number" id="message-number"></p>
    <h2 id="message-title"></h2>
    <p class="message-dialog__text" id="message-text"></p>
    <button class="button" data-action="close-message">Giữ điều thương này ${heart}</button>
  </dialog>
  <dialog class="settings" id="settings" aria-labelledby="settings-title">
    <h2 id="settings-title">Một nhịp thật dịu dàng</h2>
    <p>Chọn chuyển động phù hợp với bạn. Món quà và những lời nhắn luôn ở đây.</p>
    <label for="motion">Chuyển động</label>
    <select id="motion"><option value="system">Theo thiết bị</option><option value="reduced">Giảm chuyển động</option><option value="full">Đầy đủ chuyển động</option></select>
    <button class="button" data-action="close-settings">Xong</button>
  </dialog>
  <dialog class="confirm" id="restart-confirm" aria-labelledby="restart-title">
    <h2 id="restart-title">Mở món quà từ đầu?</h2>
    <p>Tiến độ đọc sẽ trở về 0/14. Bạn vẫn có thể khám phá lại tất cả những lời nhắn.</p>
    <div class="controls__actions"><button class="button button--secondary" data-action="cancel-restart">Giữ tiến độ</button><button class="button" data-action="confirm-restart">Bắt đầu lại</button></div>
  </dialog>
`;

const story = createStory(items);
const controls = document.querySelector('#controls');
const status = document.querySelector('#load-status');
const picker = document.querySelector('#picker');
const message = document.querySelector('#message-dialog');
const settings = document.querySelector('#settings');
const confirm = document.querySelector('#restart-confirm');
const motionSelect = document.querySelector('#motion');
const deviceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motion = 'system';
try { motion = readMotion(localStorage); } catch { /* Storage can be unavailable. */ }
motionSelect.value = motion;
const isReduced = () => motion === 'reduced' || (motion === 'system' && deviceMotion.matches);
let engine;
let loadAbort;
let generation = 0;
let staticMode = false;
let messageOpener;
let lastCount = 0;

function button(label, action, secondary = false) {
  return '<button class="button' + (secondary ? ' button--secondary' : '') + '" data-action="' + action + '">' + label + (secondary ? '' : arrow) + '</button>';
}
function render() {
  const phase = story.phase;
  const exploring = phase === 'exploring';
  const count = story.count;
  const complete = count === 14;
  let html = '';
  if (phase === 'loading') html = '<p class="controls__lead">Một món quà nhỏ, một tình yêu thật lớn.</p><p class="controls__hint">Món quà đang được chuẩn bị riêng cho khoảnh khắc này.</p>';
  else if (phase === 'ready') html = '<p class="controls__lead">Có một món quà chỉ trọn vẹn khi có cả hai.</p>' + button('Ghép hai nửa trái tim', 'start');
  else if (phase === 'assembling') html = '<p class="controls__lead">Hai nửa đang tìm về bên nhau…</p><p class="controls__hint">Một chút chờ đợi, để điều ngọt ngào được mở ra.</p>';
  else if (exploring) {
    html = '<p class="controls__lead">' + (complete ? 'Mười bốn điều thương, đều dành cho em.' : 'Mỗi miếng chocolate, một điều muốn nói.') + '</p>';
    html += '<div class="progress" aria-hidden="true">' + items.map((item) => '<span class="progress__dot' + (story.hasRead(item.id) ? ' progress__dot--read' : '') + '"></span>').join('') + '</div>';
    html += '<p class="controls__hint">Đã mở ' + count + '/14 lời nhắn · Chạm vào chocolate hoặc chọn bên dưới</p>';
    if (complete && !story.selected) html += button('Xem lời kết', 'finale');
    html += '<button class="text-button" data-action="open-picker">Chọn chocolate</button>';
    html += '<button class="text-button" data-action="replay">Xem lại hoạt cảnh</button>';
  } else if (phase === 'finishing') html = '<p class="controls__lead">Điều ngọt ngào nhất là có nhau.</p>';
  else if (phase === 'completed') html = '<p class="controls__lead">14 điều muốn nói, 2 người cùng viết tiếp.</p><div class="controls__actions">' + button('Trở lại hộp quà', 'return') + button('Xem lại hoạt cảnh', 'replay', true) + '</div><button class="text-button" data-action="restart">Bắt đầu lại</button>';
  controls.innerHTML = html;
  picker.hidden = !exploring;
  for (const item of items) {
    const element = picker.querySelector('[data-chocolate="' + item.id + '"]');
    const read = story.hasRead(item.id);
    element.classList.toggle('picker__item--read', read);
    element.setAttribute('aria-label', 'Chocolate ' + (Number(item.id.slice(1))) + ', ' + item.shape + ', ' + (read ? 'đã đọc' : 'chưa đọc'));
    element.querySelector('.picker__check').textContent = read ? '✓' : '';
    element.disabled = !exploring || Boolean(story.selected);
  }
  const chapter = phase === 'completed' || phase === 'finishing' ? 3 : exploring ? 2 : 1;
  document.querySelector('#chapter-number').textContent = String(chapter).padStart(2, '0');
  document.querySelector('#chapter-label').textContent = ['MỘT MÓN QUÀ, HAI NGƯỜI', 'MƯỜI BỐN ĐIỀU THƯƠNG', 'CÙNG VIẾT TIẾP YÊU THƯƠNG'][chapter - 1];
  if (lastCount !== count) {
    document.querySelector('#announce').textContent = 'Đã mở ' + count + ' trên 14 lời nhắn.';
    lastCount = count;
  }
}

function selectChocolate(id, opener) {
  const item = items.find((entry) => entry.id === id);
  if (!item || !story.select(id)) return;
  messageOpener = opener ?? controls.querySelector('[data-action="open-picker"]');
  document.querySelector('#message-shape').innerHTML = shapeSvg(id);
  document.querySelector('#message-number').textContent = 'ĐIỀU THƯƠNG SỐ ' + String(Number(item.id.slice(1))).padStart(2, '0');
  document.querySelector('#message-title').textContent = item.shape;
  document.querySelector('#message-text').textContent = item.message;
  try {
    message.showModal();
    story.shown(id);
    engine?.highlight(id);
    engine?.setSelectable(false);
    render();
  } catch (error) {
    story.close();
    console.error(error);
  }
}
message.addEventListener('close', () => {
  story.close();
  engine?.highlight(null);
  engine?.setSelectable(story.phase === 'exploring');
  render();
  const focus = messageOpener?.isConnected ? messageOpener : controls.querySelector('[data-action="open-picker"]');
  focus?.focus({ preventScroll: true });
});

function useStatic() {
  staticMode = true;
  generation++;
  loadAbort?.abort();
  engine?.dispose();
  engine = null;
  document.querySelector('canvas').hidden = true;
  status.hidden = true;
  if (story.phase === 'loading') story.ready();
  else if (story.phase === 'assembling') story.explore();
  else if (story.phase === 'finishing') story.complete();
  picker.open = true;
  render();
}

async function load() {
  const current = ++generation;
  loadAbort?.abort();
  engine?.dispose();
  loadAbort = new AbortController();
  staticMode = false;
  const canvas = document.querySelector('canvas');
  canvas.hidden = false;
  status.hidden = false;
  status.innerHTML = '<span class="loader" aria-hidden="true"></span><p>Đang chuẩn bị món quà…</p><button class="text-button" data-action="fallback">Đọc lời nhắn không cần 3D</button>';
  try {
    const { createStage } = await import('../engine/scene.js');
    if (current !== generation) return;
    const result = await createStage(canvas, items, {
      onSelect: (id) => selectChocolate(id),
      onContextLost: () => useStatic(),
      signal: loadAbort.signal,
    });
    if (current !== generation) { result.dispose(); return; }
    engine = result;
    engine.setMotion(isReduced());
    status.hidden = true;
    story.ready();
    render();
  } catch (error) {
    if (current !== generation) return;
    console.error('Scene loading failed:', error);
    canvas.hidden = true;
    status.innerHTML = '<p>Chưa thể tải khung cảnh. Những điều thương vẫn đang chờ bạn.</p><button class="button button--secondary" data-action="retry">Thử lại</button><button class="text-button" data-action="fallback">Đọc lời nhắn không cần 3D</button>';
  }
}

async function start() {
  if (!story.start()) return;
  render();
  if (!staticMode) {
    const done = await engine.start();
    if (!done) return;
  }
  if (!story.explore()) return;
  engine?.explore();
  render();
  if (staticMode) picker.open = true;
  controls.querySelector('[data-action="open-picker"]')?.focus({ preventScroll: true });
}
async function finale() {
  if (!story.finale()) return;
  render();
  if (!staticMode) {
    const done = await engine.finale();
    if (!done) return;
  }
  story.complete();
  render();
  controls.querySelector('[data-action="return"]')?.focus({ preventScroll: true });
}
function replay(clear = false) {
  story.replay(clear);
  engine?.reset();
  picker.open = false;
  render();
  controls.querySelector('[data-action="start"]')?.focus({ preventScroll: true });
}
app.addEventListener('click', (event) => {
  const chocolate = event.target.closest('[data-chocolate]');
  if (chocolate) { selectChocolate(chocolate.dataset.chocolate, chocolate); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'start') void start();
  if (action === 'finale') void finale();
  if (action === 'close-message') message.close();
  if (action === 'settings') settings.showModal();
  if (action === 'close-settings') settings.close();
  if (action === 'open-picker') { picker.open = true; picker.querySelector('button:not(:disabled)')?.focus(); }
  if (action === 'replay') replay();
  if (action === 'return') { story.explore(); engine?.explore(); render(); }
  if (action === 'restart') confirm.showModal();
  if (action === 'cancel-restart') confirm.close();
  if (action === 'confirm-restart') { confirm.close(); replay(true); }
  if (action === 'fallback') useStatic();
  if (action === 'retry') void load();
});
motionSelect.addEventListener('change', () => {
  motion = motionSelect.value;
  try { saveMotion(localStorage, motion); } catch { /* Keep in memory. */ }
  engine?.setMotion(isReduced());
});
function deviceChanged() { engine?.setMotion(isReduced()); }
deviceMotion.addEventListener('change', deviceChanged);
window.addEventListener('pagehide', (event) => {
  if (!event.persisted) { generation++; loadAbort?.abort(); engine?.dispose(); }
});
if (import.meta.hot) import.meta.hot.dispose(() => {
  generation++; loadAbort?.abort(); engine?.dispose();
  deviceMotion.removeEventListener('change', deviceChanged);
});
render();
void load();
