import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileVideo,
  Globe,
  HelpCircle,
  Info,
  Lightbulb,
  Lock,
  MousePointerClick,
  RefreshCcw,
  Search,
  Server,
  ShieldCheck,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { markActivityComplete, markQuizPassed } from "../utils/progress";
import m5Diagram from "../assets/m5diagram.png";

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
    title: "The browser wants something",
    text:
      "When you open a webpage, image, or video, the browser needs to ask the server for that resource.",
  },
  {
    step: 2,
    title: "HTTP sends the request",
    text:
      "HTTP is the communication rule that helps the browser send a request to the server.",
  },
  {
    step: 3,
    title: "The server sends a response",
    text:
      "The server replies with a response, such as the file you asked for or an error message.",
  },
  {
    step: 4,
    title: "Webpages have many parts",
    text:
      "A full webpage often includes text, images, and videos, so the browser may need separate requests for all of the parts.",
  },
  {
    step: 5,
    title: "The browser displays the result",
    text:
      "If the response is successful, the browser shows the content. If it fails, the browser may show an error like 404 Not Found.",
  },
];

const keyIdeas = [
  "HTTP stands for HyperText Transfer Protocol.",
  "A browser sends a request to a web server.",
  "The server sends back a response.",
  "A webpage is often made of many parts, so the browser may need to send a request for all of the parts.",
  "HTTPS is the more secure version of HTTP.",
];

const misconceptionCards = [
  {
    wrong: "HTTP is the webpage itself.",
    right:
      "HTTP is the communication rule the browser and server use when asking for and sending content.",
  },
  {
    wrong: "One request always loads the whole webpage.",
    right:
      "A browser may need separate requests for the homepage, images, videos, and other parts.",
  },
  {
    wrong: "HTTP and HTTPS are completely unrelated.",
    right: "HTTPS is the more secure version of HTTP.",
  },
];

const baseQuizQuestions = [
  {
    question:
      "A browser is trying to fully load a webpage. Based on this module, which action best explains what HTTP helps the browser do?",
    options: [
      "Send requests to the server and receive responses for the page and its files",
      "Translate the website name into an IP address before every click",
      "Turn the web server into a browser window",
      "Increase Wi-Fi strength so pages appear faster",
    ],
    answer:
      "Send requests to the server and receive responses for the page and its files",
  },
  {
    question:
      "In the interactive activity, why might the browser need to request the homepage, image, and video separately instead of only sending one request?",
    options: [
      "Because a webpage is often made of multiple parts, so the browser may need separate requests for each part",
      "Because HTTP can only load text and cannot load media files",
      "Because the server can only send one word at a time",
      "Because images and videos are downloaded from DNS, not the server",
    ],
    answer:
      "Because a webpage is often made of multiple parts, so the browser may need separate requests for each part",
  },
  {
    question:
      "A student says, “HTTP is the webpage itself.” Which correction is the most accurate?",
    options: [
      "HTTP is the communication rule used when the browser asks for content and the server responds",
      "HTTP is the visual layout of the homepage after it loads",
      "HTTP is the storage space where websites are kept",
      "HTTP is the error page shown when a file cannot be found",
    ],
    answer:
      "HTTP is the communication rule used when the browser asks for content and the server responds",
  },
  {
    question: "What does a 200 OK response mean in the activity?",
    options: [
      "The server found the requested resource and sent it back to the browser",
      "The browser no longer needs to send any more requests",
      "The server changed the request into a secure HTTPS message",
      "The resource was blocked because the browser used GET",
    ],
    answer:
      "The server found the requested resource and sent it back to the browser",
  },
  {
    question:
      "What does a 404 Not Found response most accurately mean in this module?",
    options: [
      "The browser asked for something the server could not find",
      "The browser failed to connect to Wi-Fi",
      "The server found the file but refused to show it because it was an image",
      "The request was automatically converted into HTTPS",
    ],
    answer: "The browser asked for something the server could not find",
  },
  {
    question:
      "Which sequence best matches the HTTP process shown in your interactive activity?",
    options: [
      "Browser chooses a resource → sends request → server sends response → browser displays the result",
      "Server chooses a resource → browser sends a response → DNS displays the result",
      "Browser displays the page → server checks Wi-Fi → browser sends request",
      "Browser sends request → browser sends response → server displays the file",
    ],
    answer:
      "Browser chooses a resource → sends request → server sends response → browser displays the result",
  },
  {
    question:
      "Why does the activity include both successful resources and a missing page?",
    options: [
      "To show that servers can return different HTTP responses depending on whether the requested resource exists",
      "To show that HTTP only works for errors and not for real webpages",
      "To prove that browsers should never request images or videos",
      "To demonstrate that 404 means the browser has fully loaded the webpage",
    ],
    answer:
      "To show that servers can return different HTTP responses depending on whether the requested resource exists",
  },
  {
    question:
      "What is the best explanation of HTTPS compared with HTTP?",
    options: [
      "HTTPS is the more secure version of HTTP",
      "HTTPS is a different type of server used only for videos",
      "HTTPS removes the need for browser requests",
      "HTTPS is what turns a 404 error into 200 OK",
    ],
    answer: "HTTPS is the more secure version of HTTP",
  },
];

