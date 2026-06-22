(function () {
  const cache = new Map();

  const DATA = {
    meetings: "data/meetings.csv",
    papers: "data/papers.csv",
    equipment: "data/equipment.csv",
    equipmentUsage: "data/equipment-usage.csv"
  };

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function fetchText(path) {
    if (cache.has(path)) return cache.get(path);
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`无法读取 ${path}`);
    }
    const text = await response.text();
    cache.set(path, text);
    return text;
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (quoted) {
        if (char === '"' && next === '"') {
          cell += '"';
          i += 1;
        } else if (char === '"') {
          quoted = false;
        } else {
          cell += char;
        }
        continue;
      }

      if (char === '"') {
        quoted = true;
      } else if (char === ",") {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\n") {
        row.push(cell.trim());
        rows.push(row);
        row = [];
        cell = "";
      } else if (char !== "\r") {
        cell += char;
      }
    }

    if (cell.length || row.length) {
      row.push(cell.trim());
      rows.push(row);
    }

    const [headers, ...body] = rows.filter((items) => items.some(Boolean));
    if (!headers) return [];

    return body.map((items) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = items[index] ?? "";
      });
      return record;
    });
  }

  async function loadCSV(name) {
    const text = await fetchText(DATA[name]);
    return parseCSV(text);
  }

  function list(value) {
    return String(value || "")
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function dateValue(value) {
    if (!value) return 0;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.valueOf()) ? 0 : parsed.valueOf();
  }

  function todayStart() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
  }

  function formatDate(value) {
    if (!value) return "--";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.valueOf())) return value;
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short"
    }).format(parsed);
  }

  function formatFullDate(value) {
    if (!value) return "--";
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.valueOf())) return value;
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short"
    }).format(parsed);
  }

  function sortByDateDesc(items, key = "date") {
    return [...items].sort((a, b) => dateValue(b[key]) - dateValue(a[key]));
  }

  function sortByDateAsc(items, key = "date") {
    return [...items].sort((a, b) => dateValue(a[key]) - dateValue(b[key]));
  }

  function findCurrentMeeting(meetings) {
    const today = todayStart();
    const future = sortByDateAsc(meetings, "date").find((meeting) => dateValue(meeting.date) >= today);
    return future || sortByDateDesc(meetings, "date")[0];
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));
  }

  function statusClass(status) {
    if (status.includes("待")) return "status pending";
    if (status.includes("归档")) return "status archived";
    if (status.includes("补充")) return "status warning";
    return "status";
  }

  function renderTags(tags, extraClass = "") {
    return list(tags)
      .map((tag) => `<span class="tag ${extraClass}">${escapeHTML(tag)}</span>`)
      .join("");
  }

  function renderStatus(status) {
    return `<span class="${statusClass(status || "待确认")}">${escapeHTML(status || "待确认")}</span>`;
  }

  function isLink(value) {
    return /^https?:\/\//i.test(value) || /^[\w./-]+\.(html|md|pdf|ppt|pptx|docx?|xlsx?)$/i.test(value) || value.startsWith("notes/") || value.startsWith("templates/");
  }

  function renderMaterialLink(label, value) {
    if (!value) return "";
    if (value === "内部链接") {
      return `<span class="material disabled">${escapeHTML(label)} · 内部</span>`;
    }
    if (isLink(value)) {
      return `<a class="material" href="${escapeHTML(value)}">${escapeHTML(label)}</a>`;
    }
    return `<span class="material disabled">${escapeHTML(label)} · ${escapeHTML(value)}</span>`;
  }

  function parseFrontMatter(markdown) {
    if (!markdown.startsWith("---")) return { meta: {}, body: markdown };
    const end = markdown.indexOf("\n---", 3);
    if (end === -1) return { meta: {}, body: markdown };

    const raw = markdown.slice(3, end).trim();
    const body = markdown.slice(end + 4).trim();
    const meta = {};
    let currentKey = "";

    raw.split(/\r?\n/).forEach((line) => {
      const listItem = line.match(/^\s*-\s*(.+?)\s*$/);
      if (listItem && currentKey) {
        if (!Array.isArray(meta[currentKey])) meta[currentKey] = [];
        meta[currentKey].push(listItem[1]);
        return;
      }

      const pair = line.match(/^([^:]+):\s*(.*)$/);
      if (!pair) return;
      currentKey = pair[1].trim();
      const value = pair[2].trim();
      meta[currentKey] = value || [];
    });

    return { meta, body };
  }

  function slugify(text, index) {
    const base = String(text || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base || `section-${index}`;
  }

  function inlineMarkdown(text) {
    return escapeHTML(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function renderTable(lines) {
    const rows = lines.map((line) => line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim()));
    const header = rows[0] || [];
    const body = rows.slice(2);
    return `<table><thead><tr>${header.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${body
      .map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
  }

  function markdownToHTML(markdown) {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const html = [];
    let paragraph = [];
    let listItems = [];
    let orderedItems = [];
    let code = [];
    let inCode = false;
    let table = [];
    let sectionIndex = 0;

    function flushParagraph() {
      if (!paragraph.length) return;
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }

    function flushList() {
      if (listItems.length) {
        html.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ul>`);
        listItems = [];
      }
      if (orderedItems.length) {
        html.push(`<ol>${orderedItems.map((item) => `<li>${inlineMarkdown(item)}</li>`).join("")}</ol>`);
        orderedItems = [];
      }
    }

    function flushTable() {
      if (table.length) {
        html.push(renderTable(table));
        table = [];
      }
    }

    lines.forEach((line) => {
      if (line.startsWith("```")) {
        if (inCode) {
          html.push(`<pre><code>${escapeHTML(code.join("\n"))}</code></pre>`);
          code = [];
          inCode = false;
        } else {
          flushParagraph();
          flushList();
          flushTable();
          inCode = true;
        }
        return;
      }

      if (inCode) {
        code.push(line);
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        flushList();
        flushTable();
        return;
      }

      if (/^\|.+\|$/.test(line)) {
        flushParagraph();
        flushList();
        table.push(line);
        return;
      }

      flushTable();

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        const text = heading[2].trim();
        const id = slugify(text, sectionIndex += 1);
        html.push(`<h${level} id="${id}">${inlineMarkdown(text)}</h${level}>`);
        return;
      }

      const unordered = line.match(/^[-*]\s+(.+)$/);
      if (unordered) {
        flushParagraph();
        orderedItems = [];
        listItems.push(unordered[1]);
        return;
      }

      const ordered = line.match(/^\d+\.\s+(.+)$/);
      if (ordered) {
        flushParagraph();
        listItems = [];
        orderedItems.push(ordered[1]);
        return;
      }

      const quote = line.match(/^>\s+(.+)$/);
      if (quote) {
        flushParagraph();
        flushList();
        html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
        return;
      }

      paragraph.push(line.trim());
    });

    flushParagraph();
    flushList();
    flushTable();

    if (inCode) {
      html.push(`<pre><code>${escapeHTML(code.join("\n"))}</code></pre>`);
    }

    return html.join("\n");
  }

  window.LaconetData = {
    escapeHTML,
    fetchText,
    loadCSV,
    list,
    dateValue,
    formatDate,
    formatFullDate,
    sortByDateDesc,
    sortByDateAsc,
    findCurrentMeeting,
    unique,
    renderTags,
    renderStatus,
    renderMaterialLink,
    parseFrontMatter,
    markdownToHTML
  };
})();
