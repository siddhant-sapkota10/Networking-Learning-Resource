import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  MousePointerClick,
  Package,
  Play,
  RefreshCcw,
  Target,
  Timer,
  Trophy,
  Wifi,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { markActivityComplete, markQuizPassed } from "../utils/progress";
import m3Diagram from "../assets/m3diagram.png";

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
    title: "Bits are tiny pieces of data",
    text:
      "A bit is a very small unit of digital information. Huge numbers of bits are used to make videos, images, music, and websites.",
  },
  {
    step: 2,
    title: "Bit rate is data used each second",
    text:
      "Bit rate tells us how much data a video or sound is trying to use every second.",
  },
  {
    step: 3,
    title: "Bandwidth is connection carrying room",
    text:
      "Bandwidth is how much data the connection can carry at one time.",
  },
  {
    step: 4,
    title: "These ideas are related",
    text:
      "A higher bit rate can look or sound better, but it needs enough bandwidth to move smoothly.",
  },
  {
    step: 5,
    title: "Too much data can cause buffering",
    text:
      "If the bit rate is higher than the bandwidth can comfortably support, the content may buffer or drop quality.",
  },
];

const conceptCards = [
  {
    key: "bit",
    title: "Bit",
    icon: Package,
    description:
      "A bit is a tiny piece of digital information. Devices use huge numbers of bits to send videos, images, music, and messages.",
    accent: "border-[#bfd7ff] bg-[#eef5ff] text-[#0a4aa3]",
  },
  {
    key: "bitrate",
    title: "Bit Rate",
    icon: Timer,
    description:
      "Bit rate means how much data is used or sent each second. Higher bit rate can improve quality, but it also needs more data.",
    accent: "border-violet-200 bg-violet-50 text-violet-800",
  },
  {
    key: "bandwidth",
    title: "Bandwidth",
    icon: Wifi,
    description:
      "Bandwidth is how much data can move through a connection at one time. More bandwidth means more room for data to travel.",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
];

const keyIdeas = [
  "A bit is a tiny unit of digital information.",
  "Bit rate is how much data is used each second.",
  "Bandwidth is how much data can move through the connection.",
  "A high bit rate needs enough bandwidth to work smoothly.",
];

const misconceptionCards = [
  {
    wrong: "Bit rate and bandwidth are the same thing.",
    right:
      "Bit rate is how much data is used each second. Bandwidth is how much data the connection can carry.",
  },
  {
    wrong: "Higher bit rate is always better.",
    right:
      "Higher bit rate can improve quality, but it still needs enough bandwidth to play smoothly.",
  },
  {
    wrong: "Buffering just happens randomly.",
    right:
      "Buffering often happens when the content is trying to use more data each second than the connection can support.",
  },
];

const baseQuizQuestions = [
  {
    question:
      "A student says, “Bit rate and bandwidth mean the same thing because both involve data.” Which response is most accurate?",
    options: [
      "They are related, but bit rate is how much data is used each second, while bandwidth is how much data the connection can carry at one time",
      "They are the same idea, but bandwidth is only used for videos and bit rate is only used for music",
      "Bandwidth measures the quality of a video, while bit rate measures the size of the screen",
      "Bit rate describes the internet speed of the router, while bandwidth describes the number of files on a server",
    ],
    answer:
      "They are related, but bit rate is how much data is used each second, while bandwidth is how much data the connection can carry at one time",
  },
  {
    question:
      "In the module’s pipe analogy, what does a wider pipe mainly represent?",
    options: [
      "More bandwidth, meaning more data can move through the connection at one time",
      "A higher bit rate, meaning the video automatically becomes higher quality",
      "A larger file size, meaning the content takes up more storage",
      "A stronger Wi-Fi password, meaning the connection is more secure",
    ],
    answer:
      "More bandwidth, meaning more data can move through the connection at one time",
  },
  {
    question:
      "Which situation is most likely to cause buffering in the interactive activity?",
    options: [
      "The selected bit rate is higher than the selected bandwidth",
      "The selected bandwidth is higher than the selected bit rate",
      "The video is low quality and the bandwidth is medium",
      "The bit rate and bandwidth are both low",
    ],
    answer: "The selected bit rate is higher than the selected bandwidth",
  },
  {
    question:
      "A video uses more data each second to improve image quality. In the language of this module, what has increased?",
    options: [
      "The bit rate has increased",
      "The bandwidth has increased",
      "The number of bits stored on the router has increased",
      "The connection width has automatically doubled",
    ],
    answer: "The bit rate has increased",
  },
  {
    question:
      "Which statement best explains why a high bit rate may still perform badly on some connections?",
    options: [
      "A high bit rate needs enough bandwidth, and without it the connection may not carry the data smoothly",
      "A high bit rate only works on wired internet and always fails on Wi-Fi",
      "A high bit rate reduces the number of bits in the video, which causes freezing",
      "A high bit rate makes the video too short for the bandwidth to understand",
    ],
    answer:
      "A high bit rate needs enough bandwidth, and without it the connection may not carry the data smoothly",
  },
  {
    question:
      "Two users watch the same clip. User A has high bandwidth and medium bit rate. User B has low bandwidth and high bit rate. Based on the module, who is more likely to experience buffering?",
    options: [
      "User B, because the video is trying to use more data each second than the connection can comfortably support",
      "User A, because medium bit rate always causes buffering on fast connections",
      "Both users equally, because buffering depends only on the video title",
      "Neither user, because bit rate does not affect playback",
    ],
    answer:
      "User B, because the video is trying to use more data each second than the connection can comfortably support",
  },
  {
    question: "What is the best definition of a bit in this learning module?",
    options: [
      "A tiny unit of digital information used as part of larger files and data",
      "A measure of how wide a network connection is",
      "A label for how smoothly a video plays",
      "A device that sends data between screens",
    ],
    answer:
      "A tiny unit of digital information used as part of larger files and data",
  },
  {
    question:
      "Which option best matches the relationship shown in the module?",
    options: [
      "Bandwidth is the connection’s carrying room, while bit rate is the amount of data the content tries to use each second",
      "Bandwidth is the amount of data in a file, while bit rate is the amount of storage on a computer",
      "Bandwidth and bit rate both describe file quality only, not movement through a connection",
      "Bandwidth is how much data a server stores, while bit rate is how many screens are connected",
    ],
    answer:
      "Bandwidth is the connection’s carrying room, while bit rate is the amount of data the content tries to use each second",
  },
];

const levelValue = {
  low: 1,
  medium: 2,
  high: 3,
};

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

function DataDot({ active }) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.28,
        scale: active ? [1, 1.08, 1] : 0.92,
      }}
      transition={{
        duration: 0.6,
        repeat: active ? Infinity : 0,
        repeatDelay: 0.1,
      }}
      className={`h-4 w-4 rounded-full ${active ? "bg-sky-500" : "bg-slate-300"}`}
    />
  );
}

