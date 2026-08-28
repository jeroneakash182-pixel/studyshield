/* ===== StudyShield AI — script.js ===== */

/* ---------- Demo data ---------- */

const TOPICS = [
  { subject: "Computer Networks", topic: "TCP/IP", perf: 42, weight: 5, days: 9 },
  { subject: "DBMS", topic: "Normalization", perf: 55, weight: 5, days: 6 },
  { subject: "Operating Systems", topic: "Process Scheduling", perf: 61, weight: 4, days: 4 },
  { subject: "Computer Networks", topic: "Subnetting", perf: 64, weight: 4, days: 5 },
  { subject: "Web Programming", topic: "REST APIs", perf: 72, weight: 3, days: 2 },
  { subject: "Cloud Computing", topic: "Virtualization", perf: 78, weight: 3, days: 3 },
  { subject: "DBMS", topic: "Indexing", perf: 81, weight: 3, days: 2 },
  { subject: "Web Programming", topic: "DOM & Events", perf: 88, weight: 2, days: 1 }
];

const SUBJECTS = [
  { name: "Web Programming", score: 84 },
  { name: "Computer Networks", score: 51 },
  { name: "DBMS", score: 66 },
  { name: "Cloud Computing", score: 78 },
  { name: "Operating Systems", score: 63 }
];

const DEFAULT_TASKS = [
  { id: 1, name: "TCP/IP", min: 30, pri: "High" },
  { id: 2, name: "Normalization", min: 25, pri: "Medium" },
  { id: 3, name: "Cloud Virtualization", min: 20, pri: "Revision" },
  { id: 4, name: "AI Micro Quiz", min: 15, pri: "Revision" }
];

const QUESTION_BANK = [
  {
    t: "Computer Networks",
    q: "What is the purpose of the TCP three-way handshake?",
    o: [
      "To establish a reliable connection and synchronize sequence numbers",
      "To compress packet payloads before transfer",
      "To assign IP addresses to hosts",
      "To route packets across autonomous systems"
    ],
    a: 0,
    e: "SYN → SYN-ACK → ACK synchronizes sequence numbers on both sides and confirms both hosts can send and receive before data flows."
  },
  {
    t: "Computer Networks",
    q: "Which layer of the TCP/IP model does IP operate at?",
    o: [
      "Application",
      "Transport",
      "Internet",
      "Network Access"
    ],
    a: 2,
    e: "IP lives at the Internet layer, handling logical addressing and routing between networks."
  },
  {
    t: "Computer Networks",
    q: "UDP is preferred over TCP mainly because it…",
    o: [
      "Guarantees delivery order",
      "Has lower overhead and latency",
      "Encrypts data by default",
      "Retransmits lost segments"
    ],
    a: 1,
    e: "UDP is connectionless with no handshake or retransmission, so it is faster — ideal for streaming, DNS and gaming."
  },
  {
    t: "DBMS",
    q: "A relation is in 3NF when it is in 2NF and…",
    o: [
      "Has no multi-valued dependencies",
      "Has no transitive dependency on the primary key",
      "Has only one candidate key",
      "Is fully denormalized"
    ],
    a: 1,
    e: "3NF removes transitive dependencies."
  },
  {
    t: "DBMS",
    q: "Which normal form eliminates partial dependency?",
    o: [
      "1NF",
      "2NF",
      "BCNF",
      "4NF"
    ],
    a: 1,
    e: "2NF requires every non-key attribute to depend on the entire composite key."
  },
  {
    t: "Operating Systems",
    q: "Which scheduling algorithm can cause starvation of long processes?",
    o: [
      "First Come First Serve",
      "Round Robin",
      "Shortest Job First",
      "Multilevel with aging"
    ],
    a: 2,
    e: "SJF always favours short bursts, so a long job can be postponed indefinitely."
  },
  {
    t: "Operating Systems",
    q: "In Round Robin scheduling, a very small time quantum causes…",
    o: [
      "Higher context-switch overhead",
      "Starvation",
      "Deadlock",
      "Lower CPU utilization by I/O"
    ],
    a: 0,
    e: "Tiny quanta mean the CPU spends a large fraction of its time switching contexts."
  },
  {
    t: "Cloud Computing",
    q: "A Type-1 hypervisor is best described as…",
    o: [
      "Running on a host OS",
      "Running directly on bare metal hardware",
      "A container runtime",
      "A load balancer"
    ],
    a: 1,
    e: "Type-1 hypervisors run directly on hardware."
  },
  {
    t: "Web Programming",
    q: "Which HTTP status code means the resource was created?",
    o: [
      "200",
      "201",
      "204",
      "301"
    ],
    a: 1,
    e: "201 Created is the correct response for a successful POST that produced a new resource."
  },
  {
    t: "Web Programming",
    q: "In REST, which method should be idempotent?",
    o: [
      "POST",
      "PUT",
      "PATCH (always)",
      "CONNECT"
    ],
    a: 1,
    e: "PUT is idempotent because repeating the same request produces the same resource state."
  }
];

const ACHIEVEMENTS = [
  {
    id: "first_quiz",
    icon: "🏆",
    name: "First Quiz",
    desc: "Complete your first AI quiz"
  },
  {
    id: "streak7",
    icon: "🔥",
    name: "7-Day Streak",
    desc: "Study 7 days in a row"
  },
  {
    id: "destroyer",
    icon: "🎯",
    name: "Weak Topic Destroyer",
    desc: "Finish a focus session"
  },
  {
    id: "warrior",
    icon: "📚",
    name: "Study Warrior",
    desc: "Complete a full day's plan"
  },
  {
    id: "ready",
    icon: "⚡",
    name: "Exam Ready",
    desc: "Run the recovery simulator at 90+ min"
  },
  {
    id: "perfect",
    icon: "💯",
    name: "Perfect Quiz",
    desc: "Score 5/5 on a micro quiz"
  }
];

/* ---------- State ---------- */

const KEY = "studyshield.v1";

