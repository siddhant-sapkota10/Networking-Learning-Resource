import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Globe,
  HelpCircle,
  Network,
  RefreshCcw,
  Search,
  Server,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const quizQuestions = [
  {
    question: "What does DNS stand for?",
    options: [
      "Domain Name System",
      "Data Network Service",
      "Digital Number Server",
    ],
    answer: "Domain Name System",
  },
  {
    question: "What does DNS do?",
    options: [
      "It matches a website name to an IP address",
      "It increases Wi-Fi speed",
      "It stores videos on your device",
    ],
    answer: "It matches a website name to an IP address",
  },
  {
    question: "Why is DNS useful?",
    options: [
      "People can remember names more easily than numbers",
      "It makes the screen brighter",
      "It removes all internet cables",
    ],
    answer: "People can remember names more easily than numbers",
  },
  {
    question: "Without DNS, what would users need to do?",
    options: [
      "Remember IP addresses for websites",
      "Build their own router",
      "Restart the internet each time",
    ],
    answer: "Remember IP addresses for websites",
  },
];

const keyIdeas = [
  "DNS stands for Domain Name System.",
  "DNS translates website names into IP addresses.",
  "People remember names more easily than long numbers.",
  "DNS helps your device find the correct web server.",
];

const lookupSets = [
  {
    domain: "youtube.com",
    ip: "142.250.70.206",
    serverName: "Video Server",
    wrongAnswers: [
      "It makes the website download faster",
      "It stores the whole website on your device",
    ],
  },
  {
    domain: "google.com",
    ip: "142.250.66.14",
    serverName: "Search Server",
    wrongAnswers: [
      "It turns the internet off and on",
      "It removes the need for servers",
    ],
  },
  {
    domain: "netflix.com",
    ip: "52.89.124.203",
    serverName: "Streaming Server",
    wrongAnswers: [
      "It plays the video before the server is found",
      "It changes the website name into Wi-Fi",
    ],
  },
  {
    domain: "sec.act.edu.au",
    ip: "203.18.40.12",
    serverName: "School Server",
    wrongAnswers: [
      "It saves the website into the browser forever",
      "It replaces the web server",
    ],
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
      : tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 opacity-90">{body}</p>
    </div>
  );
}

