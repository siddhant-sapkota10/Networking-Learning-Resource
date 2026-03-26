import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Eye,
  Globe,
  HelpCircle,
  Lock,
  MailWarning,
  RefreshCcw,
  ServerCrash,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  Wifi,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ===================== DATA ===================== */

const keyIdeas = [
  "Internet security protects data, devices, and people online.",
  "Different online risks need different types of protection.",
  "HTTPS protects data while it travels across the internet.",
  "Firewalls can block harmful traffic before it reaches a device.",
];

const incidents = [
  {
    id: "login",
    title: "Logging into a school website",
    subtitle: "A student is entering their username and password.",
    situation:
      "A student is signing in to a school website. Their login details are travelling across the internet and need protection while they move between the browser and the server.",
    threatLabel: "Credentials could be stolen while travelling",
    threatIcon: Eye,
    threatTone: "amber",
    recommendedDefense: "https",
    defenses: ["https", "password", "firewall", "phishing"],
    safeTitle: "Secure login",
    safeResult:
      "HTTPS encrypts the login details, making them much harder for attackers to read while they travel across the internet.",
    failTitle: "Login details at risk",
    failResult:
      "The strongest protection was not chosen. The login details are still more vulnerable while travelling.",
    why:
      "HTTPS is best here because the main risk is data being exposed while it travels across the internet.",
  },
  {
    id: "download",
    title: "Downloading a file",
    subtitle: "A device is about to receive a file from the internet.",
    situation:
      "A student clicks download. Harmful traffic or an unsafe file could try to reach the device through the network.",
    threatLabel: "Malicious traffic may reach the device",
    threatIcon: ServerCrash,
    threatTone: "rose",
    recommendedDefense: "firewall",
    defenses: ["firewall", "https", "password", "phishing"],
    safeTitle: "Threat blocked",
    safeResult:
      "The firewall helps filter and block suspicious or harmful traffic before it reaches the device.",
    failTitle: "Unsafe download path",
    failResult:
      "The strongest protection was not chosen. The device is still more exposed to harmful traffic.",
    why:
      "A firewall is best here because the main goal is blocking harmful traffic before it reaches the device.",
  },
  {
    id: "email",
    title: "Opening an email link",
    subtitle: "A message asks the student to click a link and sign in quickly.",
    situation:
      "A student receives an urgent email asking them to click a link and enter personal details. The message could be trying to trick them.",
    threatLabel: "This could be a phishing scam",
    threatIcon: MailWarning,
    threatTone: "amber",
    recommendedDefense: "phishing",
    defenses: ["phishing", "https", "password", "firewall"],
    safeTitle: "Phishing avoided",
    safeResult:
      "The student recognised the warning signs and avoided giving away personal information.",
    failTitle: "Phishing risk",
    failResult:
      "The strongest protection was not chosen. The student could still be tricked into giving away information.",
    why:
      "Phishing awareness is best here because the main problem is a scam designed to trick the user.",
  },
  {
    id: "account",
    title: "Protecting an online account",
    subtitle: "A student wants to make their account harder to break into.",
    situation:
      "An attacker may try to guess a weak password or reuse a password from another website to get into the account.",
    threatLabel: "Weak passwords are easier to guess",
    threatIcon: UserRound,
    threatTone: "amber",
    recommendedDefense: "password",
    defenses: ["password", "https", "firewall", "phishing"],
    safeTitle: "Account strengthened",
    safeResult:
      "A strong password and MFA make the account much harder for attackers to access.",
    failTitle: "Weak account protection",
    failResult:
      "The strongest protection was not chosen. The account is still easier to break into.",
    why:
      "Strong passwords and MFA are best here because the main goal is stopping unauthorised access to the account.",
  },
];