const defaultState = {
  loggedIn: false,
  theme: "dark",

  profile: {
    name: "Jerone Akash",
    course: "Computer Science",
    sem: 5,
    attendance: 86,
    overall: 72
  },

  tasks: DEFAULT_TASKS.map(t => ({
    ...t,
    done: false
  })),

  quizScore: null,
  accuracy: 78,
  streak: 7,
  achievements: [],
  alertsRead: [],
  focusDone: false
};

let S = load();

function load() {
  try {
    return {
      ...structuredClone(defaultState),
      ...JSON.parse(localStorage.getItem(KEY) || "{}")
    };
  } catch (error) {
    console.error("State loading error:", error);
    return structuredClone(defaultState);
  }
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(S));
}

/* ---------- Utilities ---------- */

const $ = selector => document.querySelector(selector);

const $$ = selector => [
  ...document.querySelectorAll(selector)
];

const riskOf = performance => {
  if (performance < 50) {
    return {
      l: "🔴 Critical",
      c: "crit"
    };
  }

  if (performance < 65) {
    return {
      l: "🟠 High",
      c: "high"
    };
  }

  if (performance < 78) {
    return {
      l: "🟡 Moderate",
      c: "warn"
    };
  }

  return {
    l: "🟢 Safe",
    c: "good"
  };
};

function toast(message) {
  const wrap = $("#toastWrap");

  if (!wrap) {
    console.log(message);
    return;
  }

  const el = document.createElement("div");

  el.className = "toast";
  el.textContent = message;

  wrap.appendChild(el);

  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(40px)";
    el.style.transition = ".4s";
  }, 3200);

  setTimeout(() => {
    el.remove();
  }, 3700);
}

function countUp(el) {
  const target = Number(el.dataset.count);

  if (Number.isNaN(target)) return;

  const duration = 900;
  const start = performance.now();

  function step(time) {
    const progress = Math.min(
      (time - start) / duration,
      1
    );

    el.textContent = Math.round(
      target * (1 - Math.pow(1 - progress, 3))
    );

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function runCounters(root = document) {
  if (!root) return;

  root
    .querySelectorAll(".count")
    .forEach(countUp);
}

/* ---------- Theme ---------- */

function applyTheme() {
  document.documentElement.dataset.theme = S.theme;

  const icon = S.theme === "dark" ? "🌙" : "☀️";

  ["#themeToggle", "#themeToggleLanding"].forEach(selector => {
    const element = $(selector);

    if (element) {
      element.textContent = icon;
    }
  });
}

function toggleTheme() {
  S.theme = S.theme === "dark"
    ? "light"
    : "dark";

  save();
  applyTheme();

  toast(
    `${S.theme === "dark" ? "Dark" : "Light"} mode enabled`
  );
}

/* ---------- Modals / Authentication ---------- */

function openModal(id) {
  const modal = $("#" + id);

  if (modal) {
    modal.classList.add("open");
  }
}

function closeModal(id) {
  const modal = $("#" + id);

  if (modal) {
    modal.classList.remove("open");
  }
}

function openLogin() {
  openModal("loginModal");
}

function handleLogin(event) {
  event.preventDefault();

  const email = $("#loginEmail");

  const username = email
    ? email.value.split("@")[0]
    : "Jerone";

  enterApp(username);

  return false;
}

function demoLogin() {
  enterApp();
}

function enterApp(username = null) {
  closeModal("loginModal");

  if (username) {
    S.profile.name =
      username.charAt(0).toUpperCase() +
      username.slice(1);
  }

  S.loggedIn = true;

  save();

  const landing = $("#landing");
  const app = $("#app");

  if (landing) {
    landing.classList.add("hidden");
  }

  if (app) {
    app.classList.remove("hidden");
  }

  initApp();

  toast(
    "Welcome back, " +
    S.profile.name.split(" ")[0] +
    " 👋"
  );
}

function logout() {
  S.loggedIn = false;

  save();

  $("#app")?.classList.add("hidden");
  $("#landing")?.classList.remove("hidden");

  window.scrollTo(0, 0);

  toast("Signed out");
}

/* ---------- Navigation ---------- */

const TITLES = {
  dashboard: "Dashboard",
  intel: "Shield Intelligence",
  syllabus: "Syllabus Analyzer",
  plan: "Study Plan",
  quiz: "AI Micro Quiz",
  analytics: "Analytics",
  alerts: "Alerts",
  achievements: "Achievements",
  profile: "Profile"
};

function go(view) {
  $$(".view").forEach(element => {
    element.classList.toggle(
      "active",
      element.id === "view-" + view
    );
  });

  $$(".s-link").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === view
    );
  });

  if ($("#viewTitle")) {
    $("#viewTitle").textContent =
      TITLES[view] || "Dashboard";
  }

  toggleSidebar(false);

  const element = $("#view-" + view);

  if (element) {
    runCounters(element);
  }

  if (view === "analytics") {
    drawAnalytics();
  }

  if (
    view === "quiz" &&
    $("#quizCard") &&
    !$("#quizCard").dataset.started
  ) {
    newQuiz();
  }

  document
    .querySelector(".main")
    ?.scrollTo(0, 0);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function toggleSidebar(open) {
  $("#sidebar")?.classList.toggle("open", open);
  $("#scrim")?.classList.toggle("open", open);
}

/* ---------- Dashboard ---------- */

function renderDash() {
  const hour = new Date().getHours();

  const part =
    hour < 12
      ? "Morning"
      : hour < 17
        ? "Afternoon"
        : "Evening";

  if ($("#greeting")) {
    $("#greeting").textContent =
      `Good ${part}, ${S.profile.name.split(" ")[0]} 👋`;
  }

  if ($("#accStat")) {
    $("#accStat").dataset.count = S.accuracy;
  }

  if ($("#accBar")?.firstElementChild) {
    $("#accBar").firstElementChild.style.width =
      S.accuracy + "%";
  }

  if ($("#streakStat")) {
    $("#streakStat").dataset.count = S.streak;
  }

  if ($("#dashWeak")) {
    $("#dashWeak").innerHTML =
      TOPICS
        .slice(0, 4)
        .map(topic => {
          const risk = riskOf(topic.perf);

          return `
            <div class="weak-item">
              <div class="wr">
                <span>
                  ${topic.topic}
                  <em class="muted">· ${topic.subject}</em>
                </span>

                <span class="tag ${risk.c}">
                  ${topic.perf}%
                </span>
              </div>

              <i class="bar">
                <b style="width:${topic.perf}%"></b>
              </i>
            </div>
          `;
        })
        .join("");
  }

  updatePlanUI();
}

