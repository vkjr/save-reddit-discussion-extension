# Save Reddit Discussion

A tiny browser extension that adds a **Save Thread** button on Reddit comment pages. Click it and the post + all comments get saved to a `.txt` file on your computer, with comment nesting preserved as indentation.

## What it does

- Works on any Reddit thread page (`reddit.com/r/<sub>/comments/...` and `sh.reddit.com/r/<sub>/comments/...`)
- Adds a small orange "Save Thread" button in the bottom-right corner
- On click, parses the post (title, author, body) and every comment (author, score, depth) and downloads them as one plain-text file
- Filename: `reddit-r-<subreddit>-<slug-of-title>.txt`
- Skips AutoModerator comments
- Indents replies by depth so the conversation tree is readable

## Privacy & safety

This extension is intentionally minimal. It:

- Requests **no host permissions** beyond running on Reddit thread pages
- Has **no network access** - it does not fetch, send, or sync anything anywhere
- Does **not read** cookies, storage, history, tabs, or any other browser data
- Does **not modify** the Reddit page beyond adding one button
- Only writes a local text file via the standard browser download flow

You can read all of the source - it's three files (`manifest.json`, `content.js`, `styles.css`), under 200 lines total.

## Install (Chrome / Edge / Brave / Arc / Opera)

1. Download this repo: either `git clone` it or click **Code -> Download ZIP** on GitHub and unzip it.
2. Open `chrome://extensions/` (or `edge://extensions/`, `brave://extensions/`, etc.).
3. Turn on **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the folder that contains `manifest.json`.
6. Done. Visit any Reddit thread - a "Save Thread" button will appear in the bottom-right.

> Keep the folder where it is. Chrome reads the files from disk every time, so if you delete or move the folder the extension stops working.

### Updating after editing files

If you modify the source, go back to `chrome://extensions/` and click the reload icon on the extension card.

## Install (Firefox)

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select the `manifest.json` file inside the extension folder.
4. Visit any Reddit thread - the button appears bottom-right.

> Firefox unloads temporary add-ons when the browser restarts, so you'll need to load it again next time. (Permanent install requires signing through addons.mozilla.org.)

## Usage

1. Open any Reddit thread.
2. Click the orange **Save Thread** button (bottom-right).
3. The browser downloads a `.txt` file with the post and all comments.
4. The button briefly turns green and shows how many comments were saved.

## Output format

```
# <post title>
r/<subreddit> - posted by u/<author>
https://www.reddit.com/r/<sub>/comments/...

<post body, if any>

--- N comments ---

--- u/user1 (12 upvotes) ---
top-level comment text

  --- u/user2 (3 upvotes) ---
  reply to user1

    --- u/user3 (1 upvotes) ---
    reply to user2
```

## Limitations

- Only saves comments currently rendered on the page. If the thread has hidden / collapsed branches or "load more comments" buttons that haven't been expanded, those won't be captured. Expand them before clicking Save.
- Relies on Reddit's current `<shreddit-post>` / `<shreddit-comment>` elements (the new Reddit DOM). If Reddit changes their markup, the extension will need an update.
- No support for old.reddit.com.

## License

MIT