const defenseMap = {
  https: {
    id: "https",
    title: "HTTPS / Encryption",
    short: "Protects data while it travels",
    icon: Lock,
    tone: "emerald",
    badge: "Encrypt data",
    explanation:
      "Protects information while it moves across the internet.",
  },
  firewall: {
    id: "firewall",
    title: "Firewall",
    short: "Blocks harmful traffic",
    icon: Shield,
    tone: "blue",
    badge: "Filter traffic",
    explanation:
      "Filters unsafe traffic before it reaches a device.",
  },
  password: {
    id: "password",
    title: "Strong Password / MFA",
    short: "Protects account access",
    icon: ShieldCheck,
    tone: "violet",
    badge: "Secure account",
    explanation:
      "Makes it much harder for attackers to access an account.",
  },
  phishing: {
    id: "phishing",
    title: "Phishing Awareness",
    short: "Avoids scams and fake links",
    icon: AlertTriangle,
    tone: "amber",
    badge: "Spot scams",
    explanation:
      "Helps users recognise scam messages and fake websites.",
  },
};

const baseQuizQuestions = [
  {
    question:
      "A student is logging into a school website and their username and password are travelling across the internet. Which protection best fits that exact risk?",
    options: [
      "HTTPS, because it helps protect data while it is travelling",
      "Firewall, because it mainly makes passwords longer",
      "Phishing awareness, because every login page is a scam",
      "Strong passwords only, because travel across the internet does not matter",
    ],
    answer: "HTTPS, because it helps protect data while it is travelling",
  },
  {
    question:
      "A device is downloading something from the internet and the main concern is harmful traffic reaching the device. Which defense is the best match?",
    options: [
      "Firewall, because it can filter or block suspicious traffic before it reaches the device",
      "HTTPS, because it replaces all other security protections",
      "Phishing awareness, because downloads are always email scams",
      "Strong passwords, because they directly scan files during download",
    ],
    answer:
      "Firewall, because it can filter or block suspicious traffic before it reaches the device",
  },
  {
    question:
      "A message tells a student to click a link urgently and enter personal details. What is the most accurate description of the main risk?",
    options: [
      "It could be phishing, which tries to trick the user into giving away information",
      "It is mainly a password length problem",
      "It is a firewall problem only",
      "It means HTTPS has stopped working forever",
    ],
    answer:
      "It could be phishing, which tries to trick the user into giving away information",
  },
  {
    question:
      "Why are strong passwords and MFA the best protection in the account-security incident?",
    options: [
      "Because the main goal is making the account harder for an attacker to access",
      "Because they block harmful traffic before it reaches the network",
      "Because they encrypt every website on the internet automatically",
      "Because they turn phishing emails into safe emails",
    ],
    answer:
      "Because the main goal is making the account harder for an attacker to access",
  },
  {
    question:
      "A student says, “Internet security just means using one tool for everything.” Which response best matches this module?",
    options: [
      "Different threats need different protections, so the best defense depends on the situation",
      "That is correct, because HTTPS solves every online risk by itself",
      "That is correct, because firewalls and phishing awareness are the same thing",
      "That is correct, because passwords replace every other type of protection",
    ],
    answer:
      "Different threats need different protections, so the best defense depends on the situation",
  },
  {
    question:
      "Which statement best explains the difference between HTTPS and a firewall?",
    options: [
      "HTTPS mainly protects data while it travels, while a firewall mainly filters harmful traffic",
      "HTTPS and firewalls are identical, just with different names",
      "HTTPS protects only passwords, while a firewall protects only emails",
      "A firewall encrypts data in transit, while HTTPS mainly guesses passwords",
    ],
    answer:
      "HTTPS mainly protects data while it travels, while a firewall mainly filters harmful traffic",
  },
  {
    question:
      "Which sequence best matches the logic of the interactive activity?",
    options: [
      "Read the situation, choose the defense, deploy it, then review the outcome",
      "Deploy the defense first, then guess the threat afterward",
      "Read the outcome first, then the situation chooses the defense",
      "Choose a defense, skip the situation, and the result is always the same",
    ],
    answer:
      "Read the situation, choose the defense, deploy it, then review the outcome",
  },
  {
    question:
      "A student chooses phishing awareness for a weak-password problem. Why is that not the strongest answer?",
    options: [
      "Because phishing awareness helps spot scams, but it does not directly make the account harder to break into",
      "Because phishing awareness only works when a firewall is turned off",
      "Because phishing awareness is the same as encryption, so it is too strong",
      "Because weak passwords can only be fixed by HTTPS",
    ],
    answer:
      "Because phishing awareness helps spot scams, but it does not directly make the account harder to break into",
  },
];

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildShuffledQuiz(questions) {
  return questions.map((q) => ({
    ...q,
    options: shuffleArray(q.options),
  }));
}