/* ---------- Focus Timer ---------- */

let focusTimer = null;
let focusLeft = 30 * 60;

function startFocus() {
  if (focusTimer) {
    clearInterval(focusTimer);
    focusTimer = null;

    if ($("#focusBtn")) {
      $("#focusBtn").textContent =
        "▶ Resume Focus Session";
    }

    if ($("#focusHint")) {
      $("#focusHint").textContent = "Paused";
    }

    return;
  }

  if ($("#focusBtn")) {
    $("#focusBtn").textContent =
      "⏸ Pause Session";
  }

  if ($("#focusHint")) {
    $("#focusHint").textContent =
      "Deep work on TCP/IP · stay off distractions";
  }

  toast(
    "Focus session started — 30 minutes on TCP/IP"
  );

  focusTimer = setInterval(() => {
    focusLeft--;

    const minutes = String(
      Math.floor(focusLeft / 60)
    ).padStart(2, "0");

    const seconds = String(
      focusLeft % 60
    ).padStart(2, "0");

    if ($("#focusTime")) {
      $("#focusTime").textContent =
        `${minutes}:${seconds}`;
    }

    if ($("#focusRing")) {
      $("#focusRing").style.setProperty(
        "--p",
        (
          100 -
          (focusLeft / 1800) * 100
        ).toFixed(1)
      );
    }

    if (focusLeft <= 0) {
      clearInterval(focusTimer);
      focusTimer = null;

      if ($("#focusBtn")) {
        $("#focusBtn").textContent =
          "✓ Session Complete";
      }

      if ($("#focusHint")) {
        $("#focusHint").textContent =
          "Nice work — TCP/IP mastery updated";
      }

      unlock("destroyer");

      toast("🎯 Focus session complete!");
    }
  }, 1000);
}

/* ---------- Shield Intelligence ---------- */

const INSIGHTS = [
  {
    c: "crit",
    t: "🔴 Critical",
    m: "Normalization needs immediate attention. Accuracy sits at 55% with a high-weight exam in 6 days."
  },
  {
    c: "warn",
    t: "🟡 Warning",
    m: "Your Computer Networks quiz accuracy dropped by 18% over the last two attempts."
  },
  {
    c: "good",
    t: "🟢 Positive",
    m: "You improved Cloud Computing by 14% this week — virtualization is now in the safe band."
  },
  {
    c: "warn",
    t: "🟡 Warning",
    m: "Process Scheduling hasn't been revised in 4 days and appears in 2 past papers."
  },
  {
    c: "good",
    t: "🟢 Positive",
    m: "7-day study streak maintained. Consistency is your strongest predictor right now."
  }
];

const RISK_FACTORS = [
  {
    n: "Low quiz accuracy on high-weight topics",
    v: 28
  },
  {
    n: "Topic recency decay (not revised recently)",
    v: 22
  },
  {
    n: "Attendance below subject threshold",
    v: 14
  },
  {
    n: "Exam proximity pressure (12 days)",
    v: 20
  },
  {
    n: "Assignment submission consistency",
    v: 16
  }
];

function renderIntel() {
  if ($("#insightGrid")) {
    $("#insightGrid").innerHTML =
      INSIGHTS
        .map(
          insight => `
            <div class="insight ${insight.c}">
              <b>${insight.t}</b>
              <p>${insight.m}</p>
            </div>
          `
        )
        .join("");
  }

  if ($("#riskFactors")) {
    $("#riskFactors").innerHTML =
      RISK_FACTORS
        .map(
          factor => `
            <div class="factor">
              <div class="fr">
                <span>${factor.n}</span>
                <span>${factor.v}%</span>
              </div>

              <i class="bar">
                <b style="width:${factor.v * 3}%"></b>
              </i>
            </div>
          `
        )
        .join("");
  }
}

function openRisk() {
  openModal("riskModal");
}

function analyzeFuture() {
  const output = $("#futureOut");

  if (!output) return;

  output.classList.remove("hidden");

  output.innerHTML = `
    <b>3 topics require immediate attention.</b>

    <ul>
      ${TOPICS
        .slice(0, 3)
        .map(
          topic => `
            <li>
              ${topic.topic} (${topic.subject})
              — ${topic.perf}%
              · exam in ${topic.days} days
            </li>
          `
        )
        .join("")}
    </ul>

    <p class="muted" style="margin-top:.6rem">
      Projected readiness without action:
      <b>61%</b>.
      With the recommended plan:
      <b>84%</b>.
    </p>
  `;

  toast("Future risk analysis complete");
}

/* ---------- Recovery Simulator ---------- */

const SIM = {
  30: 74,
  60: 81,
  90: 88,
  120: 92
};

function renderSim() {
  const chart = $("#simChart");

  if (!chart) return;

  chart.innerHTML =
    Object.entries(SIM)
      .map(
        ([minutes, value]) => `
          <div class="sc" data-min="${minutes}">
            <span class="scv">${value}%</span>
            <div class="scb" style="height:0"></div>
            <span class="scl">${minutes} min</span>
          </div>
        `
      )
      .join("");

  requestAnimationFrame(() => {
    $$("#simChart .scb").forEach(bar => {
      const minutes =
        bar.parentElement.dataset.min;

      bar.style.height =
        SIM[minutes] * 0.85 + "%";
    });
  });

  $$(".sim").forEach(button => {
    button.onclick = () => {
      const minutes = button.dataset.min;
      const value = SIM[minutes];

      $$(".sim").forEach(element => {
        element.classList.toggle(
          "active",
          element === button
        );
      });

      $$("#simChart .sc").forEach(element => {
        element.classList.toggle(
          "on",
          element.dataset.min === minutes
        );
      });

      if ($("#simResult")) {
        $("#simResult").innerHTML = `
          Studying <b>${minutes} minutes/day</b>
          for the next 12 days raises your predicted
          exam readiness from <b>68%</b> to
          <b>${value}%</b>
          (+${value - 68} points).

          ${
            value >= 88
              ? "This clears your 85% target."
              : `You are still ${85 - value} points short of the 85% target.`
          }
        `;
      }

      if ($("#predBar")) {
        $("#predBar").style.width = value + "%";
      }

      if ($("#predVal")) {
        $("#predVal").textContent =
          value + "%";
      }

      if (Number(minutes) >= 90) {
        unlock("ready");
      }
    };
  });
}