function BrowserBar({ domain, onSearch, disabled }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center gap-2 px-1">
        <span className="h-3 w-3 rounded-full bg-rose-300" />
        <span className="h-3 w-3 rounded-full bg-amber-300" />
        <span className="h-3 w-3 rounded-full bg-emerald-300" />
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex min-h-[56px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="font-medium text-slate-800">
            {domain || "Choose a website below"}
          </span>
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={disabled}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-white transition ${
            disabled
              ? "cursor-not-allowed bg-slate-400"
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <Search className="h-4 w-4" />
          Ask DNS
        </button>
      </div>
    </div>
  );
}

function DomainButton({ domain, active, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        <span className="font-medium">{domain}</span>
      </div>
    </button>
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

function LookupStageCard({
  title,
  subtitle,
  icon: Icon,
  tone = "neutral",
  active = false,
}) {
  const tones =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-800"
      : tone === "emerald"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-white text-slate-700";

  return (
    <div
      className={`rounded-3xl border p-4 shadow-sm transition ${
        active ? "ring-2 ring-slate-200" : ""
      } ${tones}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 ring-1 ring-black/5">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm leading-6 opacity-90">{subtitle}</p>
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

function MeaningOption({
  option,
  selected,
  correct,
  submitted,
  onClick,
  disabled,
}) {
  let styles = "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  if (submitted) {
    if (correct) styles = "border-emerald-300 bg-emerald-50 text-emerald-800";
    else if (selected) styles = "border-rose-300 bg-rose-50 text-rose-800";
  } else if (selected) {
    styles = "border-slate-900 bg-slate-900 text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border p-4 text-left transition ${styles}`}
    >
      <p className="font-medium leading-6">{option}</p>
    </button>
  );
}

export default function DNS() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const [selectedSiteIndex, setSelectedSiteIndex] = useState(0);
  const [lookupPhase, setLookupPhase] = useState("choose");
  const [lookupMessage, setLookupMessage] = useState(
    "Choose a website name. DNS will help translate it into the correct IP address."
  );
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const [meaningChoices, setMeaningChoices] = useState([]);
  const [selectedMeaning, setSelectedMeaning] = useState("");
  const [meaningSubmitted, setMeaningSubmitted] = useState(false);
  const [meaningCorrect, setMeaningCorrect] = useState(false);

  const currentSite = lookupSets[selectedSiteIndex];

  useEffect(() => {
    setMeaningChoices(
      shuffleArray([
        "It matches the website name to the correct IP address",
        ...currentSite.wrongAnswers,
      ])
    );
    setSelectedMeaning("");
    setMeaningSubmitted(false);
    setMeaningCorrect(false);
    setLookupPhase("choose");
    setLookupMessage(
      "Choose a website name. DNS will help translate it into the correct IP address."
    );
  }, [selectedSiteIndex]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers]);

  const stepLabels = ["Choose Name", "Lookup", "Reveal IP", "Connect"];
  const activeStep =
    lookupPhase === "choose"
      ? 0
      : lookupPhase === "lookup"
      ? 1
      : lookupPhase === "revealed"
      ? 2
      : 3;

  const statusTone =
    lookupPhase === "connected"
      ? "success"
      : meaningSubmitted && !meaningCorrect
      ? "warning"
      : lookupPhase === "lookup" || lookupPhase === "revealed"
      ? "info"
      : "neutral";

  const statusTitle =
    lookupPhase === "choose"
      ? "Step 1: Choose a website name"
      : lookupPhase === "lookup"
      ? "Step 2: DNS lookup started"
      : lookupPhase === "revealed"
      ? "Step 3: DNS reveals the IP address"
      : "Step 4: Connected to the correct server";

  const handleStartLookup = () => {
    setLookupPhase("lookup");
    setSelectedMeaning("");
    setMeaningSubmitted(false);
    setMeaningCorrect(false);
    setLookupMessage(
      `${currentSite.domain} is easy for people to remember, but the network needs its IP address first.`
    );

    setTimeout(() => {
      setLookupPhase("revealed");
      setLookupMessage(
        `DNS found the IP address for ${currentSite.domain}. Now choose what DNS just did.`
      );
    }, 950);
  };

  const handleMeaningSubmit = () => {
    if (!selectedMeaning) return;

    const correct =
      selectedMeaning ===
      "It matches the website name to the correct IP address";

    setMeaningSubmitted(true);
    setMeaningCorrect(correct);

    if (correct) {
      setLookupMessage(
        `Correct. DNS matched ${currentSite.domain} to ${currentSite.ip}, so the browser can now find the correct server.`
      );

      setTimeout(() => {
        setLookupPhase("connected");
        setRoundsCompleted((prev) => prev + 1);
      }, 700);
    } else {
      setLookupMessage(
        "Not quite. DNS does not store the whole website or make the internet faster. Its job is to match the website name to the correct IP address."
      );
    }
  };

  const handleTryMeaningAgain = () => {
    setMeaningChoices(
      shuffleArray([
        "It matches the website name to the correct IP address",
        ...currentSite.wrongAnswers,
      ])
    );
    setSelectedMeaning("");
    setMeaningSubmitted(false);
    setMeaningCorrect(false);
    setLookupMessage(
      `Try again. DNS already revealed ${currentSite.ip}. Now choose what DNS actually did for ${currentSite.domain}.`
    );
  };

  const handleNextLookup = () => {
    const nextIndex = (selectedSiteIndex + 1) % lookupSets.length;
    setSelectedSiteIndex(nextIndex);
  };

  const resetLookup = () => {
    setSelectedSiteIndex(0);
    setMeaningChoices(
      shuffleArray([
        "It matches the website name to the correct IP address",
        ...lookupSets[0].wrongAnswers,
      ])
    );
    setSelectedMeaning("");
    setMeaningSubmitted(false);
    setMeaningCorrect(false);
    setLookupPhase("choose");
    setLookupMessage(
      "Choose a website name. DNS will help translate it into the correct IP address."
    );
    setRoundsCompleted(0);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 3
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            Domain Name System (DNS)
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Learn how DNS translates easy website names into the numeric IP
            addresses computers use to find the correct web server.
          </p>
        </header>

        <Section title="What is DNS?" icon={HelpCircle}>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="leading-7 text-slate-700">
                DNS is like the internet&apos;s address book. People use website
                names such as <span className="font-semibold">youtube.com</span>,
                but computers and networks use IP addresses. DNS translates the
                name into the correct IP address so your device knows where to go.
              </p>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Real-life analogy
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  Think about your contacts app. You tap a name like{" "}
                  <span className="font-semibold">Mum</span>, but your phone uses
                  the stored number behind that name. DNS works the same way on
                  the internet. You type a website name, and DNS looks up the
                  number the network needs.
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

        <Section title="Interactive DNS Lookup" icon={ShieldCheck}>
          <p className="mb-5 leading-7 text-slate-700">
            Choose a website name, ask DNS to look it up, reveal the IP address,
            and then connect to the correct server.
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

          <StatusBox title={statusTitle} body={lookupMessage} tone={statusTone} />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <BrowserBar
                domain={currentSite.domain}
                onSearch={handleStartLookup}
                disabled={lookupPhase !== "choose"}
              />

              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Choose a website
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {lookupSets.map((site, index) => (
                    <DomainButton
                      key={site.domain}
                      domain={site.domain}
                      active={selectedSiteIndex === index}
                      onClick={() => setSelectedSiteIndex(index)}
                      disabled={lookupPhase === "lookup"}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    DNS lookup activity
                  </h3>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Rounds completed: {roundsCompleted}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {lookupPhase === "choose" && (
                    <motion.div
                      key="choose"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center"
                    >
                      <Globe className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Select a domain name, then click <span className="font-semibold">Ask DNS</span>{" "}
                        to see how DNS finds the IP address.
                      </p>
                    </motion.div>
                  )}

                  {lookupPhase === "lookup" && (
                    <motion.div
                      key="lookup"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-blue-200 bg-blue-50 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"
                        >
                          <Search className="h-5 w-5" />
                        </motion.div>

                        <div>
                          <h4 className="font-semibold text-blue-900">
                            DNS is searching
                          </h4>
                          <p className="mt-1 text-sm leading-6 text-blue-800">
                            Looking up the IP address for{" "}
                            <span className="font-semibold">
                              {currentSite.domain}
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {lookupPhase === "revealed" && (
                    <motion.div
                      key="revealed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_60px_minmax(0,1fr)]">
                          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
                            <Globe className="mx-auto h-6 w-6 text-blue-700" />
                            <p className="mt-2 font-semibold text-blue-900">
                              {currentSite.domain}
                            </p>
                            <p className="mt-1 text-xs text-blue-700">
                              Website name
                            </p>
                          </div>

                          <div className="flex items-center justify-center">
                            <motion.div
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200"
                            >
                              <ArrowRight className="h-5 w-5 text-slate-600" />
                            </motion.div>
                          </div>

                          <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, delay: 0.15 }}
                            className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"
                          >
                            <Network className="mx-auto h-6 w-6 text-emerald-700" />
                            <p className="mt-2 font-mono text-sm font-semibold text-emerald-900">
                              {currentSite.ip}
                            </p>
                            <p className="mt-1 text-xs text-emerald-700">
                              IP address found by DNS
                            </p>
                          </motion.div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5">
                        <h4 className="text-lg font-semibold text-slate-900">
                          What did DNS just do?
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Choose the best explanation.
                        </p>

                        <div className="mt-4 grid gap-3">
                          {meaningChoices.map((option) => (
                            <MeaningOption
                              key={option}
                              option={option}
                              selected={selectedMeaning === option}
                              correct={
                                option ===
                                "It matches the website name to the correct IP address"
                              }
                              submitted={meaningSubmitted}
                              disabled={meaningSubmitted}
                              onClick={() => setSelectedMeaning(option)}
                            />
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                          {!meaningSubmitted ? (
                            <button
                              type="button"
                              onClick={handleMeaningSubmit}
                              disabled={!selectedMeaning}
                              className={`rounded-2xl px-5 py-2 text-white transition ${
                                selectedMeaning
                                  ? "bg-slate-900 hover:bg-slate-800"
                                  : "cursor-not-allowed bg-slate-400"
                              }`}
                            >
                              Check Answer
                            </button>
                          ) : !meaningCorrect ? (
                            <button
                              type="button"
                              onClick={handleTryMeaningAgain}
                              className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                            >
                              Try Again
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {lookupPhase === "connected" && (
                    <motion.div
                      key="connected"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="grid items-center gap-5 md:grid-cols-[140px_minmax(0,1fr)_140px]">
                          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 text-center">
                            <Globe className="mx-auto h-7 w-7 text-blue-700" />
                            <p className="mt-2 text-sm font-semibold text-blue-900">
                              {currentSite.domain}
                            </p>
                            <p className="mt-1 text-xs text-blue-700">
                              Website name
                            </p>
                          </div>

                          <div className="relative h-20">
                            <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-300" />
                            <motion.div
                              initial={{ left: "6%", opacity: 0 }}
                              animate={{ left: "82%", opacity: 1 }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                              className="absolute top-1/2 -translate-y-1/2"
                            >
                              <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-center shadow-sm">
                                <p className="font-mono text-sm font-semibold text-slate-800">
                                  {currentSite.ip}
                                </p>
                                <p className="text-xs text-slate-500">Matched IP</p>
                              </div>
                            </motion.div>
                          </div>

                          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                            <Server className="mx-auto h-7 w-7 text-emerald-700" />
                            <p className="mt-2 text-sm font-semibold text-emerald-900">
                              {currentSite.serverName}
                            </p>
                            <p className="mt-1 text-xs text-emerald-700">
                              Correct server found
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <StatusBox
                          title="DNS translation complete"
                          body={`${currentSite.domain} was translated into ${currentSite.ip}.`}
                          tone="success"
                        />
                        <StatusBox
                          title="Why this matters"
                          body="Your browser can now find the correct server because DNS turned a human-friendly name into a computer-friendly address."
                          tone="info"
                        />
                      </div>

                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleNextLookup}
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                        >
                          Try Another Website
                        </button>

                        <button
                          type="button"
                          onClick={resetLookup}
                          className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                        >
                          Reset Activity
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              <LookupStageCard
                title="1. Website name"
                subtitle="People type names like youtube.com because names are easier to remember."
                icon={Globe}
                tone="blue"
                active={lookupPhase === "choose"}
              />
              <LookupStageCard
                title="2. DNS lookup"
                subtitle="DNS searches for the correct IP address linked to that website name."
                icon={Search}
                tone="blue"
                active={lookupPhase === "lookup"}
              />
              <LookupStageCard
                title="3. IP address found"
                subtitle="The device receives the numeric address it needs to contact the right server."
                icon={Network}
                tone="emerald"
                active={lookupPhase === "revealed" || lookupPhase === "connected"}
              />
              <LookupStageCard
                title="4. Server reached"
                subtitle="With the correct IP address, the browser can connect to the correct website server."
                icon={Server}
                tone="emerald"
                active={lookupPhase === "connected"}
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Did you know?
                </h3>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    DNS lookups usually happen very quickly in the background.
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    Without DNS, users would need to remember number addresses for
                    every website.
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    DNS helps make the internet easier for humans to use.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={resetLookup}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Restart DNS Activity
            </button>
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
                  ? "Excellent work — you understand how DNS helps users reach the correct website."
                  : score >= 2
                  ? "Good job — review how DNS translates names into IP addresses."
                  : "Review the module and try the quiz again."}
              </p>
            </div>
          )}
        </Section>

        <Section title="Summary" icon={CheckCircle2}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Website names</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                People use names like google.com because they are easier to
                remember.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">IP addresses</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Computers use IP addresses to identify the correct location on the
                network.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">DNS</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                DNS connects the name to the address so your device can find the
                correct server.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}