/* ===================== HELPERS ===================== */

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatusBox({ title, body, tone = "neutral" }) {
  const styles =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 opacity-90">{body}</p>
    </div>
  );
}

function StepChip({ label, active, complete }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-slate-900 text-white"
          : complete
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {label}
    </div>
  );
}

function toneClasses(tone) {
  if (tone === "emerald") {
    return {
      soft: "border-emerald-200 bg-emerald-50 text-emerald-800",
      icon: "bg-emerald-100 text-emerald-700",
      ring: "ring-emerald-100",
      badge: "bg-emerald-100 text-emerald-700",
    };
  }
  if (tone === "blue") {
    return {
      soft: "border-blue-200 bg-blue-50 text-blue-800",
      icon: "bg-blue-100 text-blue-700",
      ring: "ring-blue-100",
      badge: "bg-blue-100 text-blue-700",
    };
  }
  if (tone === "violet") {
    return {
      soft: "border-violet-200 bg-violet-50 text-violet-800",
      icon: "bg-violet-100 text-violet-700",
      ring: "ring-violet-100",
      badge: "bg-violet-100 text-violet-700",
    };
  }
  if (tone === "amber") {
    return {
      soft: "border-amber-200 bg-amber-50 text-amber-800",
      icon: "bg-amber-100 text-amber-700",
      ring: "ring-amber-100",
      badge: "bg-amber-100 text-amber-700",
    };
  }
  if (tone === "rose") {
    return {
      soft: "border-rose-200 bg-rose-50 text-rose-800",
      icon: "bg-rose-100 text-rose-700",
      ring: "ring-rose-100",
      badge: "bg-rose-100 text-rose-700",
    };
  }
  return {
    soft: "border-slate-200 bg-slate-50 text-slate-700",
    icon: "bg-slate-100 text-slate-700",
    ring: "ring-slate-100",
    badge: "bg-slate-100 text-slate-700",
  };
}

