"use strict";

// CREDIT: https://leanrada.com/notes/simple-live-reload
// ACHIVE: https://web.archive.org/web/20250418234708/https://leanrada.com/notes/simple-live-reload/

let watching = new Set();
watch(location.href);

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    watch(entry.name);
  }
}).observe({ type: "resource", buffered: true });

function watch(urlString) {
  if (!urlString) return;
  const url = new URL(urlString);
  if (url.origin !== location.origin) return;

  if (watching.has(url.pathname)) return;
  watching.add(url.pathname);

  console.log("watching", url.pathname);

  let lastModified, etag;

  async function check() {
    const res = await fetch(url, { method: "head" });
    const newLastModified = res.headers.get("Last-Modified");
    const newETag = res.headers.get("ETag");

    if (
      (lastModified !== undefined || etag !== undefined) &&
      (lastModified !== newLastModified || etag !== newETag)
    ) {
      location.reload();
    }

    lastModified = newLastModified;
    etag = newETag;
  }

  setInterval(check, 1000);
}

