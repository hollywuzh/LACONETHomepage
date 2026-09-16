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
      "report-detail": "papers",
      "meeting-detail": "archive",
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

  function paperPid(paper) {
    return paper?.pid || paper?.id || "";
  }

  function reportRid(report) {
    return report?.rid || report?.id || "";
  }

  function reportPid(report) {
    return report?.pid || report?.paper_id || "";
  }

  function reportDate(report) {
    return report?.report_date || report?.meeting_date || "";
  }

  function paperURL(pid) {
    return `paper.html?pid=${encodeURIComponent(pid)}`;
  }

  function reportURL(rid) {
    return `report.html?rid=${encodeURIComponent(rid)}`;
  }

  function meetingURL(id) {
    return `meeting.html?id=${encodeURIComponent(id)}`;
  }

  function reportsForPaper(paper, reports) {
    const pid = paperPid(paper);
    return Data.sortByDateDesc(reports.filter((report) => reportPid(report) === pid), "report_date");
  }

  function reportIdsForMeeting(meeting) {
    return Data.list(meeting.report_ids || meeting.paper_ids);
  }

  function reportsForMeeting(meeting, reports) {
    const ids = reportIdsForMeeting(meeting);
    if (ids.length) {
      return ids.map((id) => reports.find((report) => reportRid(report) === id)).filter(Boolean);
    }
    return reports.filter((report) => report.meeting_id === meeting.id || reportDate(report) === meeting.date);
  }

  function reportPresenterList(reports) {
    const presenters = Data.unique(reports.map((report) => report.presenter));
    return presenters.length ? presenters.join("、") : "待定";
  }

  function reportCountText(reports) {
    if (!reports.length) return "暂无 RID";
    return `${reports.length} 次汇报`;
  }

  function meetingRecordLabel(meeting) {
    return meeting.status === "待举行" ? "组会预告" : "会议纪要";
  }

  function renderMeetingRecordLink(meeting) {
    if (!meeting.record) return "";
    if (meeting.record === "内部链接") {
      return `<span class="material disabled">${meetingRecordLabel(meeting)} · 内部</span>`;
    }
    if (/^https?:\/\//i.test(meeting.record)) {
      return `<a class="material" href="${Data.escapeHTML(meeting.record)}">${meetingRecordLabel(meeting)}</a>`;
    }
    return `<a class="material" href="${meetingURL(meeting.id)}">${meetingRecordLabel(meeting)}</a>`;
  }

  function materialLinksForPaper(paper, reports = []) {
    const latest = reports[0];
    return [
      Data.renderMaterialLink("PDF", paper.pdf),
      latest?.notes ? `<a class="material" href="${reportURL(reportRid(latest))}">最新解读</a>` : "",
      latest ? Data.renderMaterialLink("最新 PPT", latest.ppt) : "",
      latest ? Data.renderMaterialLink("汇报 Word", latest.docx) : "",
      Data.renderMaterialLink("代码", paper.code)
    ].filter(Boolean).join("");
  }

  function materialLinksForReport(report, paper = {}, includeNotes = true) {
    return [
      Data.renderMaterialLink("PDF", paper.pdf),
      Data.renderMaterialLink("PPT", report.ppt),
      Data.renderMaterialLink("汇报 Word", report.docx),
      includeNotes && report.notes ? `<a class="material" href="${reportURL(reportRid(report))}">解读</a>` : "",
      Data.renderMaterialLink("代码", report.code || paper.code)
    ].filter(Boolean).join("");
  }

  function renderPaperCard(paper, reports = []) {
    const pid = paperPid(paper);
    const latest = reports[0];
    const meta = latest
      ? `${reportPresenterList(reports)} · 最新 ${Data.formatDate(reportDate(latest))} · ${reportCountText(reports)}`
      : "暂无汇报记录";
    return `
      <article class="paper-card">
        <div class="paper-card-top">
          ${Data.renderStatus(paper.status)}
          <span>${Data.escapeHTML(paper.year)}</span>
        </div>
        <h3><a href="${paperURL(pid)}">${Data.escapeHTML(paper.title)}</a></h3>
        <p class="paper-meta">${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(meta)}</p>
        <p><code class="id-chip">${Data.escapeHTML(pid)}</code></p>
        <p>${Data.escapeHTML(paper.summary)}</p>
        <div class="tag-row">${Data.renderTags(paper.tags)}</div>
        <div class="material-row">${materialLinksForPaper(paper, reports)}</div>
      </article>
    `;
  }

  function renderReportCard(report, paper = {}) {
    const rid = reportRid(report);
    const pid = reportPid(report);
    return `
      <article class="paper-card">
        <div class="paper-card-top">
          ${Data.renderStatus(report.status)}
          <span>${Data.escapeHTML(report.report_type || "文献解读")}</span>
        </div>
        <h3><a href="${reportURL(rid)}">${Data.escapeHTML(paper.title || pid)}</a></h3>
        <p class="paper-meta">${Data.formatFullDate(reportDate(report))} · ${Data.escapeHTML(report.presenter || "待定")} · ${Data.escapeHTML(report.duration || "待定")}</p>
        <p class="id-row"><code class="id-chip">${Data.escapeHTML(rid)}</code><code class="id-chip soft">${Data.escapeHTML(pid)}</code></p>
        <p>${Data.escapeHTML(report.summary || paper.summary || "")}</p>
        <div class="tag-row">${Data.renderTags(paper.tags)}</div>
        <div class="material-row">${materialLinksForReport(report, paper)}</div>
      </article>
    `;
  }

  function renderMeetingMeta(meeting, reports = []) {
    const presenters = reports.length ? reportPresenterList(reports) : personList(meeting.presenter);
    const reportLabel = reports.length ? `${reports.length} 个 RID` : "待定";
    return `
      <dl class="meta-grid">
        <div><dt>时间</dt><dd>${Data.formatFullDate(meeting.date)} ${Data.escapeHTML(meeting.time)}</dd></div>
        <div><dt>地点</dt><dd>${Data.escapeHTML(meeting.location)} · ${Data.escapeHTML(meeting.mode)}</dd></div>
        <div><dt>主持人</dt><dd>${Data.escapeHTML(personList(meeting.host))}</dd></div>
        <div><dt>汇报</dt><dd>${Data.escapeHTML(presenters)} · ${Data.escapeHTML(reportLabel)}</dd></div>
      </dl>
    `;
  }

  async function initHome() {
    const [meetings, papers, reports] = await Promise.all([Data.loadCSV("meetings"), Data.loadCSV("papers"), Data.loadCSV("reports")]);
    const byPid = new Map(papers.map((paper) => [paperPid(paper), paper]));
    const current = Data.findCurrentMeeting(meetings);
    const currentReports = reportsForMeeting(current, reports);
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
      ${renderMeetingMeta(current, currentReports)}
      ${current.next_topic ? `<p class="meeting-note">${Data.escapeHTML(current.next_topic)}</p>` : ""}
      <div class="material-row">
        ${Data.renderMaterialLink("会议入口", current.materials)}
        ${renderMeetingRecordLink(current)}
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
      <div class="paper-list">${currentReports.map((report) => renderReportCard(report, byPid.get(reportPid(report)))).join("") || emptyState("暂无文献", "在 reports.csv 中关联本周 RID。")}</div>
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
        ${(archivedMeetings.length ? Data.sortByDateDesc(archivedMeetings, "date") : Data.sortByDateDesc(meetings, "date")).slice(0, 4).map((meeting) => {
          const meetingReports = reportsForMeeting(meeting, reports);
          return `
            <a href="${meeting.record ? meetingURL(meeting.id) : "archive.html"}">
              <strong>${Data.escapeHTML(meeting.topic)}</strong>
              <span>${Data.formatDate(meeting.date)} · ${Data.escapeHTML(reportPresenterList(meetingReports))}</span>
            </a>
          `;
        }).join("") || emptyState("暂无归档", "历史组会记录尚未录入。")}
      </div>
    `);

    setHTML("#latestPapersCard", `
      <div class="card-head">
        <p class="eyebrow">Library</p>
        <h2>最新入库论文</h2>
      </div>
      <div class="compact-list">
        ${[...papers].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 4).map((paper) => `
          <a href="${paperURL(paperPid(paper))}">
            <strong>${Data.escapeHTML(paper.title)}</strong>
            <span>${Data.escapeHTML(paper.direction)} · ${Data.escapeHTML(paper.year)} · ${reportCountText(reportsForPaper(paper, reports))}</span>
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

    const questions = reports.flatMap((report) => {
      const paper = byPid.get(reportPid(report)) || {};
      return Data.list(report.discussion).map((question) => ({ question, report, paper }));
    }).slice(0, 6);
    setHTML("#discussionQuestions", questions.map(({ question, report, paper }) => `
      <a href="${reportURL(reportRid(report))}">
        <strong>${Data.escapeHTML(question)}</strong>
        <span>${Data.escapeHTML(paper.direction || "文献解读")} · ${Data.escapeHTML(report.presenter || "待定")}</span>
      </a>
    `).join("") || emptyState("暂无问题", "在 reports.csv 的 discussion 字段中补充。"));

    drawNetworkCanvas();
  }

  function fillSelect(select, values, label) {
    select.innerHTML = `<option value="">${label}</option>${values.map((value) => `<option value="${Data.escapeHTML(value)}">${Data.escapeHTML(value)}</option>`).join("")}`;
  }

  async function initPapers() {
    const [papers, reports] = await Promise.all([Data.loadCSV("papers"), Data.loadCSV("reports")]);
    const search = qs("#paperSearch");
    const direction = qs("#directionFilter");
    const year = qs("#yearFilter");
    const presenter = qs("#presenterFilter");
    const status = qs("#statusFilter");
    const grid = qs("#paperGrid");

    fillSelect(direction, Data.unique(papers.map((paper) => paper.direction)), "全部方向");
    fillSelect(year, Data.unique(papers.map((paper) => paper.year)).reverse(), "全部年份");
    fillSelect(presenter, Data.unique(reports.map((report) => report.presenter)), "全部汇报人");
    fillSelect(status, Data.unique([...papers.map((paper) => paper.status), ...reports.map((report) => report.status)]), "全部状态");

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const filtered = papers.filter((paper) => {
        const related = reportsForPaper(paper, reports);
        const reportText = related.map((report) => [reportRid(report), report.presenter, report.student_uid, report.report_type, report.status, report.summary, report.discussion].join(" ")).join(" ");
        const haystack = [paperPid(paper), paper.title, paper.authors, paper.venue, paper.doi, paper.direction, paper.tags, paper.summary, reportText].join(" ").toLowerCase();
        return (!query || haystack.includes(query))
          && (!direction.value || paper.direction === direction.value)
          && (!year.value || paper.year === year.value)
          && (!presenter.value || related.some((report) => report.presenter === presenter.value))
          && (!status.value || paper.status === status.value || related.some((report) => report.status === status.value));
      });

      setHTML("#paperResultCount", `${filtered.length} 篇入库论文`);
      setHTML("#paperResultMeta", direction.value || "全部方向");
      grid.innerHTML = filtered.map((paper) => renderPaperCard(paper, reportsForPaper(paper, reports))).join("") || emptyState("没有匹配文献", "调整筛选条件后查看。");
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
    const params = new URLSearchParams(window.location.search);
    const pid = params.get("pid") || params.get("id");
    const [papers, reports, meetings] = await Promise.all([Data.loadCSV("papers"), Data.loadCSV("reports"), Data.loadCSV("meetings")]);
    const paper = papers.find((item) => paperPid(item) === pid) || papers[0];
    const byMeeting = new Map(meetings.map((meeting) => [meeting.id, meeting]));

    if (!paper) {
      setHTML("#paperHero", emptyState("未找到文献", "请先在 papers.csv 中新增文献。"));
      setHTML("#paperArticle", "");
      setHTML("#paperToc", "");
      return;
    }

    const related = reportsForPaper(paper, reports);
    const currentPid = paperPid(paper);
    const doiLink = paper.doi ? `https://doi.org/${paper.doi}` : "";
    document.title = `${paper.title} | LACONET`;
    setHTML("#paperHero", `
      <p class="eyebrow">${Data.escapeHTML(paper.direction)}</p>
      <h1>${Data.escapeHTML(paper.title)}</h1>
      <p class="summary">${Data.escapeHTML(paper.summary)}</p>
      <div class="paper-hero-meta">
        <span>${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(paper.year)}</span>
        <span>PID：${Data.escapeHTML(currentPid)}</span>
        <span>${reportCountText(related)}</span>
        ${Data.renderStatus(paper.status)}
      </div>
      <div class="tag-row">${Data.renderTags(paper.tags)}</div>
      <div class="material-row">
        ${Data.renderMaterialLink("PDF", paper.pdf)}
        ${doiLink ? `<a class="material" href="${Data.escapeHTML(doiLink)}">DOI</a>` : ""}
        ${Data.renderMaterialLink("代码", paper.code)}
      </div>
    `);

    setHTML("#paperArticle", `
      <h2>文献信息</h2>
      <table>
        <tbody>
          <tr><th>PID</th><td><code>${Data.escapeHTML(currentPid)}</code></td></tr>
          <tr><th>DOI</th><td>${paper.doi ? Data.escapeHTML(paper.doi) : "无 DOI，使用 LIT-年份-流水号"}</td></tr>
          <tr><th>作者</th><td>${Data.escapeHTML(paper.authors)}</td></tr>
          <tr><th>来源</th><td>${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(paper.year)}</td></tr>
          <tr><th>方向</th><td>${Data.escapeHTML(paper.direction)}</td></tr>
          <tr><th>标签</th><td>${Data.escapeHTML(Data.list(paper.tags).join("、"))}</td></tr>
        </tbody>
      </table>

      <h2>汇报记录</h2>
      ${related.length ? `<div class="archive-papers">${related.map((report) => {
        const meeting = byMeeting.get(report.meeting_id);
        return `<a href="${reportURL(reportRid(report))}">
          ${Data.escapeHTML(reportRid(report))}
          <span>${Data.formatFullDate(reportDate(report))} · ${Data.escapeHTML(report.presenter || "待定")} · ${Data.escapeHTML(report.report_type || "文献解读")}${meeting ? ` · ${Data.escapeHTML(meeting.topic)}` : ""}</span>
        </a>`;
      }).join("")}</div>` : emptyState("暂无汇报记录", "已入库文献可以复用 PID，并在 reports.csv 中新增 RID。")}

      <h2>提交规则</h2>
      <ul>
        <li>PID 标识论文本身：有 DOI 时优先采用规范化 DOI。</li>
        <li>同一篇论文只保留一个 PID，PDF 按 PID 只保存一份。</li>
        <li>RID 标识某次汇报，PPT、Markdown 和讨论问题按 RID 分别归档。</li>
        <li>已入库文献无需重复提交 PDF，只需复用 PID 并新增 RID。</li>
      </ul>

      <h2>讨论问题</h2>
      ${related.some((report) => Data.list(report.discussion).length)
        ? `<ul>${related.flatMap((report) => Data.list(report.discussion).map((question) => `<li><a href="${reportURL(reportRid(report))}">${Data.escapeHTML(question)}</a></li>`)).join("")}</ul>`
        : emptyState("暂无讨论问题", "在 reports.csv 的 discussion 字段中补充。")}
    `);
    buildTOC("#paperToc");
  }

  async function initReportDetail() {
    const params = new URLSearchParams(window.location.search);
    const rid = params.get("rid") || params.get("id");
    const [reports, papers, meetings] = await Promise.all([Data.loadCSV("reports"), Data.loadCSV("papers"), Data.loadCSV("meetings")]);
    const report = reports.find((item) => reportRid(item) === rid) || reports[0];
    const byPid = new Map(papers.map((paper) => [paperPid(paper), paper]));
    const byMeeting = new Map(meetings.map((meeting) => [meeting.id, meeting]));

    if (!report) {
      setHTML("#reportHero", emptyState("未找到汇报", "请先在 reports.csv 中新增 RID。"));
      setHTML("#reportArticle", "");
      setHTML("#reportToc", "");
      return;
    }

    const paper = byPid.get(reportPid(report)) || {};
    const meeting = byMeeting.get(report.meeting_id);
    document.title = `${paper.title || reportRid(report)} | LACONET`;
    setHTML("#reportHero", `
      <p class="eyebrow">${Data.escapeHTML(report.report_type || "Report")}</p>
      <h1>${Data.escapeHTML(paper.title || reportRid(report))}</h1>
      <p class="summary">${Data.escapeHTML(report.summary || paper.summary || "")}</p>
      <div class="paper-hero-meta">
        <span>RID：${Data.escapeHTML(reportRid(report))}</span>
        <span>PID：${Data.escapeHTML(reportPid(report))}</span>
        <span>${Data.formatFullDate(reportDate(report))}</span>
        <span>汇报人：${Data.escapeHTML(report.presenter || "待定")}</span>
        ${Data.renderStatus(report.status)}
      </div>
      <div class="tag-row">${Data.renderTags(paper.tags)}</div>
      <div class="material-row">
        ${materialLinksForReport(report, paper, false)}
        ${paperPid(paper) ? `<a class="material" href="${paperURL(paperPid(paper))}">论文条目</a>` : ""}
        ${meeting ? `<a class="material" href="${meetingURL(meeting.id)}">${meetingRecordLabel(meeting)}</a>` : ""}
      </div>
    `);

    if (!report.notes) {
      setHTML("#reportArticle", emptyState("暂无 Markdown 解读", "在 reports.csv 的 notes 字段中填写 notes/RID.md 路径。"));
      setHTML("#reportToc", "");
      return;
    }

    try {
      const markdown = await Data.fetchText(report.notes);
      const parsed = Data.parseFrontMatter(markdown);
      setHTML("#reportArticle", Data.markdownToHTML(parsed.body));
      buildTOC("#reportToc");
    } catch (error) {
      setHTML("#reportArticle", emptyState("无法读取解读文件", error.message));
      setHTML("#reportToc", "");
    }
  }

  function buildTOC(targetSelector) {
    const headings = qsa(".article-body h2, .article-body h3");
    setHTML(targetSelector, headings.map((heading) => `<a href="#${heading.id}" class="toc-${heading.tagName.toLowerCase()}">${heading.textContent}</a>`).join(""));
  }

  async function initArchive() {
    const [meetings, papers, reports] = await Promise.all([Data.loadCSV("meetings"), Data.loadCSV("papers"), Data.loadCSV("reports")]);
    const byPid = new Map(papers.map((paper) => [paperPid(paper), paper]));
    const archived = Data.sortByDateDesc(meetings.filter((meeting) => meeting.status.includes("归档")), "date");

    setHTML("#archiveTimeline", archived.map((meeting) => {
      const related = reportsForMeeting(meeting, reports).map((report) => ({ report, paper: byPid.get(reportPid(report)) || {} }));
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
            ${renderMeetingMeta(meeting, related.map((item) => item.report))}
            <div class="archive-papers">
              ${related.map(({ report, paper }) => `<a href="${reportURL(reportRid(report))}">${Data.escapeHTML(paper.title || reportPid(report))}<span>${Data.escapeHTML(report.report_type || "文献解读")} · ${Data.escapeHTML(report.presenter || "待定")} · ${Data.escapeHTML(reportRid(report))}</span></a>`).join("") || "<span class='muted'>未关联 RID</span>"}
            </div>
            <div class="material-row">
              ${Data.renderMaterialLink(meeting.status === "待举行" ? "会议入口" : "资料", meeting.materials)}
              ${renderMeetingRecordLink(meeting)}
            </div>
          </div>
        </article>
      `;
    }).join("") || emptyState("暂无历史归档", "完成组会后，将 status 标记为“已归档”即可在这里显示。"));
  }

  async function initMeetingDetail() {
    const id = new URLSearchParams(window.location.search).get("id");
    const [meetings, papers, reports] = await Promise.all([Data.loadCSV("meetings"), Data.loadCSV("papers"), Data.loadCSV("reports")]);
    const archived = Data.sortByDateDesc(meetings.filter((meeting) => meeting.status.includes("归档")), "date");
    const meeting = meetings.find((item) => item.id === id) || archived[0] || meetings[0];
    const byPid = new Map(papers.map((paper) => [paperPid(paper), paper]));

    if (!meeting) {
      setHTML("#meetingHero", emptyState("未找到组会", "请先在 meetings.csv 中新增组会记录。"));
      setHTML("#meetingArticle", "");
      return;
    }

    const related = reportsForMeeting(meeting, reports).map((report) => ({ report, paper: byPid.get(reportPid(report)) || {} }));
    const meetingReports = related.map((item) => item.report);
    document.title = `${meeting.topic} | LACONET`;
    setHTML("#meetingHero", `
      <p class="eyebrow">${meeting.status === "待举行" ? "Meeting Preview" : "Meeting Minutes"}</p>
      <h1>${Data.escapeHTML(meeting.topic)}</h1>
      <p class="summary">${Data.formatFullDate(meeting.date)} ${Data.escapeHTML(meeting.time)} · ${Data.escapeHTML(meeting.location)}</p>
      <div class="paper-hero-meta">
        <span>${Data.escapeHTML(meeting.mode || "待确认")}</span>
        <span>主持人：${Data.escapeHTML(personList(meeting.host))}</span>
        <span>汇报：${Data.escapeHTML(reportPresenterList(meetingReports))} · ${Data.escapeHTML(meetingReports.length ? `${meetingReports.length} 个 RID` : "待定")}</span>
        ${Data.renderStatus(meeting.status)}
      </div>
      <div class="material-row">
        ${Data.renderMaterialLink(meeting.status === "待举行" ? "会议入口" : "资料", meeting.materials)}
        <a class="material" href="archive.html">返回归档</a>
      </div>
      ${related.length ? `<div class="archive-papers hero-related">${related.map(({ report, paper }) => `<a href="${reportURL(reportRid(report))}">${Data.escapeHTML(paper.title || reportPid(report))}<span>${Data.escapeHTML(report.report_type || "文献解读")} · ${Data.escapeHTML(report.presenter || "待定")} · ${Data.escapeHTML(reportRid(report))}</span></a>`).join("")}</div>` : ""}
    `);

    if (!meeting.record) {
      setHTML("#meetingArticle", emptyState("暂无会议纪要", "会议结束后，在 meetings.csv 的 record 字段中填写 records/*.md 路径。"));
      setHTML("#meetingToc", "");
      return;
    }

    try {
      const markdown = await Data.fetchText(meeting.record);
      const parsed = Data.parseFrontMatter(markdown);
      setHTML("#meetingArticle", Data.markdownToHTML(parsed.body));
      buildTOC("#meetingToc");
    } catch (error) {
      setHTML("#meetingArticle", emptyState("无法读取会议纪要", error.message));
      setHTML("#meetingToc", "");
    }
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
          <div><dt>数量</dt><dd>${Data.escapeHTML(equipment.quantity || "待确认")}</dd></div>
          <div><dt>位置</dt><dd>${Data.escapeHTML(equipment.location)}</dd></div>
          <div><dt>负责人</dt><dd>${Data.escapeHTML(equipment.manager || "待定")}</dd></div>
          <div><dt>预约要求</dt><dd>${equipment.booking_required === "是" ? "需预约" : equipment.booking_required === "否" ? "登记即可" : "待确认"}</dd></div>
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

    setHTML("#metricEquipmentTotal", `${equipment.length} 类`);
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
        title: "论文精读汇报指南",
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
        const parsed = Data.parseFrontMatter(template.markdown);
        setHTML("#templatePreviewTitle", `${Data.escapeHTML(template.title)}预览`);
        setHTML("#templatePreview", Data.markdownToHTML(parsed.body));
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
    const [papers, reports] = await Promise.all([Data.loadCSV("papers"), Data.loadCSV("reports")]);
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
              <a href="${paperURL(paperPid(paper))}">
                <strong>${Data.escapeHTML(paper.title)}</strong>
                <span>${Data.escapeHTML(paper.venue)} · ${Data.escapeHTML(paper.year)} · ${reportCountText(reportsForPaper(paper, reports))}</span>
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
      if (page === "report-detail") await initReportDetail();
      if (page === "meeting-detail") await initMeetingDetail();
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
