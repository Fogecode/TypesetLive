/**
 * Bridge script injected into the preview iframe right before </body>.
 *
 * The frame is sandboxed ("allow-scripts" only), so it has an opaque origin
 * and no clipboard/navigation rights: copies, link clicks and theme sync all
 * travel through postMessage to the Obsidian host. It runs next to Typeset's
 * own page runtime and reuses the markup that runtime already emits.
 */
export const PREVIEW_BRIDGE_JS = `
(function () {
  var SEND = function (msg) { try { parent.postMessage(msg, "*"); } catch (e) {} };

  function applyTheme(id) {
    if (!id) return;
    document.body.setAttribute("data-theme", id);
    var btns = document.querySelectorAll(".hx-theme-btn");
    var label = null;
    for (var i = 0; i < btns.length; i++) {
      var btn = btns[i];
      var on = btn.getAttribute("data-theme") === id;
      if (on) {
        btn.classList.add("is-active");
        label = btn.getAttribute("data-name") || btn.textContent;
      } else {
        btn.classList.remove("is-active");
      }
    }
    var nameEl = document.querySelector("[data-theme-name]");
    if (nameEl && label) nameEl.textContent = label;
  }

  SEND({
    type: "preview-ready",
    scrollY: window.pageYOffset || 0,
    height: document.documentElement.scrollHeight
  });

  var lastScrollMsg = 0;
  window.addEventListener("scroll", function () {
    var now = Date.now();
    if (now - lastScrollMsg < 150) return;
    lastScrollMsg = now;
    SEND({ type: "preview-scroll", y: window.pageYOffset || 0 });
  });

  window.addEventListener("message", function (ev) {
    var data = ev.data;
    if (!data || typeof data !== "object") return;
    if (data.type === "set-theme") {
      applyTheme(String(data.id || ""));
    } else if (data.type === "scroll-to") {
      window.scrollTo(0, Math.max(0, Number(data.y) || 0));
    } else if (data.type === "copy-done") {
      flashCopyButton(data.ok === true);
    }
  });

  // In-page theme switcher clicks flow back so the toolbar dropdown stays in sync.
  var switcher = document.querySelector(".hx-theme-switcher");
  if (switcher) {
    switcher.addEventListener("click", function (ev) {
      var node = ev.target;
      while (node && node !== switcher) {
        if (node.getAttribute && node.getAttribute("data-theme")) {
          SEND({ type: "theme-changed", id: node.getAttribute("data-theme") });
          return;
        }
        node = node.parentNode;
      }
    });
  }

  var pendingCopyButton = null;

  function flashCopyButton(ok) {
    var btn = pendingCopyButton;
    if (!btn) return;
    btn.textContent = ok ? "Copied!" : "Copy";
    if (ok) btn.classList.add("is-copied");
    else btn.classList.remove("is-copied");
    setTimeout(function () {
      btn.textContent = "Copy";
      btn.classList.remove("is-copied");
    }, 1600);
  }

  // All link clicks route through the host: wikilinks and relative .md links
  // open notes inside Obsidian, external schemes open the system browser.
  document.addEventListener("click", function (ev) {
    var node = ev.target;
    while (node && node !== document && !(node.tagName === "A")) node = node.parentNode;
    if (!node || !node.getAttribute) return;
    var cls = node.classList || null;
    var href = node.getAttribute("href") || "";
    if (cls && cls.contains("hx-wikilink")) {
      ev.preventDefault();
      SEND({ type: "open-note", note: node.getAttribute("data-note") || "" });
      return;
    }
    if (/^(https?:|obsidian:|mailto:)/i.test(href)) {
      ev.preventDefault();
      SEND({ type: "open-external", url: href });
      return;
    }
    if (href && href.charAt(0) !== "#" && href.indexOf("javascript:") !== 0) {
      ev.preventDefault();
      var target = href.replace(/^\\.\\//, "").replace(/\\.md$/i, "");
      try { target = decodeURIComponent(target); } catch (e) {}
      SEND({ type: "open-note", note: target });
    }
  }, true);

  // Copy buttons are intercepted before the page runtime so the write happens
  // through the host clipboard (the sandbox blocks the frame's own).
  document.addEventListener("click", function (ev) {
    var node = ev.target;
    while (node && node !== document && !(node.classList && node.classList.contains("hx-copy-btn"))) {
      node = node.parentNode;
    }
    if (!node || !node.classList || !node.classList.contains("hx-copy-btn")) return;
    ev.preventDefault();
    ev.stopPropagation();
    var pre = node.closest ? node.closest("pre") : null;
    var code = pre ? pre.querySelector("code") : null;
    if (!code) return;
    pendingCopyButton = node;
    SEND({ type: "copy-code", text: code.innerText });
  }, true);
})();
`;

/** Inject the bridge right before </body>, after the page runtime. */
export function injectPreviewBridge(html: string): string {
  const tag = "<script>" + PREVIEW_BRIDGE_JS + "</scr" + "ipt>";
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, tag + "</body>");
  return html + tag;
}
