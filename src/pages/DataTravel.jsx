import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Globe,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  Monitor,
  MousePointerClick,
  Package,
  Play,
  RefreshCcw,
  Router,
  Search,
  Server,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { markActivityComplete, markQuizPassed } from "../utils/progress";
import m1Diagram from "../assets/m1diagram.png";
import { useNavigate } from "react-router-dom";

const ST_EDS = {
  navy: "#073674",
  blue: "#0A4AA3",
  blue2: "#0F6DF0",
  gold: "#FEC52F",
  silver: "#D1D2D4",
  white: "#FFFFFF",
  pale: "#F8FAFC",
};

const stops = [
  {
    key: "device",
    title: "Your Device",
    icon: Monitor,
    short:
      "You tap a website or video, so your device creates a request asking for that information.",
    fact:
      "A request is your device asking for a specific piece of online content.",
    badge: "Request created",
    accent: "navy",
  },
  {
    key: "router",
    title: "Router / Wi-Fi",
    icon: Router,
    short:
      "The router helps send the request out of your home or school network toward the internet.",
    fact:
      "The router helps forward traffic in the right direction. It does not store websites.",
    badge: "Request sent to router",
    accent: "gold",
  },
  {
    key: "internet",
    title: "The Internet",
    icon: Globe,
    short:
      "The request travels across many connected networks until it gets closer to the correct server.",
    fact:
      "The internet is a network of networks, not one single machine.",
    badge: "Travelling across internet",
    accent: "blue",
  },
  {
    key: "server",
    title: "Web Server",
    icon: Server,
    short:
      "The server receives the request, finds the correct content, and prepares the data to send back.",
    fact:
      "A server stores and sends things like webpages, videos, images, and game data.",
    badge: "Request reached server",
    accent: "green",
  },
  {
    key: "return",
    title: "Packets Return",
    icon: Package,
    short:
      "The server sends the data back in smaller pieces called packets so your device can rebuild the content.",
    fact:
      "Packets are smaller pieces of data that are easier to send, check, and rebuild.",
    badge: "Packets returning",
    accent: "cyan",
  },
];

const overviewCards = [
  {
    step: 1,
    title: "Your device asks",
    text:
      "When you tap a site or video, your device makes a request for that exact content.",
  },
  {
    step: 2,
    title: "The router forwards it",
    text:
      "The router helps move that request out of your local network toward the wider internet.",
  },
  {
    step: 3,
    title: "The request travels",
    text:
      "The request passes across many connected networks, not just one direct line.",
  },
  {
    step: 4,
    title: "The server responds",
    text:
      "The server finds the right content and gets it ready to send back.",
  },
  {
    step: 5,
    title: "Packets return",
    text:
      "The data comes back in smaller pieces called packets, then your device rebuilds it on screen.",
  },
];

const keyIdeas = [
  "A router helps forward your request out of your local network.",
  "The internet is many connected networks working together.",
  "A server stores and sends online content when it is requested.",
  "Packets are smaller pieces of data that your device can rebuild.",
];

const misconceptionCards = [
  {
    wrong: "The router stores the website.",
    right:
      "The router helps forward the request. The website data is sent back from the server.",
  },
  {
    wrong: "The internet is one giant computer.",
    right:
      "The internet is many connected networks sending information between devices and servers.",
  },
  {
    wrong: "Data comes back as one giant object.",
    right:
      "Data is often split into packets so it is easier to send, check, and rebuild.",
  },
];

const packetFacts = [
  "Smaller pieces are easier to send.",
  "Packets can be checked and rebuilt.",
  "Your device puts the pieces back together.",
];

