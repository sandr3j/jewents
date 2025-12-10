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