/* ---------- Syllabus Analyzer ---------- */

const PIPE = [
  "Uploading",
  "Analyzing",
  "Mapping Topics",
  "Detecting Weak Areas",
  "Complete"
];

function renderSyllabus() {
  if ($("#stepsLine")) {
    $("#stepsLine").innerHTML =
      PIPE
        .map(
          step => `
            <div class="pstep">${step}</div>
          `
        )
        .join("");
  }

  renderTopicTable(TOPICS.slice(0, 3));

  const dropZone = $("#dropZone");
  const fileInput = $("#fileInput");

  if (!dropZone || !fileInput) return;

  fileInput.onchange = () => {
    if (fileInput.files[0]) {
      $("#fileName").textContent =
        fileInput.files[0].name;

      toast(
        "File selected — ready to analyze"
      );
    }
  };

  ["dragover", "dragenter"].forEach(eventName => {
    dropZone.addEventListener(
      eventName,
      event => {
        event.preventDefault();
        dropZone.classList.add("drag");
      }
    );
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(
      eventName,
      event => {
        event.preventDefault();
        dropZone.classList.remove("drag");
      }
    );
  });

  dropZone.addEventListener("drop", event => {
    const file = event.dataTransfer.files[0];

    if (file) {
      $("#fileName").textContent =
        file.name;

      toast(
        "File dropped — ready to analyze"
      );
    }
  });
}