const requestOptions = [
  {
    id: "home",
    label: "Homepage",
    path: "/home",
    method: "GET",
    status: "200 OK",
    type: "page",
    explanation:
      "The browser asked for the main homepage, and the server successfully returned it.",
  },
  {
    id: "image",
    label: "Image",
    path: "/images/soccer.png",
    method: "GET",
    status: "200 OK",
    type: "image",
    explanation:
      "The browser asked for an image file, and the server successfully returned it.",
  },
  {
    id: "video",
    label: "Video",
    path: "/videos/highlights.mp4",
    method: "GET",
    status: "200 OK",
    type: "video",
    explanation:
      "The browser asked for a video file, and the server successfully returned it.",
  },
  {
    id: "missing",
    label: "Missing Page",
    path: "/missing-page",
    method: "GET",
    status: "404 Not Found",
    type: "error",
    explanation:
      "The browser asked for something the server could not find, so the response was 404 Not Found.",
  },
];

const homepageCards = [
  {
    title: "Latest News",
    body: "Read the newest updates and announcements on the website.",
  },
  {
    title: "Featured Lesson",
    body: "Open today's featured networking lesson and classroom activity.",
  },
  {
    title: "Student Portal",
    body: "Access class links, resources, and assignment information.",
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

function BrowserWindow({ path, method, onSend, disabled }) {
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
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
            {method}
          </span>
          <span className="font-mono text-sm font-medium text-slate-800">
            {path}
          </span>
        </div>

        <button
          type="button"
          onClick={onSend}
          disabled={disabled}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 font-medium text-white transition ${
            disabled
              ? "cursor-not-allowed bg-slate-400"
              : "bg-[#073674] hover:bg-[#0a4aa3]"
          }`}
        >
          <ArrowRight className="h-4 w-4" />
          Send Request
        </button>
      </div>
    </div>
  );
}

function RequestButton({ label, active, done, disabled, onClick, icon: Icon }) {
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
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className="font-medium">{label}</span>
        </div>

        {done && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-4 w-4 text-emerald-700" />
          </div>
        )}
      </div>
    </button>
  );
}

function RequestChecklist({ loadedResources }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {requestOptions.map((item) => {
        const done = loadedResources[item.id];
        return (
          <div
            key={item.id}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              done
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{item.label}</span>
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              ) : (
                <span className="text-xs">Not yet</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BrowserCanvas({ loadedResources, currentRequest }) {
  const hasHome = loadedResources.home;
  const hasImage = loadedResources.image;
  const hasVideo = loadedResources.video;
  const hasError = loadedResources.missing;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
          Browser Window
        </h4>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Current: {currentRequest.label}
        </div>
      </div>

      {!hasHome && !hasImage && !hasVideo && !hasError ? (
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center">
          <div>
            <Globe className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-3 text-sm leading-6 text-slate-600">
              No content has loaded yet.
            </p>
          </div>
        </div>
      ) : hasError ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[220px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-5"
        >
          <div className="text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-amber-700" />
            <p className="mt-3 text-3xl font-black text-amber-700">404</p>
            <p className="mt-2 font-semibold text-amber-800">Page Not Found</p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {hasHome && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold" style={{ color: ST_EDS.navy }}>
                    School Website
                  </p>
                  <p className="text-sm text-slate-500">Homepage loaded</p>
                </div>
                <Globe className="h-7 w-7 text-blue-600" />
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {homepageCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <p className="font-semibold text-slate-900">{card.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(hasImage || hasVideo) && (
            <div className="grid gap-4 md:grid-cols-2">
              {hasImage && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">Loaded Image</p>
                    <FileImage className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="relative h-40 w-full bg-gradient-to-br from-sky-100 via-emerald-50 to-blue-100">
                      <div className="absolute inset-x-0 bottom-0 h-14 bg-emerald-300" />
                      <div className="absolute left-1/2 top-5 h-12 w-12 -translate-x-1/2 rounded-full bg-yellow-200 blur-sm" />
                      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md" />
                      <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
                    </div>
                  </div>
                </motion.div>
              )}

              {hasVideo && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">Loaded Video</p>
                    <FileVideo className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                    <div className="relative h-40 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                      <div className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
                        Now Playing
                      </div>

                      <motion.div
                        animate={{ x: [0, 70, 140] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute bottom-14 left-6 h-8 w-8 rounded-full bg-white/90 shadow-lg"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-12 bg-slate-950/70 px-4 py-3">
                        <div className="h-2 rounded-full bg-white/20">
                          <motion.div
                            animate={{ width: ["18%", "72%", "38%"] }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="h-2 rounded-full bg-emerald-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResponseStatusCard({ currentRequest, phase }) {
  if (phase === "choose") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
          What will happen?
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          First the browser chooses a resource, then it sends an HTTP request,
          then the server sends back a response, and finally the browser displays
          the result.
        </p>
      </div>
    );
  }

  if (phase === "sending") {
    return (
      <div className="rounded-2xl border border-[#bfd7ff] bg-[#eef5ff] p-4">
        <h4 className="font-semibold text-[#073674]">Request sent</h4>
        <p className="mt-2 text-sm leading-6 text-[#0a4aa3]">
          The browser is sending an HTTP <span className="font-semibold">{currentRequest.method}</span>{" "}
          request for <span className="font-mono">{currentRequest.path}</span>.
        </p>
      </div>
    );
  }

  if (phase === "response") {
    return (
      <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <h4 className="font-semibold text-violet-900">Server response</h4>
        <p className="mt-2 text-sm leading-6 text-violet-800">
          The server checked the request and returned{" "}
          <span className="font-semibold">{currentRequest.status}</span>.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border p-4 ${
        currentRequest.status === "200 OK"
          ? "border-emerald-200 bg-emerald-50"
          : "border-amber-200 bg-amber-50"
      }`}
    >
      <h4
        className={`font-semibold ${
          currentRequest.status === "200 OK"
            ? "text-emerald-900"
            : "text-amber-900"
        }`}
      >
        Result displayed
      </h4>
      <p
        className={`mt-2 text-sm leading-6 ${
          currentRequest.status === "200 OK"
            ? "text-emerald-800"
            : "text-amber-800"
        }`}
      >
        {currentRequest.explanation}
      </p>
    </div>
  );
}

