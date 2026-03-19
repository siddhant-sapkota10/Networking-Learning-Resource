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
  "Encryption helps protect data while it travels across the internet.",
  "Firewalls can block harmful traffic before it reaches a device.",
];

const incidents = [
  {
    id: "login",
    title: "Logging into a school website",
    subtitle: "A student is entering their username and password.",
    situation:
      "The browser is sending login details to a website. This information should be protected while it travels across the internet.",
    threatLabel: "Credentials could be stolen while travelling",
    threatIcon: Eye,
    threatTone: "amber",
    recommendedDefense: "https",
    defenses: ["https", "password", "firewall", "phishing"],
    safeTitle: "Secure login",
    safeResult:
      "HTTPS encrypts the login details, so attackers cannot easily read them while they travel.",
    failTitle: "Login details at risk",
    failResult:
      "Without encryption, the login details are much more vulnerable while travelling across the internet.",
    why:
      "HTTPS is best here because the main goal is protecting data in transit.",
  },
  {
    id: "download",
    title: "Downloading a file",
    subtitle: "A device is about to receive a file from the internet.",
    situation:
      "A student clicks download. A harmful file could try to reach the device.",
    threatLabel: "Malicious traffic may reach the device",
    threatIcon: ServerCrash,
    threatTone: "rose",
    recommendedDefense: "firewall",
    defenses: ["firewall", "https", "password", "phishing"],
    safeTitle: "Threat blocked",
    safeResult:
      "The firewall helps block suspicious or harmful traffic before it reaches the device.",
    failTitle: "Unsafe download path",
    failResult:
      "The device did not use the strongest protection for blocking harmful traffic.",
    why:
      "A firewall is best here because it helps filter and block dangerous traffic.",
  },
  {
    id: "email",
    title: "Opening an email link",
    subtitle: "A message asks the student to click a link and sign in quickly.",
    situation:
      "The student receives an urgent email telling them to click a link and enter personal details.",
    threatLabel: "This could be a phishing scam",
    threatIcon: MailWarning,
    threatTone: "amber",
    recommendedDefense: "phishing",
    defenses: ["phishing", "https", "password", "firewall"],
    safeTitle: "Phishing avoided",
    safeResult:
      "The student recognised warning signs and avoided giving away personal information.",
    failTitle: "Phishing risk",
    failResult:
      "The student chose the wrong protection for this situation and may still be tricked.",
    why:
      "Phishing awareness is best here because the problem is social engineering, not just network traffic.",
  },
  {
    id: "account",
    title: "Protecting an online account",
    subtitle: "A student wants to make their account harder to break into.",
    situation:
      "An attacker may try to guess a weak password or reuse a password from another site.",
    threatLabel: "Weak passwords are easier to guess",
    threatIcon: UserRound,
    threatTone: "amber",
    recommendedDefense: "password",
    defenses: ["password", "https", "firewall", "phishing"],
    safeTitle: "Account strengthened",
    safeResult:
      "Using a strong password and extra verification makes the account much harder to break into.",
    failTitle: "Weak account protection",
    failResult:
      "The account is still more vulnerable because the best protection was not chosen.",
    why:
      "Strong passwords and MFA help protect accounts from unauthorised access.",
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
      "Encryption scrambles data so it is much harder for attackers to read.",
  },
  firewall: {
    id: "firewall",
    title: "Firewall",
    short: "Blocks harmful traffic",
    icon: Shield,
    tone: "blue",
    badge: "Filter traffic",
    explanation:
      "A firewall helps decide what traffic should be allowed or blocked.",
  },
  password: {
    id: "password",
    title: "Strong Password / MFA",
    short: "Protects account access",
    icon: ShieldCheck,
    tone: "violet",
    badge: "Secure account",
    explanation:
      "Strong passwords and MFA help stop attackers from accessing an account.",
  },
  phishing: {
    id: "phishing",
    title: "Phishing Awareness",
    short: "Avoids scams and fake links",
    icon: AlertTriangle,
    tone: "amber",
    badge: "Spot scams",
    explanation:
      "Being careful with urgent messages, strange links, and fake websites helps prevent phishing.",
  },
};

const quizQuestions = [
  {
    question: "What does HTTPS mainly help protect?",
    options: [
      "Data while it travels across the internet",
      "The size of a file",
      "The speed of the keyboard",
    ],
    answer: "Data while it travels across the internet",
  },
  {
    question: "What is a firewall used for?",
    options: [
      "Blocking or filtering harmful traffic",
      "Creating a new browser",
      "Making passwords shorter",
    ],
    answer: "Blocking or filtering harmful traffic",
  },
  {
    question: "What is phishing?",
    options: [
      "A trick to steal personal information",
      "A type of encryption",
      "A faster Wi-Fi signal",
    ],
    answer: "A trick to steal personal information",
  },
  {
    question: "Why are strong passwords important?",
    options: [
      "They make accounts harder to break into",
      "They increase monitor brightness",
      "They replace firewalls",
    ],
    answer: "They make accounts harder to break into",
  },
];

/* ===================== UI HELPERS ===================== */

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