const rawQuizQuestions = [
  {
    question:
      "A student taps a YouTube video and it begins loading. Which event happens first in the journey shown in this learning resource?",
    options: [
      "The device creates a request for the content",
      "The router breaks the video into packets",
      "The server appears on the user's screen",
      "The internet chooses which app to open",
    ],
    answer: "The device creates a request for the content",
  },
  {
    question: "In this model, what is the router mainly responsible for?",
    options: [
      "Helping send the request out of the local network toward the internet",
      "Storing the whole website until the user opens it",
      "Rebuilding returning packets into the final video",
      "Choosing which files the web server should keep",
    ],
    answer:
      "Helping send the request out of the local network toward the internet",
  },
  {
    question:
      "Which option best explains the role of the internet in the sequence shown?",
    options: [
      "It carries the request across many connected networks",
      "It permanently stores the website content for the server",
      "It replaces the router once the request leaves home",
      "It converts the request into a video before sending it back",
    ],
    answer: "It carries the request across many connected networks",
  },
  {
    question: "A web server in this lesson is best described as the part that:",
    options: [
      "Receives the request and sends back the needed data",
      "Builds the request before it leaves the device",
      "Connects the user to Wi-Fi and checks the password",
      "Displays the finished video directly onto the screen",
    ],
    answer: "Receives the request and sends back the needed data",
  },
  {
    question:
      "Why does the lesson say data often returns in packets instead of one giant piece?",
    options: [
      "Smaller pieces are easier to send, check, and rebuild",
      "Routers can only understand information when it is colour-coded",
      "Servers are unable to send full files over the internet",
      "The internet deletes large files unless they are split first",
    ],
    answer: "Smaller pieces are easier to send, check, and rebuild",
  },
  {
    question: "Which sequence matches the full journey most accurately?",
    options: [
      "Device creates request → Router sends it outward → Request travels across the internet → Server finds data → Packets return to device",
      "Router creates request → Device sends it to server → Internet stores it → Packets return to router → Device loads content",
      "Server creates request → Internet sends it to the router → Device receives packets → Router loads content",
      "Device creates request → Server receives it immediately → Router checks packets → Internet loads the video",
    ],
    answer:
      "Device creates request → Router sends it outward → Request travels across the internet → Server finds data → Packets return to device",
  },
  {
    question:
      'A user says, “My device gets the website straight from the router.” Based on the resource, what is the best correction?',
    options: [
      "The router helps forward the request, but the actual website data is sent back from the server",
      "The router stores every website and sends the correct one when asked",
      "The router turns into a server once the request leaves the house",
      "The router is the same thing as the internet, so both answers are correct",
    ],
    answer:
      "The router helps forward the request, but the actual website data is sent back from the server",
  },
  {
    question:
      "At the final stage of the animation, what allows the video or webpage to actually appear on screen?",
    options: [
      "The returning packets reach the device and are put back together",
      "The internet finishes deciding which server should own the file",
      "The router converts the request into a playable file",
      "The server joins the local Wi-Fi and loads itself on the monitor",
    ],
    answer:
      "The returning packets reach the device and are put back together",
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

function buildShuffledQuiz() {
  return rawQuizQuestions.map((question) => ({
    ...question,
    shuffledOptions: shuffleArray(question.options),
  }));
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[24px] sm:rounded-[28px] lg:rounded-[30px] border border-white/20 bg-white p-4 shadow-xl sm:p-5 lg:p-6">
      <div className="mb-4 flex items-center gap-3 sm:mb-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl sm:h-11 sm:w-11"
          style={{ backgroundColor: `${ST_EDS.gold}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: ST_EDS.navy }} />
        </div>
        <h2 className="text-lg font-bold sm:text-xl" style={{ color: ST_EDS.navy }}>
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function accentClasses(accent) {
  switch (accent) {
    case "navy":
      return {
        soft: "border-[#bcd0ef] bg-[#eef4ff] text-[#073674]",
        pill: "bg-[#d9e8ff] text-[#073674]",
        line: "bg-[#073674]",
        button: "bg-[#073674] hover:bg-[#0a4aa3]",
        iconBg: "bg-[#eef4ff]",
        iconColor: "text-[#073674]",
      };
    case "gold":
      return {
        soft: "border-[#f5dda2] bg-[#fff7df] text-[#7a5800]",
        pill: "bg-[#ffe7a6] text-[#7a5800]",
        line: "bg-[#FEC52F]",
        button: "bg-[#c99600] hover:bg-[#b38800]",
        iconBg: "bg-[#fff5d6]",
        iconColor: "text-[#7a5800]",
      };
    case "blue":
      return {
        soft: "border-[#bfd7ff] bg-[#eef5ff] text-[#0a4aa3]",
        pill: "bg-[#dce9ff] text-[#0a4aa3]",
        line: "bg-[#0f6df0]",
        button: "bg-[#0f6df0] hover:bg-[#0c5dd0]",
        iconBg: "bg-[#eef5ff]",
        iconColor: "text-[#0a4aa3]",
      };
    case "green":
      return {
        soft: "border-emerald-200 bg-emerald-50 text-emerald-800",
        pill: "bg-emerald-100 text-emerald-700",
        line: "bg-emerald-500",
        button: "bg-emerald-600 hover:bg-emerald-700",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-700",
      };
    default:
      return {
        soft: "border-cyan-200 bg-cyan-50 text-cyan-800",
        pill: "bg-cyan-100 text-cyan-700",
        line: "bg-cyan-500",
        button: "bg-cyan-600 hover:bg-cyan-700",
        iconBg: "bg-cyan-50",
        iconColor: "text-cyan-700",
      };
  }
}

function StageChip({ item, active, complete, onClick }) {
  const Icon = item.icon;
  const accent = accentClasses(item.accent);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-3 text-left transition sm:px-4 ${
        active
          ? `${accent.soft} shadow-sm`
          : complete
          ? "border-[#d1d2d4] bg-[#f8fafc] text-slate-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <Icon className={`h-5 w-5 ${active ? accent.iconColor : "text-slate-600"}`} />
        {complete ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        ) : active ? (
          <Circle className="h-5 w-5" />
        ) : null}
      </div>
      <p className="text-sm font-semibold leading-5">{item.title}</p>
    </button>
  );
}

function Packet({ label }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-100 text-xs font-bold text-cyan-700 shadow-sm">
      {label}
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
  const pages = [{ label: "Overview" }, { label: "Activity" }, { label: "Quiz" }];

  return (
    <div className="rounded-[24px] sm:rounded-[28px] lg:rounded-[30px] border border-white/20 bg-white p-4 shadow-xl">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold" style={{ color: ST_EDS.navy }}>
          Module Progress
        </h2>
        <span className="text-sm text-slate-500">Page {currentPage + 1} of 3</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {pages.map((page, index) => {
          const active = currentPage === index;
          const complete = currentPage > index;

          return (
            <div
              key={page.label}
              className={`rounded-2xl border p-3 sm:p-4 ${
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

export default function DataTravel() {
  const navigate = useNavigate();
  const [currentStop, setCurrentStop] = useState(0);
  const [packetsArrived, setPacketsArrived] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [modulePage, setModulePage] = useState(0);
  const [overviewUnlocked, setOverviewUnlocked] = useState(false);
  const [activityUnlocked, setActivityUnlocked] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(() => buildShuffledQuiz());
  const overviewRef = useRef(null);

  const stop = stops[currentStop];
  const accent = accentClasses(stop.accent);

  useEffect(() => {
    if (currentStop === 4) {
      setPacketsArrived(false);
      const timer = setTimeout(() => setPacketsArrived(true), 1800);
      return () => clearTimeout(timer);
    }
    setPacketsArrived(false);
  }, [currentStop]);

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
    if (currentStop === stops.length - 1 && packetsArrived) {
      setActivityUnlocked(true);
      setShowCompletionOverlay(true);
      markActivityComplete("/data-travel");
    }
  }, [currentStop, packetsArrived]);

  const score = useMemo(() => {
    return quizQuestions.reduce((total, q, index) => {
      return total + (selectedAnswers[index] === q.answer ? 1 : 0);
    }, 0);
  }, [quizQuestions, selectedAnswers]);

  useEffect(() => {
    if (submittedQuiz && score >= 6) {
      markQuizPassed("/data-travel");
    }
  }, [submittedQuiz, score]);

  const allAnswered = quizQuestions.every(
    (_, index) => typeof selectedAnswers[index] === "string"
  );

  const progressPercent = (currentStop / (stops.length - 1)) * 100;
  const stageCenters = ["12.5%", "37.5%", "62.5%", "87.5%"];
  const requestLeft = currentStop <= 3 ? stageCenters[currentStop] : stageCenters[3];
  const progressWidth =
    currentStop === 0 ? "0%" : currentStop === 1 ? "25%" : currentStop === 2 ? "50%" : "75%";

  const title =
    currentStop === 4 && packetsArrived
      ? "Your device rebuilds the content"
      : currentStop === 4
      ? "Packets are travelling back"
      : stop.title;

  const body =
    currentStop === 4 && packetsArrived
      ? "The packets have arrived back at your device. Your device puts the pieces together so the video or webpage can appear on screen."
      : currentStop === 4
      ? "The server has sent the data back in smaller pieces called packets. They are travelling through the network toward your device."
      : stop.short;

  const resetActivity = () => {
    setCurrentStop(0);
    setPacketsArrived(false);
    setActivityUnlocked(false);
    setShowCompletionOverlay(false);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
    setQuizQuestions(buildShuffledQuiz());
  };

  const goToNextModule = () => {
    navigate("/");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${ST_EDS.navy} 0%, ${ST_EDS.blue} 35%, ${ST_EDS.blue2} 100%)`,
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-5 sm:gap-7 sm:py-6 md:px-6 lg:gap-8 lg:py-8">
        <header className="rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] border border-white/20 bg-white/10 p-4 text-white shadow-2xl backdrop-blur-sm sm:p-5 lg:p-6">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold sm:px-4 sm:text-sm"
            style={{ backgroundColor: ST_EDS.gold, color: ST_EDS.navy }}
          >
            St Edmund&apos;s College Canberra
          </span>

          <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
            How Data Travels Through the Internet
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-100 sm:text-base sm:leading-7">
            Follow a clear step-by-step explanation, learn through visuals, then test
            your understanding in an interactive activity and quiz.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <BookOpen className="mb-2 h-5 w-5" />
              <p className="font-semibold">Clear explanation</p>
              <p className="mt-1 text-sm text-slate-200">
                Learn the full journey from request to returning packets.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <MousePointerClick className="mb-2 h-5 w-5" />
              <p className="font-semibold">Interactive activity</p>
              <p className="mt-1 text-sm text-slate-200">
                Step through the network journey and watch what happens.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:col-span-2 xl:col-span-1">
              <Trophy className="mb-2 h-5 w-5" />
              <p className="font-semibold">Quiz challenge</p>
              <p className="mt-1 text-sm text-slate-200">
                Check your understanding with answer feedback after submission.
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
                  <div className="rounded-3xl border border-[#dbe7fb] bg-[#f5f9ff] p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: "#dce9ff" }}
                      >
                        <Target className="h-5 w-5" style={{ color: ST_EDS.navy }} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold sm:text-lg" style={{ color: ST_EDS.navy }}>
                          What you are learning
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                          This module explains the basic journey of data when you open a
                          website or video: your device sends a request, the request moves
                          through the network, the server responds, and the data returns in
                          packets so your screen can load the content.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {overviewCards.map((card) => (
                      <div
                        key={card.step}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div
                          className="mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: ST_EDS.navy }}
                        >
                          {card.step}
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: ST_EDS.navy }}>
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{card.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" style={{ color: ST_EDS.gold }} />
                        <h3 className="text-base font-semibold sm:text-lg" style={{ color: ST_EDS.navy }}>
                          Real-life analogy
                        </h3>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                        Think about ordering food online. You place the order, the
                        restaurant receives it, prepares it, and sends it back to you.
                        The internet works in a similar way. Your device asks for
                        information, the server finds it, and the data returns so your
                        screen can show it.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                      <div className="flex items-center gap-2">
                        <Info className="h-5 w-5" style={{ color: ST_EDS.blue }} />
                        <h3 className="text-base font-semibold sm:text-lg" style={{ color: ST_EDS.navy }}>
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

                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-3 sm:p-5">
                    <img
                      src={m1Diagram}
                      alt="Data travel diagram"
                      className="w-full rounded-2xl"
                    />
                  </div>

                  <div className="mt-8 rounded-3xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-rose-700" />
                      <h3 className="text-base font-semibold text-rose-900 sm:text-lg">
                        Common mistakes to avoid
                      </h3>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {misconceptionCards.map((item) => (
                        <div key={item.wrong} className="rounded-2xl bg-white/80 p-4">
                          <p className="text-sm font-semibold text-rose-800">Incorrect idea</p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">{item.wrong}</p>
                          <p className="mt-3 text-sm font-semibold text-emerald-700">
                            Better explanation
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-700">{item.right}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl border border-[#f5dda2] bg-[#fff7df] p-4">
                    <h3 className="font-semibold" style={{ color: "#7a5800" }}>
                      What happens next?
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "#7a5800" }}>
                      On the next page, you will trace the request as it moves from your
                      device to the server and back again as packets.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      Ready to continue?
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Scroll to the bottom of this page to unlock the next part of the
                      module.
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
                  <p className="mb-5 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
                    Move through each step to follow the request to the server, then watch
                    the packets return and rebuild the content on your device.
                  </p>

                  <div className="mb-5 flex items-center justify-between gap-3 text-sm text-slate-600">
                    <span>Journey progress</span>
                    <span>
                      Stop {currentStop + 1} of {stops.length}
                    </span>
                  </div>

                  <div className="mb-6 h-3 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      className={`h-full rounded-full ${accent.line}`}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.35 }}
                    />
                  </div>

                  <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {stops.map((item, index) => (
                      <StageChip
                        key={item.key}
                        item={item}
                        active={currentStop === index}
                        complete={currentStop > index}
                        onClick={() => setCurrentStop(index)}
                      />
                    ))}
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:p-6">
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-base font-semibold sm:text-lg" style={{ color: ST_EDS.navy }}>
                          Packet Journey
                        </h3>
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${accent.pill}`}
                        >
                          {stop.badge}
                        </span>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 sm:px-4 md:px-5 lg:px-6">
                        <div className="hidden lg:block">
                          <div className="relative pt-10">
                            <div className="absolute left-[12.5%] top-[70px] h-1 w-[75%] rounded-full bg-slate-200" />

                            <motion.div
                              className={`absolute left-[12.5%] top-[68px] h-[6px] rounded-full ${accent.line}/30`}
                              animate={{ width: progressWidth }}
                              transition={{ duration: 0.35 }}
                            />

                            {currentStop <= 3 && (
                              <motion.div
                                className="pointer-events-none absolute top-[16px] z-20 -translate-x-1/2"
                                animate={{ left: requestLeft }}
                                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                              >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">
                                  <Search className="h-4 w-4 text-slate-700" />
                                </div>
                              </motion.div>
                            )}

                            {currentStop === 4 &&
                              !packetsArrived &&
                              [0, 1, 2].map((packet) => (
                                <motion.div
                                  key={packet}
                                  className="pointer-events-none absolute top-[16px] z-20 -translate-x-1/2"
                                  initial={{ left: "87.5%", opacity: 0 }}
                                  animate={{
                                    left: ["87.5%", "72%", "58%", "44%", "30%", "12.5%"],
                                    opacity: [0, 1, 1, 1, 1, 1],
                                  }}
                                  transition={{
                                    duration: 1.7,
                                    delay: packet * 0.12,
                                    ease: "easeInOut",
                                  }}
                                >
                                  <Packet label={packet + 1} />
                                </motion.div>
                              ))}

                            {currentStop === 4 && packetsArrived && (
                              <div className="pointer-events-none absolute left-[12.5%] top-[12px] z-20 -translate-x-1/2">
                                <div className="relative h-10 w-[74px]">
                                  {[1, 2, 3].map((label, i) => (
                                    <motion.div
                                      key={label}
                                      initial={{ opacity: 0, x: 8, y: 4 }}
                                      animate={{ opacity: 1, x: 0, y: 0 }}
                                      transition={{ delay: i * 0.08 }}
                                      className="absolute top-0"
                                      style={{ left: `${i * 18}px` }}
                                    >
                                      <Packet label={label} />
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-4 gap-4">
                              {stops.slice(0, 4).map((item, index) => {
                                const Icon = item.icon;
                                const isActive =
                                  (currentStop === 0 && index === 0) ||
                                  (currentStop === 1 && index === 1) ||
                                  (currentStop === 2 && index === 2) ||
                                  (currentStop === 3 && index === 3) ||
                                  (currentStop === 4 && index === 3);

                                const isArrivalTarget =
                                  currentStop === 4 && packetsArrived && index === 0;

                                return (
                                  <div
                                    key={item.key}
                                    className="flex flex-col items-center text-center"
                                  >
                                    <motion.div
                                      animate={{
                                        scale: isActive || isArrivalTarget ? 1.06 : 1,
                                        y: isActive || isArrivalTarget ? -2 : 0,
                                      }}
                                      className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border ${
                                        isArrivalTarget
                                          ? "border-blue-200 bg-blue-100 text-blue-800"
                                          : isActive
                                          ? `${accent.soft}`
                                          : "border-slate-200 bg-white text-slate-500"
                                      }`}
                                    >
                                      <Icon className="h-7 w-7" />
                                    </motion.div>
                                    <p className="mt-3 max-w-[110px] text-sm font-medium leading-5 text-slate-700">
                                      {item.title}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-3 lg:hidden">
                          {stops.map((item, index) => {
                            const Icon = item.icon;
                            const active = currentStop === index;
                            const complete = currentStop > index;

                            return (
                              <div
                                key={item.key}
                                className={`rounded-2xl border p-4 ${
                                  active
                                    ? accent.soft
                                    : complete
                                    ? "border-slate-300 bg-slate-100"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">{item.title}</p>
                                    <p className="text-sm text-slate-500">Stop {index + 1}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {currentStop === 4 && packetsArrived && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 rounded-2xl border border-slate-200 bg-white p-4"
                          >
                            <div className="mb-3 flex items-center gap-2">
                              <Play className="h-5 w-5 text-red-500" />
                              <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
                                Content now loaded
                              </h4>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-slate-200">
                              <div className="aspect-video bg-slate-900 p-4">
                                <div className="flex h-full flex-col justify-between">
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white sm:text-xs">
                                      Website / video
                                    </span>
                                    <span className="text-[11px] text-slate-300 sm:text-xs">
                                      Rebuilt from packets
                                    </span>
                                  </div>

                                  <div className="flex flex-1 items-center justify-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg sm:h-16 sm:w-16">
                                      <Play className="ml-1 h-6 w-6 fill-white text-white sm:h-7 sm:w-7" />
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      Online content is now visible
                                    </p>
                                    <p className="mt-1 text-xs text-slate-300">
                                      The packets reached your device and the content could now
                                      be shown on screen.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
                      <div>
                        <h3 className="text-base font-semibold sm:text-lg" style={{ color: ST_EDS.navy }}>
                          What is happening here?
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Read the explanation, then move to the next stop.
                        </p>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${currentStop}-${packetsArrived}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            className={`mt-5 rounded-2xl border p-4 ${accent.soft}`}
                          >
                            <h4 className="font-semibold">{title}</h4>
                            <p className="mt-2 text-sm leading-6 sm:text-base sm:leading-7">{body}</p>
                          </motion.div>
                        </AnimatePresence>

                        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                          <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
                            Quick fact
                          </h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{stop.fact}</p>
                        </div>

                        {currentStop === 4 && (
                          <div className="mt-4 rounded-2xl bg-cyan-50 p-4">
                            <h4 className="font-semibold text-cyan-800">Why packets matter</h4>
                            <div className="mt-3 grid gap-2">
                              {packetFacts.map((fact) => (
                                <div
                                  key={fact}
                                  className="rounded-xl bg-white/70 px-3 py-2 text-sm text-cyan-800"
                                >
                                  {fact}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                          <button
                            type="button"
                            onClick={() => setCurrentStop((prev) => Math.max(0, prev - 1))}
                            disabled={currentStop === 0}
                            className="rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Previous
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setCurrentStop((prev) => Math.min(stops.length - 1, prev + 1))
                            }
                            disabled={currentStop === stops.length - 1}
                            className={`rounded-2xl px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${accent.button}`}
                          >
                            Next
                          </button>
                        </div>

                        <div className="mt-3 flex justify-center">
                          <button
                            type="button"
                            onClick={resetActivity}
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
                          >
                            <RefreshCcw className="h-4 w-4" />
                            Restart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-3">
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
                        className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-slate-900/45 p-3 sm:p-4 backdrop-blur-[3px]"
                      >
                        <motion.div
                          initial={{ scale: 0.96, y: 10, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0.98, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="w-full max-w-md rounded-3xl bg-white p-5 text-center shadow-2xl sm:p-6"
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

                          <h3 className="mt-4 text-xl font-bold sm:text-2xl" style={{ color: ST_EDS.navy }}>
                            Activity Complete
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            You successfully completed the full data journey from request
                            to returning packets.
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

                <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <button
                    type="button"
                    onClick={() => setModulePage(0)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 transition hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous Page
                  </button>

                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                    {activityUnlocked
                      ? "Activity complete — you can move to the quiz."
                      : "Complete the full animation to unlock the quiz."}
                  </div>

                  <button
                    type="button"
                    onClick={() => setModulePage(2)}
                    disabled={!activityUnlocked}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-white transition ${
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
                <div className="space-y-5">
                  {quizQuestions.map((q, qIndex) => {
                    const userAnswer = selectedAnswers[qIndex];
                    const wasCorrect = userAnswer === q.answer;

                    return (
                      <div
                        key={q.question}
                        className="rounded-2xl border border-slate-200 p-4 sm:p-5"
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

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
                    className="rounded-2xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-50"
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
                    className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5"
                  >
                    <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                      Your Score: {score} / {quizQuestions.length}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                      {score === quizQuestions.length
                        ? "Excellent work — you clearly understood the full data journey and the role of each part."
                        : score >= 6
                        ? "Good effort — you understand most of the journey, but review the exact role of the router, server, and packets."
                        : score >= 4
                        ? "Decent start — some of the options were very close, so go back through the interactive activity and check the sequence again."
                        : "This quiz is meant to reward real understanding. Revisit the learning activity carefully, especially the order of steps and why packets matter."}
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