function renderTopicTable(list) {
  const table = $("#topicTable");

  if (!table) return;

  table.innerHTML =
    list
      .map(topic => {
        const risk = riskOf(topic.perf);

        return `
          <tr>
            <td>${topic.subject}</td>

            <td>
              <b>${topic.topic}</b>
            </td>

            <td>
              <div class="perfcell">
                <i class="bar">
                  <b style="width:${topic.perf}%"></b>
                </i>

                <span>${topic.perf}%</span>
              </div>
            </td>

            <td>
              <span class="tag ${risk.c}">
                ${risk.l}
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
}

let analyzing = false;

function runAnalysis() {
  if (analyzing) return;

  analyzing = true;

  const steps =
    $$("#stepsLine .pstep");

  steps.forEach(step => {
    step.className = "pstep";
  });

  if ($("#pipeBar")) {
    $("#pipeBar").style.width = "0%";
  }

  renderTopicTable([]);

  let index = 0;

  function next() {
    if (index > 0) {
      steps[index - 1].className =
        "pstep done";
    }

    if (index >= PIPE.length) {
      analyzing = false;

      renderTopicTable(TOPICS);

      toast(
        "✅ Syllabus analyzed — 8 topics mapped, 3 weak areas found"
      );

      return;
    }

    steps[index].className =
      "pstep on";

    if ($("#pipeBar")) {
      $("#pipeBar").style.width =
        ((index + 1) / PIPE.length) * 100 + "%";
    }

    index++;

    setTimeout(next, 850);
  }

  next();
}

/* ---------- Study Plan ---------- */

function renderPlan() {
  const list = $("#taskList");

  if (!list) return;

  list.innerHTML =
    S.tasks
      .map(task => {
        const cls =
          task.pri === "High"
            ? "crit"
            : task.pri === "Medium"
              ? "high"
              : "good";

        const dot =
          task.pri === "High"
            ? "🔴"
            : task.pri === "Medium"
              ? "🟠"
              : "🟢";

        return `
          <div
            class="task ${task.done ? "done" : ""}"
            data-id="${task.id}"
          >
            <div class="chk">✓</div>

            <div>
              <div class="t-name">
                ${task.name}
              </div>

              <div class="t-meta">
                ${task.min} min · AI-scheduled block
              </div>
            </div>

            <div class="t-right">
              <span class="tag ${cls}">
                ${dot} ${task.pri} Priority
              </span>
            </div>
          </div>
        `;
      })
      .join("");

  $$("#taskList .task").forEach(element => {
    element.onclick = () => {
      toggleTask(Number(element.dataset.id));
    };
  });

  updatePlanUI();
}

function toggleTask(id) {
  const task =
    S.tasks.find(item => item.id === id);

  if (!task) return;

  task.done = !task.done;

  save();
  renderPlan();

  if (task.done) {
    toast(`✓ ${task.name} completed`);
  }

  if (S.tasks.every(item => item.done)) {
    unlock("warrior");
    toast(
      "🎉 Today's study plan complete!"
    );
  }
}

function resetPlan() {
  S.tasks.forEach(task => {
    task.done = false;
  });

  save();
  renderPlan();

  toast("Plan reset");
}

function updatePlanUI() {
  if (!S.tasks.length) return;

  const completed =
    S.tasks.filter(task => task.done).length;

  const percentage =
    Math.round(
      completed / S.tasks.length * 100
    );

  [
    "#planBar",
    "#dashPlanBar"
  ].forEach(selector => {
    const element = $(selector);

    if (element) {
      element.style.width =
        percentage + "%";
    }
  });

  [
    "#planPct",
    "#dashPlanPct"
  ].forEach(selector => {
    const element = $(selector);

    if (element) {
      element.textContent =
        percentage + "%";
    }
  });

  const text =
    `${completed} of ${S.tasks.length} tasks completed`;

  [
    "#planCount",
    "#dashPlanText"
  ].forEach(selector => {
    const element = $(selector);

    if (element) {
      element.textContent = text;
    }
  });
}

/* ---------- AI Quiz ---------- */

let quiz = {
  qs: [],
  i: 0,
  score: 0,
  locked: false
};

function newQuiz() {
  const pool =
    [...QUESTION_BANK]
      .sort(() => Math.random() - 0.5);

  const weakFirst =
    pool.sort((a, b) => {
      const rank = topic =>
        [
          "Computer Networks",
          "DBMS",
          "Operating Systems"
        ].indexOf(topic);

      return rank(b.t) - rank(a.t);
    });

  quiz = {
    qs: weakFirst.slice(0, 5),
    i: 0,
    score: 0,
    locked: false
  };

  const card = $("#quizCard");

  if (!card) return;

  card.dataset.started = "1";

  renderQuestion();
}

function renderQuestion() {
  const card = $("#quizCard");

  if (!card) return;

  const question =
    quiz.qs[quiz.i];

  if (!question) return;

  card.innerHTML = `
    <div class="q-top">
      <span>
        Question ${quiz.i + 1}
        of ${quiz.qs.length}
      </span>

      <span>
        Topic: ${question.t}
      </span>

      <span>
        Score: ${quiz.score}
      </span>
    </div>

    <i class="bar">
      <b
        style="width:${
          (quiz.i / quiz.qs.length) * 100
        }%"
      ></b>
    </i>

    <div class="q-text">
      ${question.q}
    </div>

    <div class="opts">
      ${question.o
        .map(
          (option, index) => `
            <button
              class="opt"
              data-i="${index}"
            >
              ${String.fromCharCode(65 + index)}.
              ${option}
            </button>
          `
        )
        .join("")}
    </div>

    <div id="explainSlot"></div>
  `;

  $$("#quizCard .opt").forEach(button => {
    button.onclick = () => {
      answer(Number(button.dataset.i));
    };
  });
}

function answer(index) {
  if (quiz.locked) return;

  quiz.locked = true;

  const question =
    quiz.qs[quiz.i];

  const correct =
    index === question.a;

  if (correct) {
    quiz.score++;
  }

  $$("#quizCard .opt").forEach(
    (button, buttonIndex) => {
      button.disabled = true;

      if (buttonIndex === question.a) {
        button.classList.add("correct");
      }

      if (
        buttonIndex === index &&
        !correct
      ) {
        button.classList.add("wrong");
      }
    }
  );

  $("#explainSlot").innerHTML = `
    <div class="explain">
      <b>
        ${correct ? "✅ Correct" : "❌ Incorrect"}
      </b>

      <p style="margin-top:.4rem">
        ${question.e}
      </p>

      <button
        class="btn btn-primary"
        style="margin-top:.8rem"
        id="nextQ"
      >
        ${
          quiz.i === quiz.qs.length - 1
            ? "See results"
            : "Next question →"
        }
      </button>
    </div>
  `;

  $("#nextQ").onclick = () => {
    quiz.locked = false;

    if (
      quiz.i ===
      quiz.qs.length - 1
    ) {
      finishQuiz();
    } else {
      quiz.i++;
      renderQuestion();
    }
  };
}

function finishQuiz() {
  const score = quiz.score;

  const percentage =
    Math.round(
      score / quiz.qs.length * 100
    );

  S.quizScore = score;

  S.accuracy =
    Math.round(
      (S.accuracy + percentage) / 2
    );

  save();

  const feedback =
    score === 5
      ? "Outstanding. Your weak topics are no longer weak — keep the streak alive."
      : score === 4
        ? "Good progress. Review TCP connection establishment once more."
        : score === 3
          ? "Steady. Focus tomorrow's plan on Normalization and TCP/IP fundamentals."
          : "Risk detected. Restart with the 30-minute TCP/IP focus session, then retry this quiz.";

  $("#quizCard").innerHTML = `
    <div class="q-result">

      <div
        class="ring big"
        style="--p:${percentage};margin:0 auto"
      >
        <span>${percentage}%</span>
      </div>

      <h2>
        Your Score:
        ${score}/${quiz.qs.length}
      </h2>

      <p class="muted">
        Quiz accuracy updated to
        <b>${S.accuracy}%</b>
      </p>

      <div class="q-fb">
        <b>AI Feedback</b>

        <p style="margin-top:.4rem">
          ${feedback}
        </p>
      </div>

      <button
        class="btn btn-primary btn-lg"
        onclick="newQuiz()"
      >
        🔄 Generate Another Quiz
      </button>

    </div>
  `;

  unlock("first_quiz");

  if (score === 5) {
    unlock("perfect");
  }

  renderDash();

  toast(
    `Quiz complete — ${score}/5`
  );
}

/* ---------- Analytics ---------- */

function colChart(element, data, unit = "") {
  if (!element || !data.length) return;

  const max =
    Math.max(...data.map(item => item.v));

  element.innerHTML =
    data
      .map(
        item => `
          <div
            class="c"
            title="${item.l}: ${item.v}${unit}"
          >
            <span class="cv">
              ${item.v}${unit}
            </span>

            <div
              class="cb"
              style="height:0"
            ></div>

            <span class="cl">
              ${item.l}
            </span>
          </div>
        `
      )
      .join("");

  requestAnimationFrame(() => {
    [
      ...element.querySelectorAll(".cb")
    ].forEach((bar, index) => {
      bar.style.height =
        (data[index].v / max * 78) + "%";
    });
  });
}

function hBars(element, data) {
  if (!element) return;

  element.innerHTML =
    data
      .map(
        item => `
          <div class="hb">

            <div class="hr">
              <span>${item.l}</span>
              <span>${item.v}%</span>
            </div>

            <i class="bar">
              <b style="width:0"></b>
            </i>

          </div>
        `
      )
      .join("");

  requestAnimationFrame(() => {
    [
      ...element.querySelectorAll(".bar b")
    ].forEach((bar, index) => {
      bar.style.width =
        data[index].v + "%";
    });
  });
}

function drawAnalytics() {
  colChart(
    $("#hoursChart"),
    [
      ["Mon", 2.5],
      ["Tue", 3],
      ["Wed", 1.5],
      ["Thu", 4],
      ["Fri", 2],
      ["Sat", 5],
      ["Sun", 3.5]
    ].map(([label, value]) => ({
      l: label,
      v: value
    })),
    "h"
  );

  const accuracy = [
    62,
    65,
    71,
    68,
    74,
    76,
    S.accuracy
  ];

  const points =
    accuracy
      .map(
        (value, index) =>
          `${(index / (accuracy.length - 1)) * 100},${100 - value}`
      )
      .join(" ");

  if ($("#accChart")) {
    $("#accChart").innerHTML = `
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="lg"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop
              offset="0"
              stop-color="#4f7dff"
            />

            <stop
              offset="1"
              stop-color="#22d3ee"
            />
          </linearGradient>

          <linearGradient
            id="fg"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stop-color="#4f7dff"
              stop-opacity=".45"
            />

            <stop
              offset="1"
              stop-color="#4f7dff"
              stop-opacity="0"
            />
          </linearGradient>
        </defs>

        <polygon
          fill="url(#fg)"
          points="0,100 ${points} 100,100"
        />

        <polyline
          fill="none"
          stroke="url(#lg)"
          stroke-width="2.2"
          stroke-linecap="round"
          points="${points}"
          style="
            stroke-dasharray:400;
            stroke-dashoffset:400;
            animation:dash 1.4s ease forwards
          "
        />

        ${accuracy
          .map(
            (value, index) => `
              <circle
                cx="${
                  (index /
                    (accuracy.length - 1)) *
                  100
                }"
                cy="${100 - value}"
                r="1.8"
                fill="#22d3ee"
              />
            `
          )
          .join("")}

        <style>
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        </style>
      </svg>

      <div
        style="
          display:flex;
          justify-content:space-between;
          font-size:.7rem;
          color:var(--muted);
          font-weight:700
        "
      >
        ${
          ["W1", "W2", "W3", "W4", "W5", "W6", "Now"]
            .map(label => `<span>${label}</span>`)
            .join("")
        }
      </div>
    `;
  }

  hBars(
    $("#subjChart"),
    SUBJECTS.map(subject => ({
      l: subject.name,
      v: subject.score
    }))
  );

  hBars(
    $("#masteryChart"),
    TOPICS
      .slice(0, 6)
      .map(topic => ({
        l: topic.topic,
        v: topic.perf
      }))
  );

  colChart(
    $("#riskChart"),
    [
      ["W1", 88],
      ["W2", 84],
      ["W3", 79],
      ["W4", 76],
      ["W5", 74],
      ["W6", 73],
      ["Now", 72]
    ].map(([label, value]) => ({
      l: label,
      v: value
    }))
  );

  const grid = $("#streakGrid");

  if (grid) {
    grid.innerHTML =
      Array.from(
        { length: 28 },
        (_, index) => `
          <i
            class="${
              index >= 28 - S.streak ||
              (index % 3 === 0 && index < 18)
                ? "a"
                : ""
            }"
          ></i>
        `
      ).join("");
  }
}

/* ---------- Alerts ---------- */

const ALERTS = [
  {
    id: "a1",
    c: "crit",
    i: "🔴",
    t: "Critical",
    m: "TCP/IP remains weak — accuracy 42% with the exam in 8 days.",
    w: "2m ago"
  },
  {
    id: "a2",
    c: "warn",
    i: "🟡",
    t: "Reminder",
    m: "Your DBMS revision is scheduled today at 6:00 PM.",
    w: "1h ago"
  },
  {
    id: "a3",
    c: "good",
    i: "🟢",
    t: "Achievement",
    m: "You completed today's study plan streak requirement!",
    w: "3h ago"
  },
  {
    id: "a4",
    c: "warn",
    i: "🟡",
    t: "Attendance",
    m: "Operating Systems attendance is at 74% — 1 more absence hits the limit.",
    w: "Yesterday"
  },
  {
    id: "a5",
    c: "good",
    i: "🟢",
    t: "Progress",
    m: "Cloud Computing moved from Moderate to Safe risk band.",
    w: "2d ago"
  }
];

function renderAlerts() {
  const list = $("#alertList");

  if (!list) return;

  list.innerHTML =
    ALERTS
      .map(
        alert => `
          <div
            class="alert ${alert.c} ${
              S.alertsRead.includes(alert.id)
                ? "read"
                : ""
            }"
          >
            <span style="font-size:1.2rem">
              ${alert.i}
            </span>

            <div>
              <b>${alert.t}</b>
              <p>${alert.m}</p>
            </div>

            <time>${alert.w}</time>
          </div>
        `
      )
      .join("");

  const unread =
    ALERTS.length -
    S.alertsRead.length;

  if ($("#bellBadge")) {
    $("#bellBadge").textContent =
      unread;

    $("#bellBadge").style.display =
      unread ? "" : "none";
  }
}

function markAllRead() {
  S.alertsRead =
    ALERTS.map(alert => alert.id);

  save();
  renderAlerts();

  toast(
    "All notifications marked as read"
  );
}

/* ---------- Achievements ---------- */

function renderAch() {
  const grid = $("#achGrid");

  if (!grid) return;

  grid.innerHTML =
    ACHIEVEMENTS
      .map(
        achievement => `
          <div
            class="ach ${
              S.achievements.includes(
                achievement.id
              )
                ? "on"
                : ""
            }"
          >
            <div class="ai">
              ${achievement.icon}
            </div>

            <b>${achievement.name}</b>

            <small>
              ${
                S.achievements.includes(
                  achievement.id
                )
                  ? "Unlocked"
                  : achievement.desc
              }
            </small>
          </div>
        `
      )
      .join("");
}

function unlock(id) {
  if (S.achievements.includes(id)) {
    return;
  }

  S.achievements.push(id);

  save();
  renderAch();

  const achievement =
    ACHIEVEMENTS.find(
      item => item.id === id
    );

  if (achievement) {
    toast(
      `${achievement.icon} Achievement unlocked: ${achievement.name}`
    );
  }
}

/* ---------- Profile ---------- */

function renderProfile() {
  const profile = S.profile;

  if ($("#profName")) {
    $("#profName").textContent =
      profile.name;
  }

  if ($("#profSub")) {
    $("#profSub").textContent =
      `${profile.course} · Semester ${profile.sem}`;
  }

  const initials =
    profile.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  if ($("#profAvatar")) {
    $("#profAvatar").textContent =
      initials;
  }

  const avatar = $(".avatar");

  if (avatar) {
    avatar.textContent = initials;
  }

  if ($("#pOverall")) {
    $("#pOverall").textContent =
      profile.overall + "%";
  }

  if ($("#pAtt")) {
    $("#pAtt").textContent =
      profile.attendance + "%";
  }

  if ($("#pStreak")) {
    $("#pStreak").textContent =
      S.streak;
  }

  if ($("#inName")) {
    $("#inName").value =
      profile.name;
  }

  if ($("#inCourse")) {
    $("#inCourse").value =
      profile.course;
  }

  if ($("#inSem")) {
    $("#inSem").value =
      profile.sem;
  }

  if ($("#inAtt")) {
    $("#inAtt").value =
      profile.attendance;
  }
}

function saveProfile() {
  S.profile = {
    ...S.profile,

    name:
      $("#inName")?.value ||
      S.profile.name,

    course:
      $("#inCourse")?.value ||
      S.profile.course,

    sem:
      Number($("#inSem")?.value) ||
      S.profile.sem,

    attendance:
      Number($("#inAtt")?.value) ||
      S.profile.attendance
  };

  save();

  renderProfile();
  renderDash();

  toast("Profile updated");
}

/* ---------- ShieldBot ---------- */

function toggleBot() {
  const windowElement = document.getElementById("botWin");

  if (!windowElement) return;

  windowElement.classList.toggle("hidden");

  if (
    !windowElement.classList.contains("hidden") &&
    document.getElementById("botBody") &&
    document.getElementById("botBody").children.length === 0
  ) {
    botSay(
      "Hi Jerone 👋 I'm ShieldBot. Ask me what to study, why you're at risk, or for an explanation of any weak topic."
    );
  }
}


function botSay(text, me = false) {
  const body = document.getElementById("botBody");

  if (!body) return;

  const element = document.createElement("div");

  element.className = "msg " + (me ? "me" : "bot");

  element.textContent = text;

  body.appendChild(element);

  body.scrollTop = body.scrollHeight;
}


function botSubmit(event) {
  event.preventDefault();

  const input = document.getElementById("botInput");

  if (!input) return false;

  const value = input.value.trim();

  if (value !== "") {
    botAsk(value);
    input.value = "";
  }

  return false;
}


function botAsk(question) {
  if (!question) return;

  botSay(question, true);

  setTimeout(function () {
    botSay(
      botReply(question.toLowerCase())
    );
  }, 450);
}


function botReply(question) {

  /* ---------- Study Priority ---------- */

  if (
    /what.*study|study now|study right now|next|priority/.test(
      question
    )
  ) {
    return `🎯 Study TCP/IP for 30 minutes right now.