function CompactDefenseCard({ defense, selected, disabled, onClick }) {
  const Icon = defense.icon;
  const tones = toneClasses(defense.tone);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition ${
        selected
          ? `${tones.soft} ring-2 ${tones.ring}`
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-80" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            selected ? "bg-white/80 ring-1 ring-black/5" : tones.icon
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{defense.title}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tones.badge}`}
            >
              {defense.badge}
            </span>
          </div>
          <p className="mt-1 text-sm">{defense.short}</p>
          <p className="mt-3 text-sm leading-6 opacity-90">
            {defense.explanation}
          </p>
        </div>
      </div>
    </button>
  );
}

function IncidentWorkspaceBar({ incident }) {
  const ThreatIcon = incident.threatIcon;
  const threatTone =
    incident.threatTone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <Wifi className="h-3.5 w-3.5" />
          Live incident
        </div>
        <h3 className="text-xl font-bold text-slate-900">{incident.title}</h3>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.45fr_0.55fr]">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-sm leading-6 text-slate-700">
            <span className="font-semibold text-slate-900">Situation: </span>
            {incident.situation}
          </p>
        </div>

        <div className={`rounded-2xl border px-4 py-3 ${threatTone}`}>
          <div className="flex items-start gap-2">
            <ThreatIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Threat detected</p>
              <p className="mt-1 text-sm leading-6 opacity-90">
                {incident.threatLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySimulation({
  incident,
  phase,
  selectedDefense,
  isCorrect,
  roundsCompleted,
}) {
  const defense = defenseMap[selectedDefense];
  const ThreatIcon = incident.threatIcon;
  const DefenseIcon = defense.icon;
  const defenseTones = toneClasses(defense.tone);

  const threatColor =
    incident.threatTone === "rose"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Security Simulation
          </h3>
          <p className="text-sm text-slate-500">
            Watch what happens when the defense is deployed.
          </p>
        </div>

        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
          Incidents solved: {roundsCompleted}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="grid items-center gap-3 md:grid-cols-[110px_minmax(0,1fr)_110px]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-center">
            <Globe className="mx-auto h-7 w-7 text-blue-700" />
            <p className="mt-2 font-semibold text-blue-900">Student</p>
            <p className="mt-1 text-xs text-blue-700">Needs protection</p>
          </div>

          <div className="relative h-56 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <div className="absolute left-4 right-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />
            <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              Threat path
            </div>

            {(phase === "analyse" || phase === "deploy") && (
              <motion.div
                key={`threat-${phase}`}
                initial={{ left: "12%", opacity: 0 }}
                animate={{
                  left: phase === "analyse" ? "24%" : "50%",
                  opacity: 1,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2"
              >
                <div
                  className={`rounded-2xl border px-4 py-3 shadow-sm ${threatColor}`}
                >
                  <div className="flex items-center gap-2">
                    <ThreatIcon className="h-4 w-4" />
                    <span className="text-xs font-bold">THREAT</span>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "deploy" && (
              <motion.div
                initial={{ scale: 0.88, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.18, duration: 0.35 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm ${defenseTones.soft}`}
                >
                  <DefenseIcon className="h-9 w-9" />
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {phase === "resolved" && (
                <motion.div
                  key={isCorrect ? "success" : "fail"}
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 flex items-center justify-center p-4"
                >
                  <div
                    className={`w-full max-w-sm rounded-3xl border p-5 text-center shadow-sm ${
                      isCorrect
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-800"
                    }`}
                  >
                    <div
                      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                        isCorrect ? "bg-emerald-100" : "bg-rose-100"
                      }`}
                    >
                      {isCorrect ? (
                        <ShieldCheck className="h-8 w-8" />
                      ) : (
                        <ShieldAlert className="h-8 w-8" />
                      )}
                    </div>

                    <h4 className="mt-4 text-lg font-bold">
                      {isCorrect ? "Defense Success" : "Wrong Defense"}
                    </h4>

                    <p className="mt-2 text-sm leading-6 opacity-90">
                      {isCorrect
                        ? "The strongest protection was chosen."
                        : "A different type of protection would work better."}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-semibold ring-1 ring-black/5">
                      <DefenseIcon className="h-4 w-4" />
                      {defense.title}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-emerald-700" />
            <p className="mt-2 font-semibold text-emerald-900">Security</p>
            <p className="mt-1 text-xs text-emerald-700">Deploying defense</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizOption({ option, isSelected, isCorrect, submitted, onClick }) {
  let styles = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  if (submitted) {
    if (isCorrect) {
      styles = "border-emerald-300 bg-emerald-50 text-emerald-800";
    } else if (isSelected) {
      styles = "border-rose-300 bg-rose-50 text-rose-800";
    }
  } else if (isSelected) {
    styles = "border-slate-900 bg-slate-900 text-white";
  }

  return (
    <button
      type="button"
      disabled={submitted}
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left transition ${styles}`}
    >
      {option}
    </button>
  );
}

/* ===================== MAIN ===================== */

