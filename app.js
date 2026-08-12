/* The page is generated from data/content.js. */

const d = window.SITE_CONTENT;

const el = (tag, cls, text) => {
  const node = document.createElement(tag);

  if (cls) {
    node.className = cls;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  return node;
};

const link = (text, href, external = false) => {
  const anchor = el("a", null, text);
  anchor.href = href;

  if (external) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }

  return anchor;
};

const root = document.getElementById("app");
root.id = "top";

/* Google Analytics helpers */

function trackEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, parameters);
}

function trackedLink(
  text,
  href,
  external = false,
  eventName = "link_click",
  eventParameters = {}
) {
  const anchor = link(text, href, external);

  anchor.addEventListener("click", () => {
    trackEvent(eventName, {
      link_text: text,
      link_url: href,
      ...eventParameters
    });
  });

  return anchor;
}

/* Header and navigation */

const header = el("header");

header.append(
  trackedLink(
    d.profile.name,
    "#top",
    false,
    "navigation_click",
    { destination: "top" }
  )
);

header.firstChild.className = "name";

const nav = el("nav");

[
  ["Working papers", "#working", "working_papers"],
  [
    "Published and forthcoming articles",
    "#published",
    "published_articles"
  ],
  ["Research in progress", "#wip", "research_in_progress"],
  ["Research funding", "#funding", "research_funding"],
  ["Awards", "#awards", "awards"],
  ["Teaching", "#teaching", "teaching"],
  ["CV", d.profile.cv, "cv"],
  ["Contact details", "#contact", "contact"]
].forEach(([text, href, destination]) => {
  nav.append(
    trackedLink(
      text,
      href,
      href.startsWith("http"),
      text === "CV" ? "cv_click" : "navigation_click",
      { destination }
    )
  );
});

header.append(nav);
root.append(header);

/* Introduction */

const intro = el("section", "intro");
const introText = el("div");

introText.append(el("h1", null, d.profile.name));

const affiliations = el("p", "affiliation");

d.profile.affiliations.forEach((item, index) => {
  if (index > 0) {
    affiliations.append(document.createElement("br"));
  }

  affiliations.append(document.createTextNode(item));
});

introText.append(affiliations);

const researchSummary = el("div", "research-summary");

if (d.researchIntro) {
  researchSummary.append(
    el("p", "research-intro", d.researchIntro)
  );
}

d.researchAreas.forEach((area) => {
  const box = el("div");

  box.append(
    el("h2", null, area.title),
    el("p", null, area.description)
  );

  researchSummary.append(box);
});

introText.append(researchSummary);

const introLinks = el("div", "intro-links");

introLinks.append(
  trackedLink(
    "CV ↗",
    d.profile.cv,
    true,
    "cv_click",
    { placement: "introduction" }
  ),
  trackedLink(
    "Google Scholar ↗",
    d.profile.scholar,
    true,
    "scholar_click",
    { placement: "introduction" }
  ),
  trackedLink(
    "Email ↗",
    `mailto:${d.profile.email}`,
    false,
    "email_click",
    { placement: "introduction" }
  )
);

introText.append(introLinks);

const portrait = el("div", "portrait");
const photo = el("img");

photo.src = d.profile.photo;
photo.alt = d.profile.name;

portrait.append(photo);
intro.append(introText, portrait);
root.append(intro);

/* BibTeX */

