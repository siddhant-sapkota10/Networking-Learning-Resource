import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  MousePointerClick,
  Network,
  RefreshCcw,
  Search,
  Server,
  ShieldCheck,
  Target,
  Trophy,
  X,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { markActivityComplete, markQuizPassed } from "../utils/progress";
import m4Diagram from "../assets/m4diagram.png";

const ST_EDS = {
  navy: "#073674",
  blue: "#0A4AA3",
  blue2: "#0F6DF0",
  gold: "#FEC52F",
  silver: "#D1D2D4",
  white: "#FFFFFF",
  pale: "#F8FAFC",
};

const overviewSteps = [
  {
    step: 1,
    title: "People use website names",
    text:
      "People type names like youtube.com because names are easier to remember than long numbers.",
  },
  {
    step: 2,
    title: "Computers use IP addresses",
    text:
      "Networks and computers use numeric IP addresses to find the correct destination.",
  },
  {
    step: 3,
    title: "DNS translates the name",
    text:
      "DNS matches the website name to the correct IP address behind the scenes.",
  },
  {
    step: 4,
    title: "The browser gets the address",
    text:
      "Once the IP address is found, the browser can use it to find the correct server.",
  },
  {
    step: 5,
    title: "The server sends the website",
    text:
      "DNS helps find the server, but the actual website content comes from the web server, not from DNS.",
  },
];

const keyIdeas = [
  "DNS stands for Domain Name System.",
  "DNS translates website names into IP addresses.",
  "People remember names more easily than long numbers.",
  "DNS helps your device find the correct web server.",
];