function SelectorGroup({ title, value, onChange }) {
  return (
    <div>
      <h3 className="text-base font-semibold" style={{ color: ST_EDS.navy }}>
        {title}
      </h3>
      <div className="mt-3 flex flex-wrap gap-3">
        {["low", "medium", "high"].map((level) => {
          const active = value === level;
          return (
            <button
              key={level}
              type="button"
              onClick={() => onChange(level)}
              className={`rounded-2xl border px-4 py-2 font-medium transition ${
                active
                  ? "border-[#073674] bg-[#073674] text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PipeComparison({ bandwidthLevel, bitrateLevel }) {
  const bandwidthValue = levelValue[bandwidthLevel];
  const bitrateValue = levelValue[bitrateLevel];

  const pipeWidthClass =
    bandwidthLevel === "low"
      ? "h-10 max-w-[240px]"
      : bandwidthLevel === "medium"
      ? "h-14 max-w-[310px]"
      : "h-20 max-w-[390px]";

  const flowDots =
    bitrateLevel === "low" ? 2 : bitrateLevel === "medium" ? 4 : 6;

  const crowded = bitrateValue > bandwidthValue;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <h3 className="mb-2 text-lg font-semibold" style={{ color: ST_EDS.navy }}>
          Bandwidth demo
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Think of bandwidth like the width of a road or pipe. More bandwidth
          means more data can move at one time.
        </p>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div
            className={`mx-auto flex items-center justify-center rounded-full bg-slate-200 px-4 transition-all duration-300 ${pipeWidthClass}`}
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: flowDots }).map((_, i) => (
                <DataDot key={i} active />
              ))}
            </div>
          </div>

          <p className="mt-4 text-center text-sm font-semibold text-slate-700">
            {bandwidthLevel === "low"
              ? "Low bandwidth"
              : bandwidthLevel === "medium"
              ? "Medium bandwidth"
              : "High bandwidth"}
          </p>

          <p className="mt-2 text-center text-xs leading-5 text-slate-500">
            {crowded
              ? "There is a lot of data trying to fit through a smaller connection."
              : "The connection has enough room for this amount of data."}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-lg font-semibold" style={{ color: ST_EDS.navy }}>
          Bit rate demo
        </h3>
        <p className="text-sm leading-6 text-slate-600">
          Bit rate is about how much data is used each second. Higher bit rate
          can give better quality, but it also needs more data.
        </p>

        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="mx-auto flex max-w-[320px] items-end justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => {
              const active = i < flowDots;
              const height =
                i === 0 || i === 5
                  ? "h-10"
                  : i === 1 || i === 4
                  ? "h-14"
                  : "h-20";

              return (
                <motion.div
                  key={i}
                  animate={{
                    opacity: active ? 1 : 0.25,
                    scaleY: active ? [1, 1.06, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: active ? Infinity : 0,
                    repeatDelay: 0.15,
                  }}
                  className={`w-8 rounded-t-xl ${height} ${
                    active ? "bg-violet-500" : "bg-slate-200"
                  }`}
                />
              );
            })}
          </div>

          <p className="mt-4 text-center text-sm font-semibold text-slate-700">
            {bitrateLevel === "low"
              ? "Low bit rate"
              : bitrateLevel === "medium"
              ? "Medium bit rate"
              : "High bit rate"}
          </p>

          <p className="mt-2 text-center text-xs leading-5 text-slate-500">
            {bitrateLevel === "low"
              ? "Uses less data each second."
              : bitrateLevel === "medium"
              ? "Uses a medium amount of data each second."
              : "Uses more data each second."}
          </p>
        </div>
      </div>
    </div>
  );
}

function VideoPreview({ bandwidthLevel, bitrateLevel }) {
  const bandwidthValue = levelValue[bandwidthLevel];
  const bitrateValue = levelValue[bitrateLevel];

  const isBuffering = bitrateValue > bandwidthValue;
  const qualityLabel =
    bitrateLevel === "low"
      ? "Low quality"
      : bitrateLevel === "medium"
      ? "Medium quality"
      : "High quality";

  const playbackLabel = isBuffering ? "Buffering" : "Playing smoothly";

  const circleClass = isBuffering
    ? "bg-amber-500"
    : bitrateLevel === "low"
    ? "bg-slate-500"
    : bitrateLevel === "medium"
    ? "bg-amber-500"
    : "bg-red-600";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Play className="h-5 w-5 text-red-500" />
          <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
            {qualityLabel}
          </h4>
        </div>

        <div
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isBuffering
              ? "bg-amber-100 text-amber-800"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {playbackLabel}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="relative aspect-video bg-slate-900 p-4">
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
                Video example
              </span>
              <span className="text-xs text-slate-300">{qualityLabel}</span>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <motion.div
                animate={
                  isBuffering
                    ? { scale: [1, 0.96, 1], opacity: [1, 0.8, 1] }
                    : { scale: [1, 1.03, 1], opacity: 1 }
                }
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  repeatDelay: 0.1,
                }}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${circleClass}`}
              >
                <Play className="ml-1 h-7 w-7 fill-white text-white" />
              </motion.div>

              {isBuffering && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="absolute bottom-3 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                >
                  Buffering...
                </motion.div>
              )}
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Nature clip</p>
              <p className="mt-1 text-xs text-slate-300">
                {isBuffering
                  ? "The bit rate is asking for more data each second than the bandwidth can handle."
                  : bitrateLevel === "low"
                  ? "Uses less data each second, so it plays smoothly with enough bandwidth."
                  : bitrateLevel === "medium"
                  ? "Uses a medium amount of data each second and can play smoothly when bandwidth is enough."
                  : "Uses more data each second for better quality and needs enough bandwidth to stay smooth."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelationshipSummary({ bandwidthLevel, bitrateLevel }) {
  const bandwidthValue = levelValue[bandwidthLevel];
  const bitrateValue = levelValue[bitrateLevel];
  const isBuffering = bitrateValue > bandwidthValue;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${bandwidthLevel}-${bitrateLevel}`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        transition={{ duration: 0.25 }}
        className="rounded-2xl bg-slate-50 p-4"
      >
        <div className="space-y-3 text-slate-700">
          <p className="leading-7">
            <span className="font-semibold">Bandwidth:</span>{" "}
            {bandwidthLevel === "low"
              ? "There is less room for data to move through the connection."
              : bandwidthLevel === "medium"
              ? "There is a medium amount of room for data to move through the connection."
              : "There is more room for data to move through the connection."}
          </p>

          <p className="leading-7">
            <span className="font-semibold">Bit rate:</span>{" "}
            {bitrateLevel === "low"
              ? "The content uses less data each second."
              : bitrateLevel === "medium"
              ? "The content uses a medium amount of data each second."
              : "The content uses more data each second, which can improve quality."}
          </p>

          <p className="leading-7">
            <span className="font-semibold">Together:</span>{" "}
            {isBuffering
              ? "The bit rate is higher than the bandwidth can comfortably support, so the video may buffer or drop quality."
              : "The bandwidth is enough for this bit rate, so the video can play more smoothly."}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
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

export default function Bandwidth() {
  const [bandwidthLevel, setBandwidthLevel] = useState("medium");
  const [bitrateLevel, setBitrateLevel] = useState("medium");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [modulePage, setModulePage] = useState(0);
  const [overviewUnlocked, setOverviewUnlocked] = useState(false);
  const [activityUnlocked, setActivityUnlocked] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const [bandwidthTouched, setBandwidthTouched] = useState(false);
  const [bitrateTouched, setBitrateTouched] = useState(false);

  const overviewRef = useRef(null);

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
    if (bandwidthTouched && bitrateTouched) {
      setActivityUnlocked(true);
      setShowCompletionOverlay(true);
      markActivityComplete("/bitrate-bandwidth");
    }
  }, [bandwidthTouched, bitrateTouched]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, index) => total + (selectedAnswers[index] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers, quizQuestions]);

  useEffect(() => {
    if (submittedQuiz && score >= 6) {
      markQuizPassed("/bitrate-bandwidth");
    }
  }, [submittedQuiz, score]);

  const bandwidthValue = levelValue[bandwidthLevel];
  const bitrateValue = levelValue[bitrateLevel];
  const isBuffering = bitrateValue > bandwidthValue;

  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((_, index) => typeof selectedAnswers[index] === "string");

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  };

  const resetActivity = () => {
    setBandwidthLevel("medium");
    setBitrateLevel("medium");
    setBandwidthTouched(false);
    setBitrateTouched(false);
    setActivityUnlocked(false);
    setShowCompletionOverlay(false);
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
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <header className="rounded-[32px] border border-white/20 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-sm">
          <span
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ backgroundColor: ST_EDS.gold, color: ST_EDS.navy }}
          >
            St Edmund&apos;s College Canberra
          </span>

          <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">
            Bit Rate and Bandwidth
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-100">
            Learn the difference between bits, bit rate, and bandwidth, then test
            how they work together in an interactive activity.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Gauge className="mb-2 h-5 w-5" />
              <p className="font-semibold">Core ideas</p>
              <p className="mt-1 text-sm text-slate-200">
                Understand bits, bit rate, and bandwidth clearly.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <MousePointerClick className="mb-2 h-5 w-5" />
              <p className="font-semibold">Interactive demo</p>
              <p className="mt-1 text-sm text-slate-200">
                Change both controls and watch smooth playback or buffering.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Trophy className="mb-2 h-5 w-5" />
              <p className="font-semibold">Quiz feedback</p>
              <p className="mt-1 text-sm text-slate-200">
                Review what you selected and compare it with the correct answer.
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
                <Section title="General Overview" icon={BookOpen}>
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
                          This module explains the difference between bits, bit rate,
                          and bandwidth. It also shows why videos can buffer when the
                          content is trying to use more data each second than the
                          connection can carry smoothly.
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
                        Imagine water moving through pipes. A wider pipe can carry
                        more water at one time. Bandwidth is similar — it is the
                        amount of data that can move through a connection. Bit rate
                        is more like how much water is being used each second.
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

                  <div className="rounded-3xl border border-slate-200 bg-white p-5 mt-8">
                    <img src={m3Diagram} alt="BR & BW diagram" className="w-full rounded-2xl" />
                  </div>

                  <div className="mt-8">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                          <Gauge className="h-5 w-5 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-bold" style={{ color: ST_EDS.navy }}>
                          Core Concepts
                        </h3>
                      </div>

                      <div className="grid gap-4 lg:grid-cols-3">
                        {conceptCards.map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.key}
                              className={`rounded-2xl border p-5 ${item.accent}`}
                            >
                              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70">
                                <Icon className="h-5 w-5" />
                              </div>
                              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                              <p className="text-sm leading-6">{item.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
                      On the next page, you will choose different bandwidth and bit
                      rate levels and see whether the content plays smoothly or buffers.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      Ready to continue?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Scroll to the bottom of this page to unlock the interactive activity.
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
              <Section title="Interactive Learning Activity" icon={MousePointerClick}>
                <div className="relative">
                  <p className="mb-5 leading-7 text-slate-700">
                    Choose a bandwidth level and a bit rate level, then watch what
                    happens.
                  </p>

                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-6">
                      <SelectorGroup
                        title="Choose bandwidth"
                        value={bandwidthLevel}
                        onChange={(level) => {
                          setBandwidthLevel(level);
                          setBandwidthTouched(true);
                        }}
                      />

                      <SelectorGroup
                        title="Choose bit rate"
                        value={bitrateLevel}
                        onChange={(level) => {
                          setBitrateLevel(level);
                          setBitrateTouched(true);
                        }}
                      />

                      <div
                        className={`rounded-2xl border p-4 ${
                          isBuffering
                            ? "border-amber-200 bg-amber-50"
                            : "border-emerald-200 bg-emerald-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isBuffering ? (
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                          ) : (
                            <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                          )}

                          <div>
                            <h4
                              className={`font-semibold ${
                                isBuffering ? "text-amber-800" : "text-emerald-800"
                              }`}
                            >
                              {isBuffering
                                ? "Not enough bandwidth for this bit rate"
                                : "This bandwidth can support this bit rate"}
                            </h4>
                            <p
                              className={`mt-1 leading-7 ${
                                isBuffering ? "text-amber-700" : "text-emerald-700"
                              }`}
                            >
                              {isBuffering
                                ? "The content is trying to use more data each second than the connection can comfortably carry, so buffering or reduced quality may happen."
                                : "The connection has enough room for this amount of data, so the content can play more smoothly."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#f5dda2] bg-[#fff7df] p-4">
                        <h4 className="font-semibold" style={{ color: "#7a5800" }}>
                          Important note
                        </h4>
                        <p className="mt-2 leading-7" style={{ color: "#7a5800" }}>
                          Bit rate and bandwidth are related, but they are not the same
                          thing. Bit rate is how much data is used each second.
                          Bandwidth is how much data can move through the connection.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm leading-6 text-slate-700">
                          {activityUnlocked
                            ? "Great — you have explored both controls, so you can move to the quiz."
                            : "To unlock the quiz, change both the bandwidth and the bit rate at least once."}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <PipeComparison
                        bandwidthLevel={bandwidthLevel}
                        bitrateLevel={bitrateLevel}
                      />

                      <div className="grid gap-6">
                        <div>
                          <h3 className="mb-3 text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                            What is happening here?
                          </h3>
                          <RelationshipSummary
                            bandwidthLevel={bandwidthLevel}
                            bitrateLevel={bitrateLevel}
                          />
                        </div>

                        <div className="self-start">
                          <VideoPreview
                            bandwidthLevel={bandwidthLevel}
                            bitrateLevel={bitrateLevel}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={resetActivity}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Reset Activity
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
                            You explored both bandwidth and bit rate, and saw how they work
                            together to create smooth playback or buffering.
                          </p>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                              type="button"
                              onClick={resetActivity}
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
                      : "Explore both selectors to unlock the quiz."}
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
                  {quizQuestions.map((q, qIndex) => {
                    const userAnswer = selectedAnswers[qIndex];
                    const wasCorrect = userAnswer === q.answer;

                    return (
                      <div
                        key={q.question}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <h3 className="font-semibold text-slate-900">
                          {qIndex + 1}. {q.question}
                        </h3>

                        <div className="mt-4 grid gap-3">
                          {q.shuffledOptions.map((option) => (
                            <QuizOption
                              key={option}
                              option={option}
                              isSelected={selectedAnswers[qIndex] === option}
                              isCorrect={q.answer === option}
                              submitted={submittedQuiz}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [qIndex]: option,
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

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedQuiz(true)}
                    disabled={!allAnswered}
                    className="rounded-2xl bg-[#073674] px-5 py-2.5 text-white transition hover:bg-[#0a4aa3] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Submit Quiz
                  </button>

                  <button
                    type="button"
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCcw className="h-4 w-4" />
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
                    <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                      Your Score: {score} / {quizQuestions.length}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {score === quizQuestions.length
                        ? "Excellent work — you understand bits, bit rate, bandwidth, and how they work together."
                        : score >= 6
                        ? "Good job — you understand most of the topic, but review the exact difference between bit rate and bandwidth and why buffering happens."
                        : score >= 4
                        ? "Decent effort — revisit the interactive activity and pay attention to how bandwidth and bit rate interact."
                        : "This quiz is meant to reward real understanding. Go back through the module and focus on the relationship between bit rate, bandwidth, and playback."}
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
<a href="/#module3">     <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
                      >
                        Go to Next Module
                        <ChevronRight className="h-4 w-4" />
                      </button></a>
                 
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