function PhaseSteps({ phase }) {
  const phaseIndex =
    phase === "choose" ? 0 : phase === "sending" ? 1 : phase === "response" ? 2 : 3;

  const labels = ["Choose", "Request", "Response", "Display"];

  return (
    <div className="grid gap-2 sm:grid-cols-4">
      {labels.map((label, index) => (
        <div
          key={label}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
            phaseIndex === index
              ? "border-[#073674] bg-[#073674] text-white"
              : phaseIndex > index
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          {label}
        </div>
      ))}
    </div>
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

export default function HTTP() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(() =>
    buildShuffledQuiz(baseQuizQuestions)
  );

  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);
  const [phase, setPhase] = useState("choose");

  const [loadedResources, setLoadedResources] = useState({
    home: false,
    image: false,
    video: false,
    missing: false,
  });

  const [modulePage, setModulePage] = useState(0);
  const [overviewUnlocked, setOverviewUnlocked] = useState(false);
  const [activityUnlocked, setActivityUnlocked] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const overviewRef = useRef(null);
  const currentRequest = requestOptions[selectedRequestIndex];

  useEffect(() => {
    if (!loadedResources[currentRequest.id]) {
      setPhase("choose");
    }
  }, [selectedRequestIndex, loadedResources, currentRequest.id]);

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
    const allLoaded =
      loadedResources.home &&
      loadedResources.image &&
      loadedResources.video &&
      loadedResources.missing;

    if (allLoaded) {
      setActivityUnlocked(true);
      setShowCompletionOverlay(true);
      markActivityComplete("/http");
    }
  }, [loadedResources]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers, quizQuestions]);

  useEffect(() => {
    if (submittedQuiz && score >= 5) {
      markQuizPassed("/http");
    }
  }, [submittedQuiz, score]);

  const allAnswered = quizQuestions.every(
    (_, index) => typeof selectedAnswers[index] === "string"
  );

  const completedCount = Object.values(loadedResources).filter(Boolean).length;
  const remainingRequests = requestOptions.filter((item) => !loadedResources[item.id]);

  const handleSendRequest = () => {
    if (phase !== "choose" || loadedResources[currentRequest.id]) return;

    setPhase("sending");

    setTimeout(() => {
      setPhase("response");
    }, 700);

    setTimeout(() => {
      setPhase("displayed");
      setLoadedResources((prev) => ({
        ...prev,
        [currentRequest.id]: true,
      }));
    }, 1300);
  };

  const handleNextRound = () => {
    if (remainingRequests.length === 0) return;

    const nextRequest = remainingRequests[0];
    const nextIndex = requestOptions.findIndex((item) => item.id === nextRequest.id);
    setSelectedRequestIndex(nextIndex);
    setPhase("choose");
  };

  const resetActivity = () => {
    setSelectedRequestIndex(0);
    setPhase("choose");
    setLoadedResources({
      home: false,
      image: false,
      video: false,
      missing: false,
    });
    setActivityUnlocked(false);
    setShowCompletionOverlay(false);
  };

  const resetQuiz = () => {
    setSubmittedQuiz(false);
    setSelectedAnswers({});
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  };

  const RequestIcon =
    currentRequest.type === "image"
      ? FileImage
      : currentRequest.type === "video"
      ? FileVideo
      : currentRequest.type === "error"
      ? HelpCircle
      : Globe;

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
            HyperText Transfer Protocol (HTTP)
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-100">
            Learn how a browser asks a web server for webpages and files, and how
            the server sends a response back.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Globe className="mb-2 h-5 w-5" />
              <p className="font-semibold">Browser requests</p>
              <p className="mt-1 text-sm text-slate-200">
                See how the browser asks for pages, images, and videos.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Server className="mb-2 h-5 w-5" />
              <p className="font-semibold">Server responses</p>
              <p className="mt-1 text-sm text-slate-200">
                Learn how 200 OK and 404 Not Found responses work.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Trophy className="mb-2 h-5 w-5" />
              <p className="font-semibold">Quiz feedback</p>
              <p className="mt-1 text-sm text-slate-200">
                Review your answer choices after submission.
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
                <Section title="What is HTTP?" icon={HelpCircle}>
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
                          HTTP is the rule used when a browser asks a web server for
                          content and the server sends a response back. This module
                          shows that a full webpage is often made of many parts, so
                          the browser may need to send requests for all of the parts.
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
                        Imagine ordering at a café. You ask for something, the staff
                        receive your order, and they give you back what you asked for.
                        HTTP works in a similar way. The browser asks for content,
                        and the server responds.
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

                  <div className="flex rounded-3xl border border-slate-200 bg-white p-5 mt-8 items-center justify-center">
                    <img src={m5Diagram} alt="HTTP diagram" className="max-w-full rounded-2xl" />
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
                      Fun fact
                    </h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "#7a5800" }}>
                      Have you ever seen a website start with HTTP or HTTPS? HTTPS is
                      the more secure version of HTTP.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-[#bfd7ff] bg-[#eef5ff] p-4">
                    <h3 className="font-semibold text-[#073674]">What happens next?</h3>
                    <p className="mt-2 text-sm leading-6 text-[#0a4aa3]">
                      In the next activity, you will test four request types:
                      homepage, image, video, and missing page. To unlock the quiz,
                      you must test all four.
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
              <Section title="Interactive Browser Request Lab" icon={ShieldCheck}>
                <p className="mb-4 leading-7 text-slate-700">
                  Test all four request types to unlock the quiz.
                </p>

                <div className="space-y-4">
                  <BrowserWindow
                    path={currentRequest.path}
                    method={currentRequest.method}
                    onSend={handleSendRequest}
                    disabled={phase !== "choose" || loadedResources[currentRequest.id]}
                  />

                  <PhaseSteps phase={phase} />

                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                        Choose what the browser wants
                      </h3>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {completedCount} / 4 completed
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {requestOptions.map((item, index) => {
                        const Icon =
                          item.type === "image"
                            ? FileImage
                            : item.type === "video"
                            ? FileVideo
                            : item.type === "error"
                            ? HelpCircle
                            : Globe;

                        const done = loadedResources[item.id];

                        return (
                          <RequestButton
                            key={item.id}
                            label={item.label}
                            icon={Icon}
                            active={selectedRequestIndex === index}
                            done={done}
                            disabled={done}
                            onClick={() => setSelectedRequestIndex(index)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <RequestChecklist loadedResources={loadedResources} />

                  <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${phase}-${currentRequest.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                      >
                        <BrowserCanvas
                          loadedResources={loadedResources}
                          currentRequest={currentRequest}
                        />
                      </motion.div>
                    </AnimatePresence>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <RequestIcon className="h-5 w-5 text-slate-700" />
                          <h4 className="font-semibold" style={{ color: ST_EDS.navy }}>
                            Current request details
                          </h4>
                        </div>
                        <div className="space-y-2 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold">Resource:</span>{" "}
                            {currentRequest.label}
                          </p>
                          <p>
                            <span className="font-semibold">Method:</span>{" "}
                            {currentRequest.method}
                          </p>
                          <p>
                            <span className="font-semibold">Path:</span>{" "}
                            <span className="font-mono">{currentRequest.path}</span>
                          </p>
                          <p>
                            <span className="font-semibold">Expected status:</span>{" "}
                            {currentRequest.status}
                          </p>
                        </div>
                      </div>

                      <ResponseStatusCard
                        currentRequest={currentRequest}
                        phase={phase}
                      />

                      <div className="rounded-2xl border border-[#f5dda2] bg-[#fff7df] p-4">
                        <h4 className="font-semibold" style={{ color: "#7a5800" }}>
                          Important note
                        </h4>
                        <p className="mt-2 text-sm leading-6" style={{ color: "#7a5800" }}>
                          A full webpage is often made of many parts. That is why the
                          browser may need to send requests for the homepage, image,
                          and video separately.
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showCompletionOverlay && (
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
                              You successfully tested all four request types.
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

                  <div className="flex flex-wrap justify-center gap-3">
                    {phase === "displayed" && !activityUnlocked && remainingRequests.length > 0 && (
                      <button
                        type="button"
                        onClick={handleNextRound}
                        className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
                      >
                        Try Another Request
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={resetActivity}
                      className="rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                    >
                      <span className="inline-flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Reset Activity
                      </span>
                    </button>
                  </div>
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
                      : "Complete all four request types to unlock the quiz."}
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
                  <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      Your Score: {score} / {quizQuestions.length}
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {score === quizQuestions.length
                        ? "Excellent work — you understand how HTTP helps browsers and servers communicate."
                        : score >= 5
                        ? "Good job — you understand most of HTTP, but review request, response, page parts, status codes, and HTTPS once more."
                        : score >= 3
                        ? "Decent effort — revisit the activity and pay attention to why browsers may need separate requests for different files."
                        : "Review the module and try the quiz again."}
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
<a href="/#module5"> <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-white transition hover:bg-emerald-700"
                      >
                        Go to Next Module
                        <ChevronRight className="h-4 w-4" />
                      </button></a>
                     
                    </div>
                  </div>
                )}
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}