function DefenseCard({ defense, selected, onClick }) {
  const Icon = defense.icon;
  const tones = toneClasses(defense.tone);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-3xl border p-4 text-left transition ${
        selected
          ? `${tones.soft} ring-2 ${tones.ring}`
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            selected ? "bg-white/80 ring-1 ring-black/5" : tones.icon
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{defense.title}</h3>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tones.badge}`}>
              {defense.badge}
            </span>
          </div>
          <p className="mt-1 text-sm opacity-90">{defense.short}</p>
          <p className="mt-3 text-sm leading-6 opacity-90">
            {defense.explanation}
          </p>
        </div>
      </div>
    </button>
  );
}

function IncidentCard({ incident }) {
  const ThreatIcon = incident.threatIcon;
  const threatTone =
    incident.threatTone === "rose" ? "danger" : incident.threatTone === "amber" ? "warning" : "info";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <Wifi className="h-3.5 w-3.5" />
            Live incident
          </div>
          <h3 className="mt-3 text-xl font-bold text-slate-900">
            {incident.title}
          </h3>
          <p className="mt-1 text-slate-600">{incident.subtitle}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          Choose the best defense
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Situation
          </p>
          <p className="mt-2 leading-7 text-slate-700">{incident.situation}</p>
        </div>

        <StatusBox
          title="Threat detected"
          body={incident.threatLabel}
          tone={threatTone}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <ThreatIcon className="h-5 w-5 text-slate-700" />
        <p className="text-sm leading-6 text-slate-700">
          Your job is to choose the strongest protection for this exact situation.
        </p>
      </div>
    </div>
  );
}

function ActivityCanvas({
  incident,
  phase,
  selectedDefense,
  isCorrect,
  roundsCompleted,
}) {
  const defense = defenseMap[selectedDefense];
  const DefenseIcon = defense.icon;
  const ThreatIcon = incident.threatIcon;

  const showThreat = phase === "analyse" || phase === "resolved";
  const showDefense = phase === "deploy" || phase === "resolved";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Security Control Room
          </h3>
          <p className="text-sm text-slate-500">
            Analyse the situation, deploy a defense, and see the outcome.
          </p>
        </div>

        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Incidents solved: {roundsCompleted}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid items-center gap-4 lg:grid-cols-[160px_minmax(0,1fr)_160px]">
          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-center">
            <Globe className="mx-auto h-7 w-7 text-blue-700" />
            <p className="mt-2 font-semibold text-blue-900">Student Device</p>
            <p className="mt-1 text-xs text-blue-700">Needs protection</p>
          </div>

          <div className="relative h-40 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="absolute left-6 right-6 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />

            <div className="absolute left-6 top-6">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Threat path
              </div>
            </div>

            {showThreat && (
              <motion.div
                initial={{ left: "10%", opacity: 0 }}
                animate={{
                  left: phase === "resolved" && isCorrect ? "18%" : "46%",
                  opacity: 1,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2"
              >
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ThreatIcon className="h-4 w-4 text-rose-700" />
                    <span className="text-xs font-bold text-rose-800">
                      THREAT
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {showDefense && selectedDefense === "firewall" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 shadow-sm">
                  <Shield className="h-7 w-7 text-blue-700" />
                </div>
              </motion.div>
            )}

            {showDefense && selectedDefense === "https" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
                  <Lock className="h-7 w-7 text-emerald-700" />
                </div>
              </motion.div>
            )}

            {showDefense && selectedDefense === "password" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 shadow-sm">
                  <ShieldCheck className="h-7 w-7 text-violet-700" />
                </div>
              </motion.div>
            )}

            {showDefense && selectedDefense === "phishing" && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 shadow-sm">
                  <AlertTriangle className="h-7 w-7 text-amber-700" />
                </div>
              </motion.div>
            )}

            {phase === "resolved" && isCorrect && (
              <motion.div
                initial={{ right: "12%", opacity: 0 }}
                animate={{ right: "16%", opacity: 1 }}
                className="absolute top-1/2 -translate-y-1/2"
              >
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <DefenseIcon className="h-4 w-4 text-emerald-700" />
                    <span className="text-xs font-bold text-emerald-800">
                      DEFENSE SUCCESS
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === "resolved" && !isCorrect && (
              <motion.div
                initial={{ right: "12%", opacity: 0 }}
                animate={{ right: "16%", opacity: 1 }}
                className="absolute top-1/2 -translate-y-1/2"
              >
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-rose-700" />
                    <span className="text-xs font-bold text-rose-800">
                      WRONG DEFENSE
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <ShieldCheck className="mx-auto h-7 w-7 text-emerald-700" />
            <p className="mt-2 font-semibold text-emerald-900">Security Team</p>
            <p className="mt-1 text-xs text-emerald-700">
              Deploying the chosen defense
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizOption({ option, isSelected, isCorrect, submitted, onClick }) {
  let styles = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  if (submitted) {
    if (isCorrect) styles = "border-emerald-300 bg-emerald-50 text-emerald-800";
    else if (isSelected) styles = "border-rose-300 bg-rose-50 text-rose-800";
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
    "Read the incident and choose the strongest defense for the situation."
  );
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const incident = incidents[incidentIndex];
  const isCorrect = selectedDefense === incident.recommendedDefense;

  useEffect(() => {
    setSelectedDefense(incident.defenses[0]);
    setPhase("analyse");
    setMessage(
      "Read the incident and choose the strongest defense for the situation."
    );
  }, [incidentIndex]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers]);

  const orderedDefenses = incident.defenses.map((id) => defenseMap[id]);

  const stepLabels = ["Analyse Incident", "Deploy Defense", "Review Outcome"];

  const activeStep =
    phase === "analyse" ? 0 : phase === "deploy" ? 1 : 2;

  const statusTone =
    phase === "resolved"
      ? isCorrect
        ? "success"
        : "danger"
      : phase === "deploy"
      ? "info"
      : "neutral";

  const statusTitle =
    phase === "analyse"
      ? "Step 1: Analyse the incident"
      : phase === "deploy"
      ? "Step 2: Deploy your chosen defense"
      : isCorrect
      ? "Step 3: Correct defense selected"
      : "Step 3: Review the result";

  const runSimulation = () => {
    setPhase("deploy");
    setMessage(
      `The security team is deploying ${defenseMap[selectedDefense].title}.`
    );

    setTimeout(() => {
      setPhase("resolved");
      setRoundsCompleted((prev) => prev + (isCorrect ? 1 : 0));
      setMessage(
        isCorrect
          ? incident.safeResult
          : incident.failResult
      );
    }, 1200);
  };

  const nextIncident = () => {
    setIncidentIndex((prev) => (prev + 1) % incidents.length);
  };

  const resetActivity = () => {
    setIncidentIndex(0);
    setSelectedDefense(incidents[0].defenses[0]);
    setPhase("analyse");
    setRoundsCompleted(0);
    setMessage(
      "Read the incident and choose the strongest defense for the situation."
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 5
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            Internet Security
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Learn how different online threats are stopped using the right type of
            protection, such as HTTPS, firewalls, strong passwords, and phishing awareness.
          </p>
        </header>

        <Section title="What is Internet Security?" icon={HelpCircle}>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="leading-7 text-slate-700">
                Internet security is about keeping information, devices, and people
                safe online. Different online situations create different risks, so
                the best protection depends on the type of threat.
              </p>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Real-life analogy
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  Think of internet security like protecting a school. Locks help
                  protect rooms, fences help block intruders, ID checks help stop
                  the wrong people entering, and training helps students avoid scams.
                  Online security works in a similar way.
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

        <Section title="Interactive Security Control Room" icon={ShieldCheck}>
          <p className="mb-5 leading-7 text-slate-700">
            Each incident has a different online risk. Your job is to inspect the situation,
            choose the strongest defense, and see what happens.
          </p>

          <div className="mb-5 flex flex-wrap gap-2">
            {stepLabels.map((label, index) => (
              <StepChip
                key={label}
                label={label}
                active={activeStep === index}
                complete={activeStep > index}
              />
            ))}
          </div>

          <StatusBox title={statusTitle} body={message} tone={statusTone} />

          <div className="mt-6 space-y-6">
            <IncidentCard incident={incident} />

            <div className="grid gap-4 md:grid-cols-2">
              {orderedDefenses.map((defense) => (
                <DefenseCard
                  key={defense.id}
                  defense={defense}
                  selected={selectedDefense === defense.id}
                  onClick={() => {
                    if (phase === "analyse") {
                      setSelectedDefense(defense.id);
                    }
                  }}
                />
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
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
                className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
              >
                Reset Activity
              </button>
            </div>

            <ActivityCanvas
              incident={incident}
              phase={phase}
              selectedDefense={selectedDefense}
              isCorrect={isCorrect}
              roundsCompleted={roundsCompleted}
            />

            {phase === "resolved" && (
              <div className="grid gap-3 md:grid-cols-2">
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
            )}

            {phase === "resolved" && (
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={nextIncident}
                  className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                >
                  Next Incident
                </button>

                <button
                  type="button"
                  onClick={resetActivity}
                  className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                >
                  Start Again
                </button>
              </div>
            )}
          </div>
        </Section>

        <Section title="Quick Quiz" icon={HelpCircle}>
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
              className="rounded-2xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800"
            >
              Submit Quiz
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmittedQuiz(false);
                setSelectedAnswers({});
              }}
              className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 hover:bg-slate-50"
            >
              Reset Quiz
            </button>
          </div>

          {submittedQuiz && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Your Score: {score} / {quizQuestions.length}
              </h3>

              <p className="mt-2 text-slate-600">
                {score === 4
                  ? "Excellent work — you understand how different online threats need different types of protection."
                  : score >= 2
                  ? "Good work — review encryption, firewalls, phishing, and strong passwords one more time."
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
                Online threats include phishing, harmful traffic, weak passwords, and stolen data.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Encryption</h3>
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
                Good online security also depends on strong passwords and recognising scams.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}