function parseThread() {
  const post = document.querySelector("shreddit-post");
  if (!post) return null;

  const title = post.getAttribute("post-title") || "Untitled";
  const subreddit = post.getAttribute("subreddit-prefixed-name") || "";
  const author = post.getAttribute("author") || "";
  const permalink = post.getAttribute("permalink") || "";

  const bodyEl = post.querySelector(
    'div[slot="text-body"] .md'
  );
  const bodyText = bodyEl ? bodyEl.innerText.trim() : "";

  const comments = [];
  document.querySelectorAll("shreddit-comment").forEach((el) => {
    const cAuthor = el.getAttribute("author") || "";
    if (cAuthor === "AutoModerator") return;

    const score = el.getAttribute("score") || "0";
    const depth = el.getAttribute("depth") || "0";

    const contentEl = el.querySelector('div[slot="comment"]');
    const text = contentEl ? contentEl.innerText.trim() : "";
    if (!text) return;

    comments.push({ author: cAuthor, score, depth: parseInt(depth), text });
  });

  return { title, subreddit, author, permalink, bodyText, comments };
}

function formatThread(data) {
  const lines = [];
  lines.push(`# ${data.title}`);
  lines.push(`${data.subreddit} - posted by u/${data.author}`);
  lines.push(`https://www.reddit.com${data.permalink}`);
  lines.push("");

  if (data.bodyText) {
    lines.push(data.bodyText);
    lines.push("");
  }

  lines.push(`--- ${data.comments.length} comments ---`);
  lines.push("");

  for (const c of data.comments) {
    const indent = "  ".repeat(c.depth);
    lines.push(`${indent}--- u/${c.author} (${c.score} upvotes) ---`);
    const textLines = c.text.split("\n");
    for (const tl of textLines) {
      lines.push(`${indent}${tl}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function injectButton() {
  if (document.querySelector(".reddit-saver-btn")) return;

  const btn = document.createElement("button");
  btn.className = "reddit-saver-btn";
  btn.textContent = "Save Thread";

  btn.addEventListener("click", () => {
    const data = parseThread();
    if (!data) {
      btn.textContent = "Error: no post found";
      setTimeout(() => (btn.textContent = "Save Thread"), 2000);
      return;
    }

    const formatted = formatThread(data);
    const filename = `reddit-${data.subreddit.replace("/", "-")}-${slugify(data.title)}.txt`;
    downloadFile(filename, formatted);

    btn.textContent = `Saved! (${data.comments.length} comments)`;
    btn.classList.add("reddit-saver-btn--success");
    setTimeout(() => {
      btn.textContent = "Save Thread";
      btn.classList.remove("reddit-saver-btn--success");
    }, 3000);
  });

  document.body.appendChild(btn);
}

// Reddit loads content dynamically, wait for the post to appear
const observer = new MutationObserver(() => {
  if (document.querySelector("shreddit-post")) {
    injectButton();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Also try immediately
if (document.querySelector("shreddit-post")) {
  injectButton();
}
