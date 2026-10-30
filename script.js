const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

let cfg = null, list = [], i = 0, score = 0, left = 0, tick = null, locked = false, log = [], startedAt = 0;

/* ---------- navigation ---------- */
function show(id) {
  $$(".view").forEach((v) => v.classList.toggle("hidden", v.id !== id));
  $$("[data-nav]").forEach((b) => b.classList.toggle("active", b.dataset.nav === id && b.tagName === "BUTTON"));
  if (id === "history") renderHistory();
  window.scrollTo(0, 0);
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-nav]");
  if (!t) return;
  e.preventDefault();
  if (!$("#quiz").classList.contains("hidden")) stopTimer();
  show(t.dataset.nav);
});

/* ---------- theme ---------- */
function setTheme(t) { document.documentElement.dataset.theme = t; store.set("theme", t); }
setTheme(store.get("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
$("#themeBtn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/* ---------- setup ---------- */
const topicBox = $("#topicChips");
Object.entries(TOPICS).forEach(([key, t], n) => {
  topicBox.insertAdjacentHTML("beforeend",
    `<label><input type="radio" name="topic" value="${key}" ${n === 0 ? "checked" : ""}><span>${t.icon} ${t.name}</span></label>`);
});
topicBox.insertAdjacentHTML("beforeend", `<label><input type="radio" name="topic" value="mixed"><span>Mixed</span></label>`);

function readSetup() {
  const f = new FormData($("#setup"));
  return { topic: f.get("topic"), count: f.get("count"), time: +f.get("time"), order: f.get("order"), feedback: f.get("feedback") };
}
function topicName(k) { return k === "mixed" ? "Mixed" : TOPICS[k].name; }
function pool(topic) {
  const keys = topic === "mixed" ? Object.keys(TOPICS) : [topic];
  return keys.flatMap((k) => TOPICS[k].questions.map((q) => ({ q: q[0], o: q[1], a: q[2], e: q[3], topic: k })));
}
function updateSummary() {
  const c = readSetup(), total = pool(c.topic).length;
  const n = c.count === "all" ? total : Math.min(+c.count, total);
  $("#summary").textContent = `${topicName(c.topic)} · ${n} questions · ${c.time ? c.time + " seconds each" : "no timer"} · ${c.order === "random" ? "random order" : "fixed order"} · feedback ${c.feedback === "instant" ? "after each answer" : "at the end"}`;
}
$("#setup").addEventListener("change", updateSummary);
$("#setup").addEventListener("submit", (e) => { e.preventDefault(); begin(readSetup()); });
updateSummary();

/* ---------- quiz ---------- */
function shuffle(a) { for (let n = a.length - 1; n > 0; n--) { const j = Math.floor(Math.random() * (n + 1)); [a[n], a[j]] = [a[j], a[n]]; } return a; }

function begin(c) {
  cfg = c;
  let all = pool(c.topic);
  if (c.order === "random") shuffle(all);
  list = c.count === "all" ? all : all.slice(0, +c.count);
  i = 0; score = 0; log = []; startedAt = Date.now();
  show("quiz");
  load();
}

function load() {
  const item = list[i];
  locked = false;
  $("#qCount").textContent = `Question ${i + 1} of ${list.length}`;
  $("#liveScore").textContent = `Score ${score}`;
  $("#fill").style.width = (i / list.length * 100) + "%";
  $("#question").textContent = item.q;
  $("#explain").classList.add("hidden");
  $("#nextBtn").classList.add("hidden");
  const box = $("#options"); box.innerHTML = "";
  item.o.forEach((text, n) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.innerHTML = "<kbd></kbd><span></span>";
    b.firstChild.textContent = n + 1;
    b.lastChild.textContent = text;      // textContent so "<a>" shows as text
    b.onclick = () => answer(n);
    box.appendChild(b);
  });
  stopTimer();
  if (cfg.time) {
    left = cfg.time; drawTimer();
    tick = setInterval(() => { left--; drawTimer(); if (left <= 0) answer(-1); }, 1000);
  } else { $("#timer").textContent = "No timer"; $("#timer").classList.remove("low"); }
}
function stopTimer() { clearInterval(tick); }
function drawTimer() { $("#timer").textContent = left + " s"; $("#timer").classList.toggle("low", left <= 5); }

function answer(n) {
  if (locked) return;
  locked = true; stopTimer();
  const item = list[i], right = n === item.a;
  if (right) score++;
  log.push({ q: item.q, yours: n === -1 ? "No answer (time up)" : item.o[n], correct: item.o[item.a], right, e: item.e });
  $("#liveScore").textContent = `Score ${score}`;
  [...$("#options").children].forEach((b, idx) => {
    b.disabled = true;
    if (cfg.feedback === "instant") {
      if (idx === item.a) b.classList.add("correct");
      else if (idx === n) b.classList.add("wrong");
    } else if (idx === n) b.classList.add("picked");
  });
  if (cfg.feedback === "instant") {
    $("#explain").textContent = (right ? "Correct. " : n === -1 ? "Time is up. " : "Not quite. ") + item.e;
    $("#explain").classList.remove("hidden");
  }
  $("#nextBtn").textContent = i === list.length - 1 ? "See results" : "Next";
  $("#nextBtn").classList.remove("hidden");
  $("#nextBtn").focus();
}
$("#nextBtn").onclick = () => { i++; i < list.length ? load() : finish(); };
$("#quitBtn").onclick = () => { stopTimer(); show("home"); };
document.addEventListener("keydown", (e) => {
  if ($("#quiz").classList.contains("hidden")) return;
  const n = +e.key;
  if (n >= 1 && n <= 4) answer(n - 1);
  else if (e.key === "Enter" && locked) $("#nextBtn").click();
});

/* ---------- result ---------- */
function finish() {
  const total = list.length, pct = Math.round(score / total * 100);
  const secs = Math.round((Date.now() - startedAt) / 1000);
  const tier = pct === 100 ? ["Outstanding", "A perfect score. Your fundamentals are excellent. Try the Mixed topic next to challenge yourself across languages."]
    : pct >= 80 ? ["Excellent work", "You clearly know this topic well. Review the few misses below and you will be near perfect."]
    : pct >= 60 ? ["Good job", "Solid base. Read the explanations for the questions you missed, then retry to improve your score."]
    : pct >= 40 ? ["Getting there", "You know part of the topic. Practise the basics again and retake the quiz."]
    : ["Keep practising", "Everyone starts somewhere. Study the explanations below, then try again. Your score will rise quickly."];
  $("#finalScore").textContent = `${score}/${total}`;
  $("#grade").textContent = `${tier[0]} (${pct}%)`;
  $("#praise").textContent = tier[1];
  $("#stats").innerHTML = `<div class="stat"><b>${topicName(cfg.topic)}</b>language</div><div class="stat"><b>${Math.floor(secs / 60)}m ${secs % 60}s</b>time taken</div><div class="stat"><b>${total - score}</b>missed</div>`;
  const ul = $("#review"); ul.innerHTML = "";
  log.forEach((r) => {
    const li = document.createElement("li");
    const head = document.createElement("div");
    head.textContent = r.q;
    const det = document.createElement("div");
    det.className = r.right ? "ok" : "no";
    det.textContent = r.right ? `Correct: ${r.correct}` : `Your answer: ${r.yours}. Correct: ${r.correct}. ${r.e}`;
    li.append(head, det); ul.appendChild(li);
  });
  const h = store.get("history", []);
  h.unshift({ date: new Date().toLocaleString(), topic: topicName(cfg.topic), score, total, pct, secs });
  store.set("history", h.slice(0, 20));
  show("result");
}
$("#retryBtn").onclick = () => begin(cfg);

/* ---------- history ---------- */
function renderHistory() {
  const h = store.get("history", []), body = $("#historyBody");
  if (!h.length) { body.innerHTML = "<p>No attempts yet. Take a quiz and it will appear here.</p>"; return; }
  const best = Math.max(...h.map((x) => x.pct));
  body.innerHTML = `<p>Attempts: ${h.length} · Best score: ${best}%</p><div style="overflow-x:auto"><table><thead><tr><th>Date</th><th>Language</th><th>Score</th><th>%</th></tr></thead><tbody>${
    h.map((x) => `<tr><td>${x.date}</td><td>${x.topic}</td><td>${x.score}/${x.total}</td><td>${x.pct}%</td></tr>`).join("")}</tbody></table></div>`;
}
$("#clearBtn").onclick = () => { store.set("history", []); renderHistory(); };

show("home");