Why:
• Quiz accuracy: 42%
• High exam importance
• Not revised recently
• Exam in 8 days

After that:
1. Normalization — 25 minutes
2. Cloud Virtualization — 20 minutes`;
  }


  /* ---------- Risk ---------- */

  if (
    /risk|why.*at risk|risk score|academic score|score/.test(
      question
    )
  ) {
    return `🛡️ Your academic risk is 72/100 — Moderate Risk.

Main risk drivers:
• Low accuracy on high-weight topics — 28%
• Recency decay — 22%
• Exam proximity — 20%
• Assignment consistency — 16%
• Attendance — 14%

Priority:
Improve TCP/IP and Normalization first.

Estimated improved risk after closing these gaps: about 58/100.`;
  }


  /* ---------- TCP/IP ---------- */

  if (
    /tcp|ip|handshake|network|computer network/.test(
      question
    )
  ) {
    return `📚 TCP/IP explained:

IP is responsible for routing packets between networks using logical IP addresses.

TCP provides reliable and ordered communication.

TCP connection setup uses a three-way handshake:

1. Client → SYN
2. Server → SYN-ACK
3. Client → ACK

TCP also provides:
• Acknowledgements
• Retransmission
• Flow control
• Ordered delivery

Exam favourites:
• TCP vs UDP
• Three-way handshake
• TCP/IP 4-layer model
• IP addressing and routing`;
  }


  /* ---------- Normalization ---------- */

  if (
    /normalization|normalise|normalize|1nf|2nf|3nf|bcnf|dbms|database/.test(
      question
    )
  ) {
    return `📊 DBMS Normalization:

Normalization reduces redundancy and improves database structure.

1NF
• Atomic values
• No repeating groups

2NF
• Must be in 1NF
• No partial dependency on a composite key

3NF
• Must be in 2NF
• No transitive dependency

BCNF
• Every determinant must be a candidate key

Exam tip:
Practice decomposing one unorganized table into 1NF → 2NF → 3NF.`;
  }


  /* ---------- Operating System ---------- */

  if (
    /schedul|process scheduling|os|operating system|fcfs|sjf|round robin|priority scheduling/.test(
      question
    )
  ) {
    return `💻 Process Scheduling:

Important algorithms:

• FCFS — First Come First Serve
• SJF — Shortest Job First
• Round Robin
• Priority Scheduling
• Multilevel Queue

You should know how to calculate:

• Waiting Time
• Turnaround Time
• Average Waiting Time
• Average Turnaround Time

Exam tip:
SJF may cause starvation for long processes.

Aging can help prevent starvation.`;
  }


  /* ---------- Cloud Virtualization ---------- */

  if (
    /cloud|virtualization|virtual machine|vm/.test(
      question
    )
  ) {
    return `☁️ Cloud Virtualization:

Virtualization creates a virtual version of computing resources such as:

• Servers
• Storage
• Networks
• Operating systems

Important concepts:

• Hypervisor
• Virtual Machine
• Host OS
• Guest OS
• Type 1 Hypervisor
• Type 2 Hypervisor

Exam tip:
Type 1 hypervisors run directly on the physical hardware, while Type 2 hypervisors run on top of a host operating system.`;
  }


  /* ---------- Revision Plan ---------- */

  if (
    /revision plan|revision|study plan|plan|schedule/.test(
      question
    )
  ) {
    return `📅 3-Day Revision Plan:

DAY 1
• TCP/IP — 45 minutes
• 10-question TCP/IP drill
• 15-minute review

DAY 2
• Normalization — 40 minutes
• DBMS past-paper questions
• 15-minute AI quiz

DAY 3
• Process Scheduling — 30 minutes
• Cloud Virtualization — 20 minutes
• 15-minute AI quiz

