/* The page is generated from data/content.js. */
const d = window.SITE_CONTENT;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const link=(text,href,external=false)=>{const a=el("a",null,text);a.href=href;if(external){a.target="_blank";a.rel="noreferrer"}return a};
const root=document.getElementById("app"); root.id="top";
const header=el("header");header.append(link(d.profile.name,"#top"));header.firstChild.className="name";const nav=el("nav");[["Working papers","#working"],["Published and forthcoming articles","#published"],["Research in progress","#wip"],["Research funding","#funding"],["Awards","#awards"],["Teaching","#teaching"],["CV",d.profile.cv],["Contact details","#contact"]].forEach(([t,h])=>nav.append(link(t,h,h.startsWith("http"))));header.append(nav);root.append(header);
const intro=el("section","intro"),introText=el("div");introText.append(el("h1",null,d.profile.name));const aff=el("p","affiliation");d.profile.affiliations.forEach((x,i)=>{if(i)aff.append(document.createElement("br"));aff.append(document.createTextNode(x))});introText.append(aff);const rs=el("div","research-summary");  if(d.researchIntro){   rs.append(el("p","research-intro",d.researchIntro)); }d.researchAreas.forEach(x=>{const box=el("div");box.append(el("h2",null,x.title),el("p",null,x.description));rs.append(box)});introText.append(rs);const il=el("div","intro-links");il.append(link("CV ↗",d.profile.cv,true),link("Google Scholar ↗",d.profile.scholar,true),link("Email ↗","mailto:"+d.profile.email));introText.append(il);const portrait=el("div","portrait"),photo=el("img");photo.src=d.profile.photo;photo.alt=d.profile.name;portrait.append(photo);intro.append(introText,portrait);root.append(intro);
function bibEscape(value){return String(value||"").replace(/\\/g,"\\\\").replace(/([{}#%&_])/g,"\\$1")}
function bibAuthors(byline){return String(byline||"").replace(/\s+et al\.?$/i," and others").replace(/\s*&\s*/g," and ").replace(/,\s+(?=[A-ZÀ-ÖØ-Þ])/g," and ")}
function bibKey(p){const surname=(p.byline.match(/Rubolino/i)?"Rubolino":p.byline.split(/[,&]/)[0].trim().split(/\s+/).pop()||"Paper");const year=(p.year||((p.status.match(/\b(?:19|20)\d{2}\b/g)||[]).pop())||"");const word=(p.title.match(/[A-Za-zÀ-ÖØ-öø-ÿ]{4,}/)||["Paper"])[0];return (surname+year+word).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^A-Za-z0-9]/g,"")}
function bibText(p){const published=/journal|accepted|economic journal|economic policy/i.test(p.status);const type=published?"article":"unpublished";const fields=[`  title = {${bibEscape(p.title)}}`,`  author = {${bibEscape(bibAuthors(p.byline))}}`];const year=p.year||((p.status.match(/\b(?:19|20)\d{2}\b/g)||[]).pop());if(year)fields.push(`  year = {${year}}`);if(published)fields.push(`  journal = {${bibEscape(p.status)}}`);else fields.push(`  note = {${bibEscape(p.status)}}`);if(p.paper)fields.push(`  url = {${bibEscape(p.paper)}}`);return `@${type}{${bibKey(p)},\n${fields.join(",\n")}\n}\n`}
function bibLink(p){const a=el("a",null,"BibTeX ↓");a.href=URL.createObjectURL(new Blob([bibText(p)],{type:"application/x-bibtex;charset=utf-8"}));a.download=bibKey(p)+".bib";a.title="Download BibTeX citation";return a}
function paperItem(p) {
  const details = el("details", "paper");
  const summary = el("summary");
  const head = el("div");

  head.append(
    el("h3", null, p.title),
    el("p", null, p.byline),
    el("p", "status", p.status)
  );

  const toggle = el("span");
  toggle.append(
    el("b", null, "View"),
    el("i", null, "Close")
  );

  summary.append(head, toggle);

  const body = el("div", "paper-details");
  const copy = el("div");

  copy.append(el("p", null, p.description));

  const actions = el("div", "actions");
  actions.append(
    link("Paper ↗", p.paper, true),
    bibLink(p)
  );

  (p.links || []).forEach(([text, url]) => {
    actions.append(link(text + " ↗", url, true));
  });

  copy.append(actions);
  body.append(copy);

  details.append(summary, body);

  return details;
}const details=el("details","paper"),summary=el("summary"),head=el("div");head.append(el("h3",null,p.title),el("p",null,p.byline),el("p","status",p.status));const toggle=el("span");toggle.append(el("b",null,"View"),el("i",null,"Close"));summary.append(head,toggle);const body=el("div","paper-details"),copy=el("div");copy.append(el("p",null,p.description));const actions=el("div","actions");actions.append(link("Paper ↗",p.paper,true),bibLink(p));(p.links||[]).forEach(([t,h])=>actions.append(link(t+" ↗",h,true)));copy.append(actions);const fig=el("figure"),img=el("img");img.src=p.image;img.alt="Selected figure from "+p.title;fig.append(img,el("figcaption",null,"Selected figure from the paper"));body.append(copy,fig);details.append(summary,body);return details}
function papers(id,title,items,note){const s=el("section","content");s.id=id;const sh=el("div","section-heading");sh.append(el("h2",null,title));if(note)sh.append(el("p",null,note));const list=el("div","paper-list");items.forEach(p=>list.append(paperItem(p)));s.append(sh,list);root.append(s)}
papers("working","Working papers",d.workingPapers,"Click a paper for details.");papers("published","Published and forthcoming articles",d.publishedPapers);
const w=el("section","content");w.id="wip";const wh=el("div","section-heading");wh.append(el("h2",null,"Research in progress"));const ul=el("ul","wip");d.researchInProgress.forEach(x=>{const li=el("li");li.append(el("strong",null,x.title));if(x.coauthors)li.append(el("span","coauthors",x.coauthors));ul.append(li)});w.append(wh,ul);root.append(w);
function cvSection(id,title,items){const s=el("section","content");s.id=id;const sh=el("div","section-heading");sh.append(el("h2",null,title));const list=el("ul","cv-list");items.forEach(x=>{const li=el("li"),main=el("div","cv-entry");main.append(el("strong",null,x.title),el("span","cv-year",x.year));li.append(main);if(x.description)li.append(el("p",null,x.description));list.append(li)});s.append(sh,list);root.append(s)}
cvSection("funding","Research funding",d.researchFunding);
cvSection("awards","Awards",d.awards);
const ts=el("section","content");ts.id="teaching";const th=el("div","section-heading");th.append(el("h2",null,"Teaching"));const courses=el("div","courses");d.teaching.forEach(c=>{const box=el("div","course");box.append(el("h3",null,c.name));const ol=el("ol");c.lessons.forEach((x,i)=>{const li=el("li");li.append(el("span",null,String(i+1).padStart(2,"0")),link(x.title+" ↗",x.url,true));ol.append(li)});box.append(ol);courses.append(box)});ts.append(th,courses);root.append(ts);
const footer=el("footer");footer.id="contact";footer.append(el("p",null,d.profile.name),link(d.profile.email,"mailto:"+d.profile.email),el("span",null,d.profile.location),link("↑ Top","#top"));root.append(footer);
