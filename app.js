/* The page is generated from data/content.js. */

const d = window.SITE_CONTENT;

const el = (tag, cls, text) => {
  const n = document.createElement(tag);

  if (cls) {
    n.className = cls;
  }

  if (text !== undefined) {
    n.textContent = text;
  }

  return n;
};

const link = (text, href, external = false) => {
  const a = el("a", null, text);
  a.href = href;

  if (external) {
    a.target = "_blank";
    a.rel = "noreferrer";
  }

  return a;
};

const root = document.getElementById("app");
root.id = "top";

/* Header and navigation */

const header = el("header");
header.append(link(d.profile.name, "#top"));
header.firstChild.className = "name";

const nav = el("nav");

[
  ["Working papers", "#working"],
  ["Published and forthcoming articles", "#published"],
  ["Research in progress", "#wip"],
  ["Research funding", "#funding"],
  ["Awards", "#awards"],
  ["Teaching", "#teaching"],
  ["CV", d.profile.cv],
  ["Contact details", "#contact"]
].forEach(([text, href]) => {
  nav.append(link(text, href, href.startsWith("http")));
});

header.append(nav);
root.append(header);

/* Introduction */

const intro = el("section", "intro");
const introText = el("div");

introText.append(el("h1", null, d.profile.name));

const affiliations = el("p", "affiliation");

d.profile.affiliations.forEach((item, index) => {
  if (index) {
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
  link("CV ↗", d.profile.cv, true),
  link("Google Scholar ↗", d.profile.scholar, true),
  link("Email ↗", `mailto:${d.profile.email}`)
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

  const years = paper.status.match(/\b(?:19|20)\d{2}\b/g) || [];
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

  const years = paper.status.match(/\b(?:19|20)\d{2}\b/g) || [];
  const year = paper.year || years.pop();

  if (year) {
    fields.push(`  year = {${year}}`);
  }

  if (published) {
    fields.push(`  journal = {${bibEscape(paper.status)}}`);
  } else {
    fields.push(`  note = {${bibEscape(paper.status)}}`);
  }

  if (paper.paper) {
    fields.push(`  url = {${bibEscape(paper.paper)}}`);
  }

  return `@${type}{${bibKey(paper)},
${fields.join(",\n")}
}
`;
}

function bibLink(paper) {
  const a = el("a", null, "BibTeX ↓");

  const file = new Blob([bibText(paper)], {
    type: "application/x-bibtex;charset=utf-8"
  });

  a.href = URL.createObjectURL(file);
  a.download = `${bibKey(paper)}.bib`;
  a.title = "Download BibTeX citation";

  return a;
}

/* Papers — no figure preview */

function paperItem(paper) {
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

  const body = el("div", "paper-details");
  const copy = el("div");

  copy.append(el("p", null, paper.description));

  const actions = el("div", "actions");

  if (paper.paper) {
    actions.append(link("Paper ↗", paper.paper, true));
  }

  actions.append(bibLink(paper));

  (paper.links || []).forEach(([text, url]) => {
    if (text && url) {
      actions.append(link(`${text} ↗`, url, true));
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
    list.append(paperItem(paper));
  });

  section.append(heading, list);
  root.append(section);
}

papers(
  "working",
  "Working papers",
  d.workingPapers,
  "Click a paper for details."
);

papers(
  "published",
  "Published and forthcoming articles",
  d.publishedPapers
);

/* Research in progress */

const workInProgress = el("section", "content");
workInProgress.id = "wip";

const workInProgressHeading = el("div", "section-heading");

workInProgressHeading.append(
  el("h2", null, "Research in progress")
);

const workInProgressList = el("ul", "wip");

d.researchInProgress.forEach((item) => {
  const li = el("li");

  li.append(el("strong", null, item.title));

  if (item.coauthors) {
    li.append(
      el("span", "coauthors", item.coauthors)
    );
  }

  workInProgressList.append(li);
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
    const li = el("li");
    const main = el("div", "cv-entry");

    main.append(
      el("strong", null, item.title),
      el("span", "cv-year", item.year)
    );

    li.append(main);

    if (item.description) {
      li.append(el("p", null, item.description));
    }

    list.append(li);
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
teachingHeading.append(el("h2", null, "Teaching"));

const courses = el("div", "courses");

d.teaching.forEach((course) => {
  const box = el("div", "course");

  box.append(el("h3", null, course.name));

  const lessons = el("ol");

  course.lessons.forEach((lesson, index) => {
    const li = el("li");

    li.append(
      el("span", null, String(index + 1).padStart(2, "0")),
      link(`${lesson.title} ↗`, lesson.url, true)
    );

    lessons.append(li);
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
  link(d.profile.email, `mailto:${d.profile.email}`),
  el("span", null, d.profile.location),
  link("↑ Top", "#top")
);

root.append(footer);