const misconceptionCards = [
  {
    wrong: "DNS stores the whole website.",
    right:
      "DNS helps find the correct IP address. The website itself is sent by the web server.",
  },
  {
    wrong: "DNS makes the internet faster by itself.",
    right:
      "DNS mainly helps the browser find the correct address. It does not replace the server or the whole connection.",
  },
  {
    wrong: "Users should remember IP addresses for websites.",
    right:
      "DNS exists so people can use easy website names while computers still use numeric addresses.",
  },
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

const baseQuizQuestions = [
  {
    question:
      "A student types youtube.com into a browser. Based on this module, what is the main job DNS performs before the browser can reach the correct website?",
    options: [
      "It matches the website name to the correct IP address",
      "It downloads the full website onto the device before opening it",
      "It increases the connection speed so the page can load faster",
      "It replaces the web server with a simpler browser version",
    ],
    answer: "It matches the website name to the correct IP address",
  },
  {
    question:
      "Why does the internet use DNS instead of expecting people to type IP addresses for every website?",
    options: [
      "Website names are easier for humans to remember than long numbers",
      "IP addresses only work on school networks, not the public internet",
      "DNS makes every website use the same IP address format",
      "Browsers cannot display a website unless DNS stores it first",
    ],
    answer: "Website names are easier for humans to remember than long numbers",
  },
  {
    question:
      "A student says, “DNS stores the whole website and sends it to my browser.” Which correction is the most accurate?",
    options: [
      "DNS helps find the correct IP address, but the website content comes from the web server",
      "DNS stores the whole website, but only for videos and search engines",
      "DNS and the web server are the same thing, so both explanations are correct",
      "DNS sends the website first, then later asks the server for permission",
    ],
    answer:
      "DNS helps find the correct IP address, but the website content comes from the web server",
  },
  {
    question:
      "In the learning activity, what happens immediately after DNS finds the IP address linked to a website name?",
    options: [
      "The browser can use that IP address to find the correct server",
      "The IP address is converted back into a new website name",
      "The DNS system turns off because its job is finished forever",
      "The browser no longer needs a server to load the site",
    ],
    answer: "The browser can use that IP address to find the correct server",
  },
  {
    question:
      "Which statement best shows the difference between a domain name and an IP address?",
    options: [
      "A domain name is the human-friendly website name, while an IP address is the numeric address computers use",
      "A domain name is the number a router uses, while an IP address is the colour of the website",
      "A domain name is a saved file, while an IP address is the speed of the connection",
      "A domain name and an IP address are identical labels for the same browser tab",
    ],
    answer:
      "A domain name is the human-friendly website name, while an IP address is the numeric address computers use",
  },
  {
    question:
      "A user enters sec.act.edu.au. Which explanation best matches what DNS does in this situation?",
    options: [
      "DNS looks up the numeric address linked to that name so the browser can reach the correct school server",
      "DNS checks whether the website is popular enough to open in the browser",
      "DNS turns the school server into a search engine before the page loads",
      "DNS removes the need for the browser to contact any server",
    ],
    answer:
      "DNS looks up the numeric address linked to that name so the browser can reach the correct school server",
  },
  {
    question:
      "Which option best explains why DNS is often compared to an address book or contacts list?",
    options: [
      "Because it links easy-to-remember names to the number-based addresses needed behind the scenes",
      "Because it stores every website permanently like a list of downloaded apps",
      "Because it changes internet speeds depending on which name is searched",
      "Because it creates new domain names every time a user opens a page",
    ],
    answer:
      "Because it links easy-to-remember names to the number-based addresses needed behind the scenes",
  },
  {
    question:
      "Without DNS, what would be the most likely extra task for a normal user trying to visit websites?",
    options: [
      "They would need to remember and type the IP addresses for websites instead of names",
      "They would need to build a separate server for every website they visit",
      "They would need to manually increase their Wi-Fi speed before browsing",
      "They would need to reinstall the browser each time they opened a site",
    ],
    answer:
      "They would need to remember and type the IP addresses for websites instead of names",
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
    shuffledOptions: shuffleArray(q.options),
  }));
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[30px] border border-white/20 bg-white p-6 shadow-xl">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${ST_EDS.gold}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: ST_EDS.navy }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: ST_EDS.navy }}>
          {title}
        </h2>
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
      ? "border-[#bfd7ff] bg-[#eef5ff] text-[#0a4aa3]"
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
              : "bg-[#073674] hover:bg-[#0a4aa3]"
          }`}
        >
          <Search className="h-4 w-4" />
          Ask DNS
        </button>
      </div>
    </div>
  );
}

function DomainButton({ domain, active, done, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        done
          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
          : active
          ? "border-[#073674] bg-[#073674] text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${disabled && !done ? "cursor-not-allowed opacity-70" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="font-medium">{domain}</span>
        </div>
        {done && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
      </div>
    </button>
  );
}

function StepChip({ label, active, complete }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-[#073674] text-white"
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
      ? "border-[#bfd7ff] bg-[#eef5ff] text-[#0a4aa3]"
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
    styles = "border-[#073674] bg-[#073674] text-white";
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
    styles = "border-[#073674] bg-[#073674] text-white";
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

function ModuleProgress({ currentPage }) {
  const pages = [
    { label: "Overview" },
    { label: "Activity" },
    { label: "Quiz" },
  ];

  return (
    <div className="rounded-[30px] border border-white/20 bg-white p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: ST_EDS.navy }}>
          Module Progress
        </h2>
        <span className="text-sm text-slate-500">Page {currentPage + 1} of 3</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {pages.map((page, index) => {
          const active = currentPage === index;
          const complete = currentPage > index;

          return (
            <div
              key={page.label}
              className={`rounded-2xl border p-4 ${
                active
                  ? "border-[#073674] bg-[#073674] text-white"
                  : complete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                  {index + 1}
                </div>
                {complete && <CheckCircle2 className="h-5 w-5" />}
              </div>
              <p className="font-semibold">{page.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DNS() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

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

  const [completedSites, setCompletedSites] = useState({});
  const [modulePage, setModulePage] = useState(0);
  const [overviewUnlocked, setOverviewUnlocked] = useState(false);
  const [activityUnlocked, setActivityUnlocked] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const overviewRef = useRef(null);

  const currentSite = lookupSets[selectedSiteIndex];

  useEffect(() => {
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!overviewRef.current || overviewUnlocked || modulePage !== 0) return;

      const rect = overviewRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (rect.bottom <= viewportHeight - 20) {
        setOverviewUnlocked(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [overviewUnlocked, modulePage]);

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

  useEffect(() => {
    if (roundsCompleted >= 1) {
      setActivityUnlocked(true);
      setShowCompletionOverlay(true);
      markActivityComplete("/dns");
    }
  }, [roundsCompleted]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers, quizQuestions]);

  useEffect(() => {
    if (submittedQuiz && score >= 6) {
      markQuizPassed("/dns");
    }
  }, [submittedQuiz, score]);

  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((_, index) => typeof selectedAnswers[index] === "string");

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
        setCompletedSites((prev) => ({
          ...prev,
          [selectedSiteIndex]: true,
        }));
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
    const nextSite = lookupSets.findIndex((_, i) => !completedSites[i]);
    if (nextSite !== -1) {
      setSelectedSiteIndex(nextSite);
    } else {
      setSelectedSiteIndex(0);
    }
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
    setCompletedSites({});
    setActivityUnlocked(false);
    setShowCompletionOverlay(false);
  };

  const resetQuiz = () => {
    setSubmittedQuiz(false);
    setSelectedAnswers({});
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  };

  const goToNextModule = () => {
    alert("Great job! You finished this module. You can now move to the next one.");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${ST_EDS.navy} 0%, ${ST_EDS.blue} 35%, ${ST_EDS.blue2} 100%)`,
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-[32px] border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-sm">
          <span
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ backgroundColor: ST_EDS.gold, color: ST_EDS.navy }}
          >
            St Edmund&apos;s College Canberra
          </span>

          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Domain Name System (DNS)
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-100">
            Learn how DNS translates easy website names into the numeric IP
            addresses computers use to find the correct web server.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Globe className="mb-2 h-5 w-5" />
              <p className="font-semibold">Website names</p>
              <p className="mt-1 text-sm text-slate-200">
                Learn why people use names instead of long IP addresses.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Network className="mb-2 h-5 w-5" />
              <p className="font-semibold">DNS lookup</p>
              <p className="mt-1 text-sm text-slate-200">
                Follow how DNS finds the correct numeric address.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Trophy className="mb-2 h-5 w-5" />
              <p className="font-semibold">Quiz feedback</p>
              <p className="mt-1 text-sm text-slate-200">
                Review what you chose and compare it with the correct answer.
              </p>
            </div>
          </div>
        </header>

        <ModuleProgress currentPage={modulePage} />

        <AnimatePresence mode="wait">
          {modulePage === 0 && (
            <motion.div
              key="overview-page"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25 }}
            >
              <div ref={overviewRef}>
                <Section title="What is DNS?" icon={HelpCircle}>
                  <div className="rounded-3xl border border-[#dbe7fb] bg-[#f5f9ff] p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "#dce9ff" }}
                      >
                        <Target className="h-5 w-5" style={{ color: ST_EDS.navy }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                          What you are learning
                        </h3>
                        <p className="mt-2 leading-7 text-slate-700">
                          This module explains how DNS helps the browser find the
                          correct server. People use website names like{" "}
                          <span className="font-semibold">youtube.com</span>, but
                          computers use IP addresses. DNS links the name to the
                          correct address so the browser knows where to go.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-5">
                    {overviewSteps.map((step) => (
                      <div
                        key={step.step}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div
                          className="mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: ST_EDS.navy }}
                        >
                          {step.step}
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: ST_EDS.navy }}>
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {step.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" style={{ color: ST_EDS.gold }} />
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                          Real-life analogy
                        </h3>
                      </div>
                      <p className="mt-3 leading-7 text-slate-700">
                        Think about your contacts app. You tap a name like{" "}
                        <span className="font-semibold">Mum</span>, but your phone
                        uses the stored number behind that name. DNS works the same
                        way on the internet. You type a website name, and DNS looks
                        up the number the network needs.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: ST_EDS.blue }} />
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                          Key ideas to remember
                        </h3>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {keyIdeas.map((idea) => (
                          <div
                            key={idea}
                            className="flex items-start gap-2 rounded-2xl bg-slate-50 px-4 py-3"
                          >
                            <BadgeCheck
                              className="mt-0.5 h-4 w-4 shrink-0"
                              style={{ color: ST_EDS.navy }}
                            />
                            <p className="text-sm leading-6 text-slate-700">{idea}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 mt-8 flex items-center justify-center">
                    <img src={m4Diagram} alt="DNS diagram" className="max-w-full rounded-2xl" />
                  </div>

                  <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-rose-700" />
                      <h3 className="text-lg font-semibold text-rose-900">
                        Common mistakes to avoid
                      </h3>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      {misconceptionCards.map((item) => (
                        <div key={item.wrong} className="rounded-2xl bg-white/80 p-4">
                          <p className="text-sm font-semibold text-rose-800">
                            Incorrect idea
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {item.wrong}
                          </p>
                          <p className="mt-3 text-sm font-semibold text-emerald-700">
                            Better explanation
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">
                            {item.right}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-[#f5dda2] bg-[#fff7df] p-4">
                    <h3 className="font-semibold" style={{ color: "#7a5800" }}>
                      What happens next?
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "#7a5800" }}>
                      On the next page, you will choose a website name, ask DNS to
                      look it up, reveal the IP address, and connect to the correct
                      server.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      Ready to continue?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Scroll to the bottom of this page to unlock the DNS activity.
                    </p>
                  </div>
                </Section>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModulePage(1)}
                  disabled={!overviewUnlocked}
                  className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white transition ${
                    overviewUnlocked
                      ? "bg-[#073674] hover:bg-[#0a4aa3]"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  {!overviewUnlocked && <Lock className="h-4 w-4" />}
                  Next Page
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {modulePage === 1 && (
            <motion.div
              key="activity-page"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25 }}
            >
              <Section title="Interactive DNS Lookup" icon={ShieldCheck}>
                <div className="relative">
                  <p className="mb-5 leading-7 text-slate-700">
                    Choose a website name, ask DNS to look it up, reveal the IP
                    address, and then connect to the correct server.
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {["Choose Name", "Lookup", "Reveal IP", "Connect"].map(
                      (label, index) => (
                        <StepChip
                          key={label}
                          label={label}
                          active={activeStep === index}
                          complete={activeStep > index}
                        />
                      )
                    )}
                  </div>

                  <StatusBox title={statusTitle} body={lookupMessage} tone={statusTone} />

                  <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                      <BrowserBar
                        domain={currentSite.domain}
                        onSearch={handleStartLookup}
                        disabled={
                          lookupPhase !== "choose" || completedSites[selectedSiteIndex]
                        }
                      />

                      <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                            Choose a website
                          </h3>
                          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {roundsCompleted} completed
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {lookupSets.map((site, index) => (
                            <DomainButton
                              key={site.domain}
                              domain={site.domain}
                              active={selectedSiteIndex === index}
                              done={!!completedSites[index]}
                              onClick={() => setSelectedSiteIndex(index)}
                              disabled={lookupPhase === "lookup" || !!completedSites[index]}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
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
                                Select a domain name, then click{" "}
                                <span className="font-semibold">Ask DNS</span> to see
                                how DNS finds the IP address.
                              </p>
                            </motion.div>
                          )}

                          {lookupPhase === "lookup" && (
                            <motion.div
                              key="lookup"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="rounded-2xl border border-[#bfd7ff] bg-[#eef5ff] p-5"
                            >
                              <div className="flex items-center gap-3">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1.1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0a4aa3] shadow-sm"
                                >
                                  <Search className="h-5 w-5" />
                                </motion.div>

                                <div>
                                  <h4 className="font-semibold text-[#073674]">
                                    DNS is searching
                                  </h4>
                                  <p className="mt-1 text-sm leading-6 text-[#0a4aa3]">
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
                                  <div className="rounded-2xl border border-[#bfd7ff] bg-[#eef5ff] p-4 text-center">
                                    <Globe className="mx-auto h-6 w-6 text-[#0a4aa3]" />
                                    <p className="mt-2 font-semibold text-[#073674]">
                                      {currentSite.domain}
                                    </p>
                                    <p className="mt-1 text-xs text-[#0a4aa3]">
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
                                <h4 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
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
                                          ? "bg-[#073674] hover:bg-[#0a4aa3]"
                                          : "cursor-not-allowed bg-slate-400"
                                      }`}
                                    >
                                      Check Answer
                                    </button>
                                  ) : !meaningCorrect ? (
                                    <button
                                      type="button"
                                      onClick={handleTryMeaningAgain}
                                      className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
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
                                  <div className="rounded-3xl border border-[#bfd7ff] bg-[#eef5ff] p-4 text-center">
                                    <Globe className="mx-auto h-7 w-7 text-[#0a4aa3]" />
                                    <p className="mt-2 text-sm font-semibold text-[#073674]">
                                      {currentSite.domain}
                                    </p>
                                    <p className="mt-1 text-xs text-[#0a4aa3]">
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
                                  className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
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
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
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

                      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                          Website progress
                        </h3>
                        <div className="mt-3 grid gap-2">
                          {lookupSets.map((site, index) => (
                            <div
                              key={site.domain}
                              className={`rounded-2xl border px-4 py-3 text-sm ${
                                completedSites[index]
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                  : "border-slate-200 bg-slate-50 text-slate-600"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold">{site.domain}</span>
                                {completedSites[index] ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                                ) : (
                                  <span className="text-xs">Not yet</span>
                                )}
                              </div>
                            </div>
                          ))}
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

                  <AnimatePresence>
                    {showCompletionOverlay && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-slate-900/45 p-4 backdrop-blur-[3px]"
                      >
                        <motion.div
                          initial={{ scale: 0.96, y: 10, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.98, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl"
                        >
                          <div className="flex items-start justify-between">
                            <div />
                            <button
                              type="button"
                              onClick={() => setShowCompletionOverlay(false)}
                              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label="Close completion message"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
                            <CheckCircle2 className="h-8 w-8 text-emerald-700" />
                          </div>

                          <h3 className="mt-4 text-2xl font-bold" style={{ color: ST_EDS.navy }}>
                            Activity Complete
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            You successfully completed a full DNS lookup and showed that
                            DNS matches a website name to the correct IP address.
                          </p>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                              type="button"
                              onClick={resetLookup}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-50"
                            >
                              <RefreshCcw className="h-4 w-4" />
                              Try Again
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowCompletionOverlay(false)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#073674] px-5 py-2.5 text-white transition hover:bg-[#0a4aa3]"
                            >
                              Back to Activity
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setModulePage(0)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 transition hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Page
                  </button>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {activityUnlocked
                      ? "Activity complete — you can move to the quiz."
                      : "Complete one full DNS lookup to unlock the quiz."}
                  </div>

                  <button
                    type="button"
                    onClick={() => setModulePage(2)}
                    disabled={!activityUnlocked}
                    className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-white transition ${
                      activityUnlocked
                        ? "bg-[#073674] hover:bg-[#0a4aa3]"
                        : "cursor-not-allowed bg-slate-300"
                    }`}
                  >
                    {!activityUnlocked && <Lock className="h-4 w-4" />}
                    Next Page
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </Section>
            </motion.div>
          )}

          {modulePage === 2 && (
            <motion.div
              key="quiz-page"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.25 }}
            >
              <Section title="Quick Quiz" icon={HelpCircle}>
                <div className="mb-5 rounded-2xl border border-[#f5dda2] bg-[#fff7df] p-4">
                  <p className="text-sm font-medium" style={{ color: "#7a5800" }}>
                    The answer positions are randomised each time the quiz is reset.
                  </p>
                </div>

                <div className="space-y-5">
                  {quizQuestions.map((q, i) => {
                    const userAnswer = selectedAnswers[i];
                    const wasCorrect = userAnswer === q.answer;

                    return (
                      <div
                        key={q.question}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <h3 className="font-semibold text-slate-900">
                          {i + 1}. {q.question}
                        </h3>

                        <div className="mt-4 grid gap-3">
                          {q.shuffledOptions.map((option) => (
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

                        {submittedQuiz && (
                          <div
                            className={`mt-4 rounded-2xl border p-4 ${
                              wasCorrect
                                ? "border-emerald-200 bg-emerald-50"
                                : "border-rose-200 bg-rose-50"
                            }`}
                          >
                            <p
                              className={`text-sm font-semibold ${
                                wasCorrect ? "text-emerald-800" : "text-rose-800"
                              }`}
                            >
                              {wasCorrect ? "Correct" : "Incorrect"}
                            </p>

                            {!wasCorrect && (
                              <div className="mt-2 space-y-1 text-sm text-slate-700">
                                <p>
                                  <span className="font-semibold">You answered:</span>{" "}
                                  {userAnswer || "No answer selected"}
                                </p>
                                <p>
                                  <span className="font-semibold">Correct answer:</span>{" "}
                                  {q.answer}
                                </p>
                              </div>
                            )}

                            {wasCorrect && (
                              <p className="mt-2 text-sm text-slate-700">
                                You selected the correct answer.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedQuiz(true)}
                    disabled={!allAnswered}
                    className="rounded-2xl bg-[#073674] px-5 py-2 text-white hover:bg-[#0a4aa3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit Quiz
                  </button>

                  <button
                    type="button"
                    onClick={resetQuiz}
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
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 rounded-2xl bg-slate-50 p-5"
                  >
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      Your Score: {score} / {quizQuestions.length}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {score === quizQuestions.length
                        ? "Excellent work — you clearly understand how DNS translates names into IP addresses and helps the browser find the correct server."
                        : score >= 6
                        ? "Good job — you understand most of DNS, but review the exact difference between DNS, IP addresses, and the web server."
                        : score >= 4
                        ? "Decent effort — revisit the module and pay close attention to what DNS actually does versus what the server does."
                        : "This quiz is meant to reward real understanding. Go back through the module and focus on how names, IP addresses, and servers connect together."}
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setModulePage(1)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 transition hover:bg-slate-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Activity
                      </button>

                      <button
                        type="button"
                        onClick={goToNextModule}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
                      >
                        Go to Next Module
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}