function bibEscape(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/([{}#%&_])/g, "\\$1");
}

function bibAuthors(byline) {
  return String(byline || "")
    .replace(/\s+et al\.?$/i, " and others")
    .replace(/\s*&\s*/g, " and ")
    .replace(/,\s+(?=[A-ZÀ-ÖØ-Þ])/g, " and ");
}

function bibKey(paper) {
  const surname = paper.byline.match(/Rubolino/i)
    ? "Rubolino"
    : paper.byline
        .split(/[,&]/)[0]
        .trim()
        .split(/\s+/)
        .pop() || "Paper";

  const years =
    paper.status.match(/\b(?:19|20)\d{2}\b/g) || [];

  const year = paper.year || years.pop() || "";

  const titleWords =
    paper.title.match(/[A-Za-zÀ-ÖØ-öø-ÿ]{4,}/) || ["Paper"];

  const firstWord = titleWords[0];

  return `${surname}${year}${firstWord}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]/g, "");
}

function bibText(paper) {
  const published =
    /journal|accepted|economic journal|economic policy/i.test(
      paper.status
    );

  const type = published ? "article" : "unpublished";

  const fields = [
    `  title = {${bibEscape(paper.title)}}`,
    `  author = {${bibEscape(bibAuthors(paper.byline))}}`
  ];

  const years =
    paper.status.match(/\b(?:19|20)\d{2}\b/g) || [];

  const year = paper.year || years.pop();

  if (year) {
    fields.push(`  year = {${year}}`);
  }

  if (published) {
    fields.push(
      `  journal = {${bibEscape(paper.status)}}`
    );
  } else {
    fields.push(
      `  note = {${bibEscape(paper.status)}}`
    );
  }

  if (paper.paper) {
    fields.push(`  url = {${bibEscape(paper.paper)}}`);
  }

  return `@${type}{${bibKey(paper)},
${fields.join(",\n")}
}
`;
}

function bibLink(paper, sectionName) {
  const anchor = el("a", null, "BibTeX ↓");

  const file = new Blob([bibText(paper)], {
    type: "application/x-bibtex;charset=utf-8"
  });

  anchor.href = URL.createObjectURL(file);
  anchor.download = `${bibKey(paper)}.bib`;
  anchor.title = "Download BibTeX citation";

  anchor.addEventListener("click", () => {
    trackEvent("bibtex_download", {
      paper_title: paper.title,
      paper_status: paper.status,
      paper_section: sectionName,
      file_name: anchor.download
    });
  });

  return anchor;
}

/* Papers without figure previews */

function classifyPaperLink(text) {
  const normalizedText = text.toLowerCase();

  if (normalizedText.includes("replication")) {
    return "replication_click";
  }

  if (normalizedText.includes("appendix")) {
    return "appendix_click";
  }

  if (
    normalizedText.includes("award") ||
    normalizedText.includes("prize")
  ) {
    return "award_link_click";
  }

  return "paper_resource_click";
}

function paperItem(paper, sectionName) {
  const details = el("details", "paper");
  const summary = el("summary");
  const head = el("div");

  head.append(
    el("h3", null, paper.title),
    el("p", null, paper.byline),
    el("p", "status", paper.status)
  );

  const toggle = el("span");

  toggle.append(
    el("b", null, "View"),
    el("i", null, "Close")
  );

  summary.append(head, toggle);

  details.addEventListener("toggle", () => {
    if (details.open) {
      trackEvent("paper_details_open", {
        paper_title: paper.title,
        paper_status: paper.status,
        paper_section: sectionName
      });
    }
  });

  const body = el("div", "paper-details");
  const copy = el("div");

  copy.append(el("p", null, paper.description));

  const actions = el("div", "actions");

  if (paper.paper) {
    actions.append(
      trackedLink(
        "Paper ↗",
        paper.paper,
        true,
        "paper_click",
        {
          paper_title: paper.title,
          paper_status: paper.status,
          paper_section: sectionName
        }
      )
    );
  }

  actions.append(bibLink(paper, sectionName));

  (paper.links || []).forEach(([text, url]) => {
    if (text && url) {
      actions.append(
        trackedLink(
          `${text} ↗`,
          url,
          true,
          classifyPaperLink(text),
          {
            resource_name: text,
            paper_title: paper.title,
            paper_status: paper.status,
            paper_section: sectionName
          }
        )
      );
    }
  });

  copy.append(actions);
  body.append(copy);
  details.append(summary, body);

  return details;
}

function papers(id, title, items, note) {
  const section = el("section", "content");
  section.id = id;

  const heading = el("div", "section-heading");
  heading.append(el("h2", null, title));

  if (note) {
    heading.append(el("p", null, note));
  }

  const list = el("div", "paper-list");

  items.forEach((paper) => {
    list.append(paperItem(paper, id));
  });

  section.append(heading, list);
  root.append(section);
}

papers(
  "working",
  "Working papers",
  d.workingPapers,
);

papers(
  "published",
  "Published and forthcoming articles",
  d.publishedPapers
);

/* Research in progress */

const workInProgress = el("section", "content");
workInProgress.id = "wip";

const workInProgressHeading = el(
  "div",
  "section-heading"
);

workInProgressHeading.append(
  el("h2", null, "Research in progress")
);

const workInProgressList = el("ul", "wip");

d.researchInProgress.forEach((item) => {
  const listItem = el("li");

  listItem.append(
    el("strong", null, item.title)
  );

  if (item.coauthors) {
    listItem.append(
      el("span", "coauthors", item.coauthors)
    );
  }

  workInProgressList.append(listItem);
});

workInProgress.append(
  workInProgressHeading,
  workInProgressList
);

root.append(workInProgress);

/* Research funding and awards */

function cvSection(id, title, items) {
  const section = el("section", "content");
  section.id = id;

  const heading = el("div", "section-heading");
  heading.append(el("h2", null, title));

  const list = el("ul", "cv-list");

  items.forEach((item) => {
    const listItem = el("li");
    const main = el("div", "cv-entry");

    main.append(
      el("strong", null, item.title),
      el("span", "cv-year", item.year)
    );

    listItem.append(main);

    if (item.description) {
      listItem.append(
        el("p", null, item.description)
      );
    }

    list.append(listItem);
  });

  section.append(heading, list);
  root.append(section);
}

cvSection(
  "funding",
  "Research funding",
  d.researchFunding || []
);

cvSection(
  "awards",
  "Awards",
  d.awards || []
);

/* Teaching */

const teaching = el("section", "content");
teaching.id = "teaching";

const teachingHeading = el("div", "section-heading");

teachingHeading.append(
  el("h2", null, "Teaching")
);

const courses = el("div", "courses");

d.teaching.forEach((course) => {
  const box = el("div", "course");
  box.append(el("h3", null, course.name));

  const lessons = el("ol");

  course.lessons.forEach((lesson, index) => {
    const listItem = el("li");

    listItem.append(
      el(
        "span",
        null,
        String(index + 1).padStart(2, "0")
      ),
      trackedLink(
        `${lesson.title} ↗`,
        lesson.url,
        true,
        "teaching_material_click",
        {
          course_name: course.name,
          lesson_title: lesson.title
        }
      )
    );

    lessons.append(listItem);
  });

  box.append(lessons);
  courses.append(box);
});

teaching.append(teachingHeading, courses);
root.append(teaching);

/* Footer */

const footer = el("footer");
footer.id = "contact";

footer.append(
  el("p", null, d.profile.name),
  trackedLink(
    d.profile.email,
    `mailto:${d.profile.email}`,
    false,
    "email_click",
    { placement: "footer" }
  ),
  el("span", null, d.profile.location),
  trackedLink(
    "↑ Top",
    "#top",
    false,
    "navigation_click",
    { destination: "top", placement: "footer" }
  )
);

root.append(footer);
