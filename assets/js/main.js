(function () {
  const Data = window.LaconetData;
  const directions = [
    { name: "低空网络", color: "teal", text: "低空空域中的通信、覆盖、移动接入与服务协同。" },
    { name: "边缘计算", color: "green", text: "面向移动终端和无人机平台的任务卸载与边缘智能。" },
    { name: "通感算融合", color: "blue", text: "通信、感知和计算资源的统一建模与跨层优化。" },
    { name: "资源分配", color: "amber", text: "频谱、功率、计算、缓存与轨迹资源的联合调度。" },
    { name: "强化学习", color: "rose", text: "面向动态网络环境的学习型优化与决策机制。" }
  ];

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return [...root.querySelectorAll(selector)];
  }

  function setHTML(selector, html) {
    const element = typeof selector === "string" ? qs(selector) : selector;
    if (element) element.innerHTML = html;
  }

  function activeNav(page) {
    const map = {
      home: "home",
      papers: "papers",
      "paper-detail": "papers",
      archive: "archive",
      equipment: "equipment",
      templates: "templates",
      directions: "directions"
    };
    qsa("[data-nav]").forEach((link) => {
      link.toggleAttribute("aria-current", link.dataset.nav === map[page]);
    });
  }

  function emptyState(title, detail) {
    return `<div class="empty-state"><strong>${Data.escapeHTML(title)}</strong><span>${Data.escapeHTML(detail)}</span></div>`;
  }

  function personList(value) {
    const people = Data.list(value);
    return people.length ? people.join("、") : "待定";
  }

  function paperURL(id) {
    return `paper.html?id=${encodeURIComponent(id)}`;
  }

  function materialLinksForPaper(paper) {
    return [
      Data.renderMaterialLink("PDF", paper.pdf),
      Data.renderMaterialLink("PPT", paper.ppt),
      paper.notes ? `<a class="material" href="${paperURL(paper.id)}">解读</a>` : "",
      Data.renderMaterialLink("代码", paper.code)
    ].filter(Boolean).join("");
  }

  function renderPaperCard(paper) {
    return `
      <article class="paper-card">
        <div class="paper-card-top">
          ${Data.renderStatus(paper.status)}
          <span>${Data.escapeHTML(paper.year)}</span>
        </div>
        <h3><a href="${paperURL(paper.id)}">${Data.escapeHTML(paper.title)}</a></h3>
        <p class="paper-meta">${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(personList(paper.presenter))} · ${Data.formatDate(paper.meeting_date)}</p>
        <p>${Data.escapeHTML(paper.summary)}</p>
        <div class="tag-row">${Data.renderTags(paper.tags)}</div>
        <div class="material-row">${materialLinksForPaper(paper)}</div>
      </article>
    `;
  }

  function renderMeetingMeta(meeting) {
    return `
      <dl class="meta-grid">
        <div><dt>时间</dt><dd>${Data.formatFullDate(meeting.date)} ${Data.escapeHTML(meeting.time)}</dd></div>
        <div><dt>地点</dt><dd>${Data.escapeHTML(meeting.location)} · ${Data.escapeHTML(meeting.mode)}</dd></div>
        <div><dt>主持人</dt><dd>${Data.escapeHTML(personList(meeting.host))}</dd></div>
        <div><dt>汇报人</dt><dd>${Data.escapeHTML(personList(meeting.presenter))}</dd></div>
      </dl>
    `;
  }

  async function initHome() {
    const [meetings, papers] = await Promise.all([Data.loadCSV("meetings"), Data.loadCSV("papers")]);
    const current = Data.findCurrentMeeting(meetings);
    const currentIds = Data.list(current.paper_ids);
    const currentPapers = papers.filter((paper) => currentIds.includes(paper.id) || paper.meeting_date === current.date);
    const archivedMeetings = meetings.filter((meeting) => meeting.status.includes("归档"));
    const todoItems = Data.list(current.todo);
    const next = Data.sortByDateAsc(meetings, "date").find((meeting) => Data.dateValue(meeting.date) > Data.dateValue(current.date));

    setHTML("#metricMeetingDate", Data.formatDate(current.date));
    setHTML("#metricPaperCount", String(papers.length));
    setHTML("#metricArchiveCount", String(archivedMeetings.length));
    setHTML("#metricTodoCount", String(todoItems.length));

    setHTML("#currentMeetingCard", `
      <div class="card-head">
        <p class="eyebrow">This Week</p>
        <h2>本周组会</h2>
        ${Data.renderStatus(current.status)}
      </div>
      <h3 class="feature-title">${Data.escapeHTML(current.topic)}</h3>
      ${renderMeetingMeta(current)}
      ${current.next_topic ? `<p class="meeting-note">${Data.escapeHTML(current.next_topic)}</p>` : ""}
      <div class="material-row">
        ${Data.renderMaterialLink("会议入口", current.materials)}
        ${Data.renderMaterialLink("记录", current.record)}
      </div>
    `);

    setHTML("#todoCard", `
      <div class="card-head">
        <p class="eyebrow">Tasks</p>
        <h2>待办提醒</h2>
      </div>
      ${todoItems.length ? `<ul class="check-list">${todoItems.map((item) => `<li>${Data.escapeHTML(item)}</li>`).join("")}</ul>` : emptyState("暂无待办", "本周组会资料已齐。")}
    `);

    setHTML("#currentPapersCard", `
      <div class="card-head">
        <p class="eyebrow">Reading</p>
        <h2>本周文献解读</h2>
      </div>
      <div class="paper-list">${currentPapers.map(renderPaperCard).join("") || emptyState("暂无文献", "在 papers.csv 中关联本周文献。")}</div>
    `);

    setHTML("#nextMeetingCard", `
      <div class="card-head">
        <p class="eyebrow">Next</p>
        <h2>下周预告</h2>
      </div>
      ${next ? `<h3 class="feature-title">${Data.escapeHTML(next.topic)}</h3>
      <p class="muted">${Data.formatFullDate(next.date)} ${Data.escapeHTML(next.time)}</p>
      <p>${Data.escapeHTML(next.next_topic || "待确认")}</p>` : emptyState("暂无预告", "后续组会尚未录入。")}
    `);

    setHTML("#recentMeetingsCard", `
      <div class="card-head">
        <p class="eyebrow">Archive</p>
        <h2>近期组会记录</h2>
      </div>
      <div class="compact-list">
        ${(archivedMeetings.length ? Data.sortByDateDesc(archivedMeetings, "date") : Data.sortByDateDesc(meetings, "date")).slice(0, 4).map((meeting) => `
          <a href="archive.html">
            <strong>${Data.escapeHTML(meeting.topic)}</strong>
            <span>${Data.formatDate(meeting.date)} · ${Data.escapeHTML(personList(meeting.presenter))}</span>
          </a>
        `).join("") || emptyState("暂无归档", "历史组会记录尚未录入。")}
      </div>
    `);

    setHTML("#latestPapersCard", `
      <div class="card-head">
        <p class="eyebrow">Library</p>
        <h2>最新归档文献</h2>
      </div>
      <div class="compact-list">
        ${Data.sortByDateDesc(papers, "meeting_date").slice(0, 4).map((paper) => `
          <a href="${paperURL(paper.id)}">
            <strong>${Data.escapeHTML(paper.title)}</strong>
            <span>${Data.escapeHTML(paper.direction)} · ${Data.escapeHTML(paper.year)}</span>
          </a>
        `).join("")}
      </div>
    `);

    setHTML("#homeDirections", directions.map((direction) => {
      const count = papers.filter((paper) => paper.direction === direction.name || Data.list(paper.tags).includes(direction.name)).length;
      return `<a class="direction-card ${direction.color}" href="directions.html#${encodeURIComponent(direction.name)}">
        <strong>${Data.escapeHTML(direction.name)}</strong>
        <span>${count} 篇文献</span>
      </a>`;
    }).join(""));

    const questions = papers.flatMap((paper) => Data.list(paper.discussion).map((question) => ({ question, paper }))).slice(0, 6);
    setHTML("#discussionQuestions", questions.map(({ question, paper }) => `
      <a href="${paperURL(paper.id)}">
        <strong>${Data.escapeHTML(question)}</strong>
        <span>${Data.escapeHTML(paper.direction)} · ${Data.escapeHTML(paper.presenter)}</span>
      </a>
    `).join("") || emptyState("暂无问题", "在 papers.csv 的 discussion 字段中补充。"));

    drawNetworkCanvas();
  }

  function fillSelect(select, values, label) {
    select.innerHTML = `<option value="">${label}</option>${values.map((value) => `<option value="${Data.escapeHTML(value)}">${Data.escapeHTML(value)}</option>`).join("")}`;
  }

  async function initPapers() {
    const papers = await Data.loadCSV("papers");
    const search = qs("#paperSearch");
    const direction = qs("#directionFilter");
    const year = qs("#yearFilter");
    const presenter = qs("#presenterFilter");
    const status = qs("#statusFilter");
    const grid = qs("#paperGrid");

    fillSelect(direction, Data.unique(papers.map((paper) => paper.direction)), "全部方向");
    fillSelect(year, Data.unique(papers.map((paper) => paper.year)).reverse(), "全部年份");
    fillSelect(presenter, Data.unique(papers.map((paper) => paper.presenter)), "全部汇报人");
    fillSelect(status, Data.unique(papers.map((paper) => paper.status)), "全部状态");

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const filtered = papers.filter((paper) => {
        const haystack = [paper.title, paper.authors, paper.venue, paper.presenter, paper.direction, paper.tags, paper.summary].join(" ").toLowerCase();
        return (!query || haystack.includes(query))
          && (!direction.value || paper.direction === direction.value)
          && (!year.value || paper.year === year.value)
          && (!presenter.value || paper.presenter === presenter.value)
          && (!status.value || paper.status === status.value);
      });

      setHTML("#paperResultCount", `${filtered.length} 篇文献`);
      setHTML("#paperResultMeta", direction.value || "全部方向");
      grid.innerHTML = filtered.map(renderPaperCard).join("") || emptyState("没有匹配文献", "调整筛选条件后查看。");
    }

    [search, direction, year, presenter, status].forEach((control) => {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    });

    qs("#resetFilters").addEventListener("click", () => {
      [search, direction, year, presenter, status].forEach((control) => {
        control.value = "";
      });
      applyFilters();
    });

    applyFilters();
  }

  async function initPaperDetail() {
    const id = new URLSearchParams(window.location.search).get("id");
    const papers = await Data.loadCSV("papers");
    const paper = papers.find((item) => item.id === id) || papers[0];

    if (!paper) {
      setHTML("#paperHero", emptyState("未找到文献", "请先在 papers.csv 中新增文献。"));
      setHTML("#paperArticle", "");
      return;
    }

    document.title = `${paper.title} | LACONET`;
    setHTML("#paperHero", `
      <p class="eyebrow">${Data.escapeHTML(paper.direction)}</p>
      <h1>${Data.escapeHTML(paper.title)}</h1>
      <p class="summary">${Data.escapeHTML(paper.summary)}</p>
      <div class="paper-hero-meta">
        <span>${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(paper.year)}</span>
        <span>汇报人：${Data.escapeHTML(paper.presenter)}</span>
        <span>${Data.formatFullDate(paper.meeting_date)}</span>
        ${Data.renderStatus(paper.status)}
      </div>
      <div class="tag-row">${Data.renderTags(paper.tags)}</div>
      <div class="material-row">${materialLinksForPaper(paper)}</div>
    `);

    if (!paper.notes) {
      setHTML("#paperArticle", emptyState("暂无 Markdown 解读", "在 papers.csv 的 notes 字段中填写解读路径。"));
      return;
    }

    try {
      const markdown = await Data.fetchText(paper.notes);
      const parsed = Data.parseFrontMatter(markdown);
      setHTML("#paperArticle", Data.markdownToHTML(parsed.body));
      buildTOC();
    } catch (error) {
      setHTML("#paperArticle", emptyState("无法读取解读文件", error.message));
    }
  }

  function buildTOC() {
    const headings = qsa(".article-body h2, .article-body h3");
    setHTML("#paperToc", headings.map((heading) => `<a href="#${heading.id}" class="toc-${heading.tagName.toLowerCase()}">${heading.textContent}</a>`).join(""));
  }

  async function initArchive() {
    const [meetings, papers] = await Promise.all([Data.loadCSV("meetings"), Data.loadCSV("papers")]);
    const byId = new Map(papers.map((paper) => [paper.id, paper]));
    const archived = Data.sortByDateDesc(meetings.filter((meeting) => meeting.status.includes("归档")), "date");

    setHTML("#archiveTimeline", archived.map((meeting) => {
      const related = Data.list(meeting.paper_ids).map((id) => byId.get(id)).filter(Boolean);
      return `
        <article class="archive-item">
          <div class="archive-date">
            <strong>${Data.formatDate(meeting.date)}</strong>
            <span>${Data.escapeHTML(meeting.time)}</span>
          </div>
          <div class="archive-content">
            <div class="card-head">
              <h2>${Data.escapeHTML(meeting.topic)}</h2>
              ${Data.renderStatus(meeting.status)}
            </div>
            ${renderMeetingMeta(meeting)}
            <div class="archive-papers">
              ${related.map((paper) => `<a href="${paperURL(paper.id)}">${Data.escapeHTML(paper.title)}<span>${Data.escapeHTML(paper.direction)} · ${Data.escapeHTML(paper.presenter)}</span></a>`).join("") || "<span class='muted'>未关联文献</span>"}
            </div>
            <div class="material-row">
              ${Data.renderMaterialLink("资料", meeting.materials)}
              ${Data.renderMaterialLink("记录", meeting.record)}
            </div>
          </div>
        </article>
      `;
    }).join("") || emptyState("暂无历史归档", "完成组会后，将 status 标记为“已归档”即可在这里显示。"));
  }

  function equipmentStatusClass(status) {
    if (status.includes("使用中")) return "equipment-status in-use";
    if (status.includes("维护")) return "equipment-status maintenance";
    if (status.includes("可")) return "equipment-status available";
    if (status.includes("待")) return "equipment-status pending";
    if (status.includes("完成")) return "equipment-status done";
    return "equipment-status";
  }

  function renderEquipmentStatus(status) {
    return `<span class="${equipmentStatusClass(status || "待确认")}">${Data.escapeHTML(status || "待确认")}</span>`;
  }

  function dateTimeValue(value) {
    const parsed = new Date(String(value || "").replace(" ", "T"));
    return Number.isNaN(parsed.valueOf()) ? 0 : parsed.valueOf();
  }

  function formatUsageTime(value) {
    if (!value) return "--";
    const [date = "", time = ""] = String(value).split(" ");
    return `${date.slice(5) || date} ${time.slice(0, 5)}`.trim();
  }

  function renderEquipmentLink(value) {
    if (!value || value === "内部链接") {
      return `<span class="material disabled">登记 · 内部</span>`;
    }
    return `<a class="material" href="${Data.escapeHTML(value)}">登记</a>`;
  }

  function renderEquipmentCard(equipment) {
    return `
      <article class="equipment-card">
        <div class="paper-card-top">
          ${renderEquipmentStatus(equipment.status)}
          <span>${Data.escapeHTML(equipment.category)}</span>
        </div>
        <h3>${Data.escapeHTML(equipment.name)}</h3>
        <dl class="equipment-meta">
          <div><dt>位置</dt><dd>${Data.escapeHTML(equipment.location)}</dd></div>
          <div><dt>负责人</dt><dd>${Data.escapeHTML(equipment.manager || "待定")}</dd></div>
          <div><dt>预约要求</dt><dd>${equipment.booking_required === "是" ? "需预约" : "登记即可"}</dd></div>
        </dl>
        <p>${Data.escapeHTML(equipment.notes)}</p>
        <div class="material-row">${renderEquipmentLink(equipment.form_link)}</div>
      </article>
    `;
  }

  async function initEquipment() {
    const [equipment, usage] = await Promise.all([Data.loadCSV("equipment"), Data.loadCSV("equipmentUsage")]);
    const byId = new Map(equipment.map((item) => [item.id, item]));
    const availableCount = equipment.filter((item) => item.status.includes("可")).length;
    const usingCount = equipment.filter((item) => item.status.includes("使用中")).length;
    const pendingUsage = usage.filter((item) => item.status.includes("待")).length;
    const formLinks = Data.unique(equipment.map((item) => item.form_link)).filter((link) => link && link !== "内部链接");

    setHTML("#metricEquipmentTotal", String(equipment.length));
    setHTML("#metricEquipmentAvailable", String(availableCount));
    setHTML("#metricEquipmentUsing", String(usingCount));
    setHTML("#metricUsagePending", String(pendingUsage));

    setHTML("#equipmentGrid", equipment.map(renderEquipmentCard).join("") || emptyState("暂无设备", "设备台账尚未录入。"));

    setHTML("#registrationCard", `
      <div class="card-head">
        <p class="eyebrow">Register</p>
        <h2>使用登记入口</h2>
      </div>
      <p>提交前请确认设备状态、预计使用时段和负责人。</p>
      ${formLinks.length
        ? formLinks.map((link) => `<a class="button primary full" href="${Data.escapeHTML(link)}">打开登记表单</a>`).join("")
        : `<span class="button primary full disabled-action">登记表单待配置</span>`}
    `);

    const sortedUsage = [...usage].sort((a, b) => dateTimeValue(b.start_time) - dateTimeValue(a.start_time));
    setHTML("#usageList", sortedUsage.map((record) => {
      const item = byId.get(record.equipment_id);
      return `
        <article class="usage-item">
          <div class="usage-time">
            <strong>${formatUsageTime(record.start_time)}</strong>
            <span>${formatUsageTime(record.end_time)}</span>
          </div>
          <div class="usage-content">
            <div class="card-head">
              <h3>${Data.escapeHTML(item?.name || record.equipment_id)}</h3>
              ${renderEquipmentStatus(record.status)}
            </div>
            <p>${Data.escapeHTML(record.purpose)}</p>
            <div class="usage-meta">
              <span>使用人：${Data.escapeHTML(record.user)}</span>
              <span>位置：${Data.escapeHTML(item?.location || "待确认")}</span>
              ${record.remark ? `<span>备注：${Data.escapeHTML(record.remark)}</span>` : ""}
            </div>
          </div>
        </article>
      `;
    }).join("") || emptyState("暂无使用记录", "近期还没有设备登记。"));
  }

  async function initTemplates() {
    const templates = {
      literature: {
        title: "文献解读模板",
        path: "templates/literature-note-template.md",
        filename: "literature-note-template.md"
      },
      meeting: {
        title: "组会记录模板",
        path: "templates/meeting-record-template.md",
        filename: "meeting-record-template.md"
      },
      slides: {
        title: "PPT 检查清单",
        path: "templates/slides-checklist.md",
        filename: "slides-checklist.md"
      }
    };

    async function loadTemplate(key) {
      const template = templates[key];
      if (!template) throw new Error("模板不存在");
      const markdown = await Data.fetchText(template.path);
      return { ...template, markdown };
    }

    async function previewTemplate(key) {
      try {
        const template = await loadTemplate(key);
        setHTML("#templatePreviewTitle", `${Data.escapeHTML(template.title)}预览`);
        setHTML("#templatePreview", Data.markdownToHTML(template.markdown));
        qsa("[data-template-select]").forEach((button) => {
          button.toggleAttribute("aria-pressed", button.dataset.templateSelect === key);
        });
      } catch (error) {
        setHTML("#templatePreview", emptyState("无法读取模板", error.message));
      }
    }

    function downloadTemplate(template) {
      const blob = new Blob(["\ufeff", template.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = template.filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }

    async function copyTemplate(template, button) {
      try {
        await navigator.clipboard.writeText(template.markdown);
        const original = button.textContent;
        button.textContent = "已复制";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1400);
      } catch (error) {
        setHTML("#templatePreview", `<div class="alert">复制失败：${Data.escapeHTML(error.message)}</div>${Data.markdownToHTML(template.markdown)}`);
      }
    }

    qsa("[data-template-select]").forEach((button) => {
      button.addEventListener("click", () => previewTemplate(button.dataset.templateSelect));
    });

    qsa("[data-template-download]").forEach((button) => {
      button.addEventListener("click", async () => {
        const template = await loadTemplate(button.dataset.templateDownload);
        downloadTemplate(template);
      });
    });

    qsa("[data-template-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const template = await loadTemplate(button.dataset.templateCopy);
        await copyTemplate(template, button);
      });
    });

    await previewTemplate("literature");
  }

  async function initDirections() {
    const papers = await Data.loadCSV("papers");
    setHTML("#directionMap", directions.map((direction) => {
      const related = papers.filter((paper) => paper.direction === direction.name || Data.list(paper.tags).includes(direction.name));
      return `
        <article class="direction-detail ${direction.color}" id="${encodeURIComponent(direction.name)}">
          <div>
            <p class="eyebrow">${related.length} Papers</p>
            <h2>${Data.escapeHTML(direction.name)}</h2>
            <p>${Data.escapeHTML(direction.text)}</p>
          </div>
          <div class="compact-list">
            ${related.slice(0, 5).map((paper) => `
              <a href="${paperURL(paper.id)}">
                <strong>${Data.escapeHTML(paper.title)}</strong>
                <span>${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(paper.year)}</span>
              </a>
            `).join("") || "<span class='muted'>暂无文献</span>"}
          </div>
        </article>
      `;
    }).join(""));
  }

  function drawNetworkCanvas() {
    const canvas = qs("#networkCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const nodes = [
      { x: 110, y: 260, r: 8, type: "ground" },
      { x: 230, y: 225, r: 8, type: "ground" },
      { x: 355, y: 250, r: 8, type: "ground" },
      { x: 520, y: 222, r: 8, type: "ground" },
      { x: 160, y: 115, r: 11, type: "air" },
      { x: 360, y: 88, r: 11, type: "air" },
      { x: 575, y: 128, r: 11, type: "air" },
      { x: 360, y: 170, r: 14, type: "edge" }
    ];
    const links = [[0, 4], [1, 4], [1, 7], [2, 7], [3, 6], [4, 5], [5, 6], [5, 7], [6, 7]];
    const colors = {
      air: "#0f5c64",
      edge: "#d98c18",
      ground: "#64748b"
    };
    let frame = 0;

    function draw() {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f7faf9";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#d6e0df";
      ctx.lineWidth = 1;
      for (let x = 60; x < width; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 50);
        ctx.lineTo(x + 40, height - 42);
        ctx.stroke();
      }

      links.forEach(([a, b], index) => {
        const from = nodes[a];
        const to = nodes[b];
        const pulse = (Math.sin(frame / 22 + index) + 1) / 2;
        ctx.strokeStyle = `rgba(15, 92, 100, ${0.18 + pulse * 0.32})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      ctx.fillStyle = "#e7eceb";
      ctx.fillRect(70, 282, 580, 2);

      nodes.forEach((node, index) => {
        const bob = node.type === "air" ? Math.sin(frame / 28 + index) * 5 : 0;
        const x = node.x;
        const y = node.y + bob;
        ctx.fillStyle = "rgba(15, 92, 100, 0.08)";
        ctx.beginPath();
        ctx.arc(x, y, node.r + 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors[node.type];
        ctx.beginPath();
        ctx.arc(x, y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      ctx.fillStyle = "#1f2933";
      ctx.font = "600 18px system-ui, sans-serif";
      ctx.fillText("Low-Altitude Computing Network", 42, 48);
      ctx.font = "14px system-ui, sans-serif";
      ctx.fillStyle = "#64748b";
      ctx.fillText("Task flow · edge intelligence · seminar archive", 42, 72);

      frame += 1;
      window.requestAnimationFrame(draw);
    }

    draw();
  }

  async function boot() {
    const page = document.body.dataset.page;
    activeNav(page);
    setHTML("#currentYear", String(new Date().getFullYear()));

    try {
      if (page === "home") await initHome();
      if (page === "papers") await initPapers();
      if (page === "paper-detail") await initPaperDetail();
      if (page === "archive") await initArchive();
      if (page === "equipment") await initEquipment();
      if (page === "templates") await initTemplates();
      if (page === "directions") await initDirections();
    } catch (error) {
      const target = qs(".page-shell");
      if (target) {
        target.insertAdjacentHTML("afterbegin", `<div class="alert">${Data.escapeHTML(error.message)}</div>`);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