Recommended daily study time:
60–90 minutes.

Focus on weak topics first.`;
  }


  /* ---------- Quiz ---------- */

  if (
    /quiz|test me|test|practice|question|drill/.test(
      question
    )
  ) {
    return `📝 Quick TCP/IP Quiz:

What does the server send after receiving a TCP SYN?

A) ACK
B) SYN-ACK
C) FIN
D) RST

Reply with A, B, C, or D.

I'll check your answer and explain it.`;
  }


  /* ---------- Correct Quiz Answer ---------- */

  if (
    /^(b|b\)|syn-ack|syn ack|option b)$/.test(
      question.trim()
    )
  ) {
    return `✅ Correct!

The answer is B) SYN-ACK.

The server:
1. Receives the client's SYN.
2. Sends SYN-ACK.
3. Waits for the client's final ACK.

This completes the TCP three-way handshake.`;
  }


  /* ---------- Attendance ---------- */

  if (/attendance|absent|absence/.test(question)) {
    return `📊 Your attendance is 86%.

Status: Healthy ✅

Attendance is currently not your biggest problem.

Your biggest priority is improving TCP/IP quiz accuracy, currently around 42%.

Keep attendance above 85% and focus your study time on weak topics.`;
  }


  /* ---------- Greetings ---------- */

  if (
    /^(hello|hi|hey|hai|namaste)\b/.test(
      question.trim()
    )
  ) {
    return `👋 Hey Jerone!

I'm ShieldBot, your academic study assistant.

You can ask me:

• What should I study?
• Why am I at risk?
• Explain TCP/IP
• Explain Normalization
• Explain Process Scheduling
• Create a revision plan
• Give me a quiz`;
  }


  /* ---------- Thanks ---------- */

  if (
    /thank|thanks|thank you/.test(
      question
    )
  ) {
    return `You're welcome! 🛡️

Keep your study sessions focused and consistent.

Your best next action is still:
🎯 TCP/IP — 30 minutes.`;
  }


  /* ---------- Recovery ---------- */

  if (
    /recovery|recover|simulation|simulate|minutes|readiness/.test(
      question
    )
  ) {
    return `🔮 Recovery Simulation:

30 min/day → approximately 71% readiness

60 min/day → approximately 78% readiness

90 min/day → approximately 84% readiness

120 min/day → approximately 88% readiness

Recommended:
60–90 minutes per day focused mainly on weak topics.`;
  }


  /* ---------- Default ---------- */

  return `🤖 I can help you with:

🎯 Study priorities
🛡️ Academic risk
📚 TCP/IP
📊 DBMS Normalization
💻 Operating Systems
☁️ Cloud Virtualization
📝 AI quizzes
📅 Revision plans

Try asking:

"What should I study?"

or

"Explain TCP/IP"`;
}


/* ---------- Init ---------- */

function initApp() {

  /*
   * These functions are called only if they
   * already exist in your main JavaScript.
   * This prevents ShieldBot from crashing
   * when one of them is missing.
   */

  if (typeof renderDash === "function") {
    renderDash();
  }

  if (typeof renderIntel === "function") {
    renderIntel();
  }

  if (typeof renderSim === "function") {
    renderSim();
  }

  if (typeof renderSyllabus === "function") {
    renderSyllabus();
  }

  if (typeof renderPlan === "function") {
    renderPlan();
  }

  if (typeof renderAlerts === "function") {
    renderAlerts();
  }

  if (typeof renderAch === "function") {
    renderAch();
  }

  if (typeof renderProfile === "function") {
    renderProfile();
  }

  if (
    typeof runCounters === "function" &&
    document.getElementById("view-dashboard")
  ) {
    runCounters(
      document.getElementById("view-dashboard")
    );
  }

  const readyRing =
    document.getElementById("readyRing");

  if (readyRing) {
    readyRing.style.setProperty("--p", 68);
  }
}


/* ---------- Start App ---------- */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initApp
  );

} else {

  initApp();

}

/* ---------- Init ---------- */

function initApp() {
  renderDash();
  renderIntel();
  renderSim();
  renderSyllabus();
  renderPlan();
  renderAlerts();
  renderAch();
  renderProfile();

  runCounters(
    $("#view-dashboard")
  );

  if ($("#readyRing")) {
    $("#readyRing").style.setProperty(
      "--p",
      68
    );
  }
}

/* ---------- DOM Ready ---------- */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    applyTheme();

    const themeToggle =
      $("#themeToggle");

    if (themeToggle) {
      themeToggle.onclick =
        toggleTheme;
    }

    const landingTheme =
      $("#themeToggleLanding");

    if (landingTheme) {
      landingTheme.onclick =
        toggleTheme;
    }

    $$(".s-link").forEach(button => {
      button.onclick = () => {
        go(button.dataset.view);
      };
    });

    $$(".modal-back").forEach(modal => {
      modal.addEventListener(
        "click",
        event => {
          if (event.target === modal) {
            modal.classList.remove(
              "open"
            );
          }
        }
      );
    });

    document.addEventListener(
      "keydown",
      event => {
        if (event.key === "Escape") {
          $$(".modal-back").forEach(
            modal =>
              modal.classList.remove(
                "open"
              )
          );
        }
      }
    );

    runCounters(
      $("#landing")
    );

    if (S.loggedIn) {
      $("#landing")?.classList.add(
        "hidden"
      );

      $("#app")?.classList.remove(
        "hidden"
      );

      initApp();
    }
  }
);

/* ---------- Make HTML onclick functions globally available ---------- */

window.openLogin = openLogin;
window.closeModal = closeModal;
window.handleLogin = handleLogin;
window.demoLogin = demoLogin;
window.enterApp = enterApp;
window.logout = logout;

window.go = go;
window.toggleTheme = toggleTheme;
window.openModal = openModal;
window.openRisk = openRisk;
window.analyzeFuture = analyzeFuture;

window.startFocus = startFocus;
window.runAnalysis = runAnalysis;

window.resetPlan = resetPlan;
window.newQuiz = newQuiz;

window.markAllRead = markAllRead;

window.toggleBot = toggleBot;
window.botSubmit = botSubmit;