export default function Security() {
  const [incidentIndex, setIncidentIndex] = useState(0);
  const [selectedDefense, setSelectedDefense] = useState(
    incidents[0].defenses[0]
  );
  const [phase, setPhase] = useState("analyse");
  const [message, setMessage] = useState(
    "Choose a defense on the left, then deploy it and watch the result on the right."
  );
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const incident = incidents[incidentIndex];
  const isCorrect = selectedDefense === incident.recommendedDefense;
  const orderedDefenses = incident.defenses.map((id) => defenseMap[id]);

  const totalIncidents = incidents.length;
  const isLastIncident = incidentIndex === totalIncidents - 1;
  const activityComplete = phase === "resolved" && isLastIncident && isCorrect;

  useEffect(() => {
    setSelectedDefense(incident.defenses[0]);
    setPhase("analyse");
    setMessage(
      "Choose a defense on the left, then deploy it and watch the result on the right."
    );
  }, [incidentIndex, incident.defenses]);

  useEffect(() => {
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  }, []);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers, quizQuestions]);

  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((_, index) => typeof selectedAnswers[index] === "string");

  const stepLabels = ["Read Incident", "Choose Defense", "Review Outcome"];
  const activeStep = phase === "analyse" ? 1 : phase === "deploy" ? 1 : 2;

  const statusTone =
    phase === "resolved"
      ? isCorrect
        ? "success"
        : "danger"
      : phase === "deploy"
      ? "info"
      : "neutral";

  const statusTitle = activityComplete
    ? "Completed"
    : phase === "analyse"
    ? "Ready to begin"
    : phase === "deploy"
    ? "Deploying defense"
    : isCorrect
    ? "Correct defense selected"
    : "Review the result";

  const runSimulation = () => {
    if (phase !== "analyse") return;

    setPhase("deploy");
    setMessage(
      `Deploying ${defenseMap[selectedDefense].title}. Watch the simulation on the right.`
    );

    setTimeout(() => {
      setPhase("resolved");

      if (isCorrect) {
        setRoundsCompleted((prev) => prev + 1);
      }

      if (isLastIncident && isCorrect) {
        setMessage(
          "Congratulations. You successfully chose the correct defense for all situations."
        );
      } else if (isLastIncident && !isCorrect) {
        setMessage(
          "You reached the final situation, but the last defense was not the strongest choice. Press Start Again to try for a perfect result."
        );
      } else {
        setMessage(isCorrect ? incident.safeResult : incident.failResult);
      }
    }, 1300);
  };

  const nextIncident = () => {
    setIncidentIndex((prev) => prev + 1);
  };

  const resetActivity = () => {
    setIncidentIndex(0);
    setSelectedDefense(incidents[0].defenses[0]);
    setPhase("analyse");
    setRoundsCompleted(0);
    setMessage(
      "Choose a defense on the left, then deploy it and watch the result on the right."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 5
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            Internet Security
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Learn how different online threats are stopped using the right type
            of protection, such as HTTPS, firewalls, strong passwords, and
            phishing awareness.
          </p>
        </header>

        <Section title="What is Internet Security?" icon={HelpCircle}>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="leading-7 text-slate-700">
                Internet security is about keeping information, devices, and
                people safe online. Different online situations create
                different risks, so the best protection depends on the type of
                threat.
              </p>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Real-life analogy
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  Think of protecting a school. Locks help protect rooms,
                  fences help block intruders, ID checks help stop the wrong
                  people entering, and training helps students avoid scams.
                  Internet security works in a similar way.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Key ideas to remember
              </h3>
              <div className="mt-3 grid gap-2">
                {keyIdeas.map((idea) => (
                  <div
                    key={idea}
                    className="flex items-start gap-2 rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-700" />
                    <p className="text-sm leading-6 text-slate-700">{idea}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Interactive Security Challenge" icon={ShieldCheck}>
          <p className="mb-4 leading-7 text-slate-700">
            Read the incident, choose a defense, deploy it, and review the result.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {stepLabels.map((label, index) => (
              <StepChip
                key={label}
                label={label}
                active={index === activeStep}
                complete={index < activeStep}
              />
            ))}
          </div>

          <StatusBox title={statusTitle} body={message} tone={statusTone} />

          <div className="mt-5 space-y-5">
            <IncidentWorkspaceBar incident={incident} />

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Choose a defense
                  </h3>
                  <p className="text-sm text-slate-500">
                    Pick the strongest protection for this exact situation.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  {orderedDefenses.map((defense) => (
                    <CompactDefenseCard
                      key={defense.id}
                      defense={defense}
                      selected={selectedDefense === defense.id}
                      disabled={phase !== "analyse"}
                      onClick={() => setSelectedDefense(defense.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="space-y-3">
                  <SecuritySimulation
                    incident={incident}
                    phase={phase}
                    selectedDefense={selectedDefense}
                    isCorrect={isCorrect}
                    roundsCompleted={roundsCompleted}
                  />

                  {!activityComplete &&
                    (phase === "resolved" ? (
                      <div className="grid gap-3">
                        <StatusBox
                          title={isCorrect ? incident.safeTitle : incident.failTitle}
                          body={isCorrect ? incident.safeResult : incident.failResult}
                          tone={isCorrect ? "success" : "danger"}
                        />

                        <StatusBox
                          title="Why this is the best answer"
                          body={incident.why}
                          tone="info"
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        Choose a defense on the left, then press deploy to watch
                        the result here.
                      </div>
                    ))}

                  {!activityComplete && (
                    <div className="flex flex-wrap gap-3">
                      {phase === "resolved" ? (
                        <>
                          {!isLastIncident && (
                            <button
                              type="button"
                              onClick={nextIncident}
                              className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                            >
                              Next Incident
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={resetActivity}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Start Again
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={runSimulation}
                            disabled={phase !== "analyse"}
                            className={`rounded-2xl px-5 py-2 font-medium text-white transition ${
                              phase !== "analyse"
                                ? "cursor-not-allowed bg-slate-400"
                                : "bg-slate-900 hover:bg-slate-800"
                            }`}
                          >
                            Deploy Defense
                          </button>

                          <button
                            type="button"
                            onClick={resetActivity}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Reset Activity
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {activityComplete && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-slate-900/45 p-4 backdrop-blur-[2px]"
                    >
                      <motion.div
                        initial={{ scale: 0.96, y: 8, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl"
                      >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                          <ShieldCheck className="h-8 w-8 text-emerald-700" />
                        </div>

                        <h3 className="mt-4 text-2xl font-bold text-slate-900">
                          Congratulations!
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          You successfully chose the correct defense for all
                          situations.
                        </p>

                        <div className="mt-5">
                          <button
                            type="button"
                            onClick={resetActivity}
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-800"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Play Again
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Quick Quiz" icon={HelpCircle}>
          <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm leading-6 text-slate-700">
              These questions are harder to guess because the incorrect answers sound more believable. Users need to understand which protection matches which threat.
            </p>
          </div>

          <div className="space-y-5">
            {quizQuestions.map((q, i) => (
              <div
                key={q.question}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="font-semibold text-slate-900">
                  {i + 1}. {q.question}
                </h3>

                <div className="mt-4 grid gap-3">
                  {q.options.map((option) => (
                    <QuizOption
                      key={option}
                      option={option}
                      isSelected={selectedAnswers[i] === option}
                      isCorrect={q.answer === option}
                      submitted={submittedQuiz}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [i]: option,
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setSubmittedQuiz(true)}
              disabled={!allAnswered}
              className="rounded-2xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Quiz
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmittedQuiz(false);
                setSelectedAnswers({});
                setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
              }}
              className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-50"
            >
              Reset Quiz
            </button>
          </div>

          {!allAnswered && !submittedQuiz && (
            <p className="mt-3 text-sm text-slate-500">
              Answer every question before submitting.
            </p>
          )}

          {submittedQuiz && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Your Score: {score} / {quizQuestions.length}
              </h3>

              <p className="mt-2 text-slate-600">
                {score === quizQuestions.length
                  ? "Excellent work — you understand how different online threats need different types of protection."
                  : score >= 6
                  ? "Good work — you understand most of the protections, but review HTTPS, firewalls, phishing, and strong passwords one more time."
                  : score >= 4
                  ? "Decent effort — revisit the activity and pay attention to why each situation needs a different defense."
                  : "Review the module and try the quiz again."}
              </p>
            </div>
          )}
        </Section>

        <Section title="Summary" icon={CheckCircle2}>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Threats</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Internet threats include phishing, harmful traffic, weak
                passwords, and stolen data.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">HTTPS</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                HTTPS helps protect data while it travels across the internet.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Firewalls</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Firewalls help filter and block suspicious or harmful traffic.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Smart Choices</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Good internet security also depends on strong passwords and
                recognising scams.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}