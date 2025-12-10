import React from "react";
import logo from "./logo.svg";
import "./App.css";

/**
 * Uses Tailwind CSS for styling
 * Tailwind file is imported in App.css
 */

export default function App() {
  return (<header>
    <img id="feedIcon" src="" alt="feed icon"/>
    <div>
      <h1 id="feedTitle">Feed</h1>
      <p id="feedDesc">JSON Feed viewer</p>
    </div>

    <div class="controls">
      <input id="search" type="search" placeholder="Search title / text" />
      <select id="sort">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
      </select>
      <button id="downloadJson">Download JSON</button>
    </div>
  </header>

  <main>
    <aside class="sidebar">
      <div class="feed-meta">
        <img id="feedBanner" src="" alt="banner">
        <div>
          <strong id="feedHome">home</strong>
          <div id="feedUrl" style="font-size:12px;color:var(--muted)"></div>
        </div>
      </div>

      <h2>Items</h2>
      <div class="item-list" id="itemList"></div>
    </aside>

    <section class="viewer" id="viewer">
      <div class="banner" id="viewerBanner">no preview</div>
      <div class="content">
        <div class="meta-row"><strong id="itemTitle">Select an item</strong><div style="flex:1"></div><div id="itemDate"></div></div>
        <div class="meta-row" style="margin-top:8px"><span id="itemExcerpt" style="color:var(--muted)"></span></div>
        <div class="attachments" id="attachments"></div>
        <div class="body" id="itemBody" style="margin-top:12px"></div>
        <div style="margin-top:14px;display:flex;gap:8px">
          <button id="openOriginal">Open original</button>
          <button id="copyLink">Copy link</button>
        </div>
      </div>
    </section>
  </main>

  <footer>Viewer generated locally · Locale: de-DE</footer>
  );
}

let $div_ = document.querySelector('div');

/**
 * Get JSON data from an URL
 */
let getJSON = url => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status === 200) resolve(xhr.response);
      else reject(xhr.status);
    };
    xhr.send();
  });
};

var FEED = "";

// ---------------- LOAD FEED FIRST ----------------
getJSON('https://jewents.pages.dev/json/')
  .then(data => {
    FEED = data;
    initFeed();  // ← start everything AFTER feed loads
  })
  .catch(status => {
    console.error('Error:', status);
  });

// --- Utils ---
const $ = sel => document.querySelector(sel);
const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('de-DE', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(d);
  } catch (e) { return iso }
}

// --- Render feed meta ---
function renderFeedMeta(feed) {
  $('#feedTitle').textContent = feed.title || 'Untitled feed';
  $('#feedDesc').textContent = feed.description || feed.language || '';
  $('#feedIcon').src = feed.icon || feed.favicon || '';
  $('#feedBanner').src = feed.icon || '';
  $('#feedHome').textContent = feed.home_page_url || '';
  $('#feedUrl').textContent = feed.feed_url || '';
}

// --- Item list & viewer ---
let currentItems = [];

function makeItemCard(item) {
  const el = document.createElement('div');
  el.className = 'item-card';

  const thumb = document.createElement('img');
  thumb.src = item.banner_image ||
    (item.attachments && item.attachments[0] && item.attachments[0].url) || '';
  thumb.alt = item.title || '';

  const meta = document.createElement('div');
  meta.className = 'meta';

  const h3 = document.createElement('h3');
  h3.textContent = item.title || '(no title)';

  const p = document.createElement('p');
  p.textContent = item._microfeed && item._microfeed.date_published_short
    ? item._microfeed.date_published_short
    : (item.date_published ? formatDate(item.date_published) : '');

  meta.appendChild(h3);
  meta.appendChild(p);

  el.appendChild(thumb);
  el.appendChild(meta);
  el.addEventListener('click', () => openItem(item));

  return el;
}

function renderList(items) {
  const list = $('#itemList');
  list.innerHTML = '';
  if (!items.length) {
    list.textContent = 'No items';
    return;
  }
  items.forEach(it => list.appendChild(makeItemCard(it)));
}

function openItem(item) {
  $('#itemTitle').textContent = item.title || '(no title)';
  $('#itemDate').textContent = item.date_published ? formatDate(item.date_published) : '';
  $('#itemExcerpt').textContent = (item.content_text || '').split('\n').slice(0, 3).join(' ') || '';

  // banner
  const bannerContainer = $('#viewerBanner');
  bannerContainer.innerHTML = '';
  const bannerUrl = item.banner_image ||
    (item.attachments && item.attachments[0] && item.attachments[0].url) || '';

  if (bannerUrl) {
    const img = document.createElement('img');
    img.src = bannerUrl;
    img.alt = item.title || '';
    bannerContainer.appendChild(img);
  } else {
    bannerContainer.textContent = 'no preview';
  }

  // attachments
  const at = $('#attachments');
  at.innerHTML = '';
  const attachments = item.attachments || [];
  attachments.forEach(a => {
    const i = document.createElement('img');
    i.src = a.url;
    i.title = a.mime_type || '';
    at.appendChild(i);
  });

  // body
  const body = $('#itemBody');
  if (item.content_html) {
    body.innerHTML = sanitizeHTML(item.content_html);
  } else {
    body.textContent = item.content_text || '';
  }

  // actions
  $('#openOriginal').onclick = () => {
    window.open(item._microfeed?.web_url || item.url || '#', '_blank');
  };

  $('#copyLink').onclick = async () => {
    const link = item._microfeed?.web_url || item.url || '';
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copied');
    } catch (e) {
      prompt('Copy link', link);
    }
  };
}

// --- Sanitizer ---
function sanitizeHTML(html) {
  html = html.replace(/<(script|style)[\s\S]*?>[\s\S]*?<\/\1>/gi, '');
  html = html.replace(/\son[a-zA-Z]+=\"[\s\S]*?\"/gi, '');
  html = html.replace(/\son[a-zA-Z]+='[\s\S]*?'/gi, '');
  html = html.replace(/href=\"javascript:[^\"]*\"/gi, 'href="#"');
  return html;
}

// --- Search & sort ---
$('#search').addEventListener('input', () => applyFilters());
$('#sort').addEventListener('change', () => applyFilters());

function applyFilters() {
  const q = $('#search').value.trim().toLowerCase();
  const sort = $('#sort').value;

  let items = FEED.items ? [...FEED.items] : [];

  if (q) {
    items = items.filter(it =>
      (it.title || '').toLowerCase().includes(q) ||
      (it.content_text || '').toLowerCase().includes(q)
    );
  }

  items.sort((a, b) => {
    const ta = new Date(a.date_published || 0).getTime();
    const tb = new Date(b.date_published || 0).getTime();
    return sort === 'newest' ? tb - ta : ta - tb;
  });

  currentItems = items;
  renderList(items);
  if (items[0]) openItem(items[0]);
}

// --- Download JSON ---
$('#downloadJson').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(FEED, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'feed.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// ---------------- INIT AFTER LOAD ----------------
function initFeed() {
  renderFeedMeta(FEED);
  currentItems = FEED.items ? [...FEED.items] : [];
  applyFilters();
}


function Button({ className, text, url = "#" }) {
  return (
    <a
      href={url}
      className={`${className} py-3 px-6 bg-purple-400 hover:bg-purple-300 text-purple-800 hover:text-purple-900 block rounded text-center shadow flex items-center justify-center leading-snug text-xs transition ease-in duration-150`}
    >
      {text}
    </a>
  );
}
