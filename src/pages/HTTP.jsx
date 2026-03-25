import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileImage,
  FileVideo,
  Globe,
  HelpCircle,
  Lock,
  RefreshCcw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const quizQuestions = [
  {
    question: "What does HTTP stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Technology Transfer Process",
      "Home Tool Transfer Program",
    ],
    answer: "HyperText Transfer Protocol",
  },
  {
    question: "What does HTTP help a browser do?",
    options: [
      "Send a request to a server and receive a response",
      "Charge the computer battery",
      "Make Wi-Fi signals stronger",
    ],
    answer: "Send a request to a server and receive a response",
  },
  {
    question: "What does a browser often need to do to fully load a webpage?",
    options: [
      "Send separate requests for different parts like images and videos",
      "Only ask for one thing and everything appears automatically",
      "Turn the server into Wi-Fi",
    ],
    answer: "Send separate requests for different parts like images and videos",
  },
  {
    question: "What is HTTPS?",
    options: [
      "The secure version of HTTP",
      "A type of keyboard cable",
      "A way to remove web servers",
    ],
    answer: "The secure version of HTTP",
  },
];

const keyIdeas = [
  "HTTP stands for HyperText Transfer Protocol.",
  "A browser sends a request to a web server.",
  "The server sends back a response.",
  "A webpage is often made of many parts, so the browser may need to send a request for all of the parts.",
  "HTTPS is the more secure version of HTTP.",
];

const requestOptions = [
  {
    id: "home",
    label: "Homepage",
    path: "/home",
    method: "GET",
    status: "200 OK",
    responseTitle: "Homepage returned",
    responseText:
      "The server found the homepage and sent it back to the browser.",
    type: "page",
  },
  {
    id: "image",
    label: "Image",
    path: "/images/soccer.png",
    method: "GET",
    status: "200 OK",
    responseTitle: "Image returned",
    responseText:
      "The server found the image file and sent it back to the browser.",
    type: "image",
  },
  {
    id: "video",
    label: "Video",
    path: "/videos/highlights.mp4",
    method: "GET",
    status: "200 OK",
    responseTitle: "Video returned",
    responseText:
      "The server found the video file and sent it back to the browser.",
    type: "video",
  },
  {
    id: "missing",
    label: "Missing Page",
    path: "/missing-page",
    method: "GET",
    status: "404 Not Found",
    responseTitle: "Page not found",
    responseText:
      "The server could not find the page the browser asked for.",
    type: "error",
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
              : "bg-slate-900 hover:bg-slate-800"
          }`}
        >
          <ArrowRight className="h-4 w-4" />
          Send Request
        </button>
      </div>
    </div>
  );
}

function RequestButton({ label, active, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{label}</span>
      </div>
    </button>
  );
}

function StageCard({
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
      : tone === "amber"
      ? "border-amber-200 bg-amber-50 text-amber-800"
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

function BrowserCanvas({ loadedResources, currentRequest }) {
  const hasHome = loadedResources.home;
  const hasImage = loadedResources.image;
  const hasVideo = loadedResources.video;
  const hasError = loadedResources.missing;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-900">Browser Window</h4>
          <p className="text-sm text-slate-500">
            Loaded content stays on the page as new parts are requested.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Current: {currentRequest.label}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-800">
        To fully load a webpage, the browser may need to send a request for all
        of the parts, such as the page, images, and videos.
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        {!hasHome && !hasImage && !hasVideo && !hasError ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white text-center">
            <div>
              <Globe className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 text-sm leading-6 text-slate-600">
                No content has loaded yet. Send a request to start building the
                browser page.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {hasHome && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      School Website
                    </p>
                    <p className="text-sm text-slate-500">
                      Homepage loaded in the browser
                    </p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {homepageCards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Loaded Image
                        </p>
                        <p className="text-sm text-slate-500">soccer.png</p>
                      </div>
                      <FileImage className="h-6 w-6 text-blue-600" />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="relative h-48 w-full bg-gradient-to-br from-sky-100 via-emerald-50 to-blue-100">
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-emerald-300" />
                        <div className="absolute left-1/2 top-7 h-14 w-14 -translate-x-1/2 rounded-full bg-yellow-200 blur-sm" />
                        <div className="absolute left-8 bottom-8 h-24 w-24 rounded-full border-[9px] border-white bg-white shadow-md">
                          <div className="absolute inset-3 rounded-full border-4 border-slate-800" />
                          <div className="absolute inset-[28px] rounded-full bg-slate-800" />
                        </div>
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md" />
                        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-800" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {hasVideo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          Loaded Video
                        </p>
                        <p className="text-sm text-slate-500">highlights.mp4</p>
                      </div>
                      <FileVideo className="h-6 w-6 text-emerald-600" />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                      <div className="relative h-48 w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_35%)]" />
                        <div className="absolute inset-x-0 bottom-0 h-14 bg-slate-950/70" />

                        <motion.div
                          animate={{ x: [0, 80, 160] }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute bottom-16 left-6 h-9 w-9 rounded-full bg-white/90 shadow-lg"
                        />
                        <motion.div
                          animate={{ x: [0, 65, 140] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute bottom-20 left-16 h-7 w-7 rounded-full bg-emerald-300/90 shadow-lg"
                        />
                        <motion.div
                          animate={{ x: [0, 95, 180] }}
                          transition={{
                            duration: 2.7,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute bottom-12 left-10 h-5 w-5 rounded-full bg-blue-300/90 shadow-lg"
                        />

                        <div className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white">
                          Now Playing
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 py-3 text-white">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                            <FileVideo className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
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
                            <p className="mt-2 text-xs font-medium">
                              highlights.mp4 loaded in the browser
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {hasError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <div className="text-center">
                  <p className="text-3xl font-black text-amber-700">404</p>
                  <p className="mt-2 font-semibold text-amber-800">
                    Page Not Found
                  </p>
                  <p className="mt-2 text-sm text-amber-700">
                    The browser keeps the content that already loaded, but this new
                    request could not be found by the server.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewSummary({ currentRequest }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <StatusBox
        title={currentRequest.responseTitle}
        body={currentRequest.responseText}
        tone={currentRequest.status === "404 Not Found" ? "warning" : "success"}
      />
      <StatusBox
        title="Why this matters"
        body="HTTP lets the browser ask for content, and the server answers with a response the browser can show. To fully load a webpage, the browser often has to send separate requests for all of the parts, like the page itself, images, and videos."
        tone="info"
      />
    </div>
  );
}

export default function HTTP() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);
  const [phase, setPhase] = useState("choose");
  const [message, setMessage] = useState(
    "Choose what the browser wants, then send an HTTP request to the server."
  );
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const [loadedResources, setLoadedResources] = useState({
    home: false,
    image: false,
    video: false,
    missing: false,
  });

  const currentRequest = requestOptions[selectedRequestIndex];

  useEffect(() => {
    setPhase("choose");
    setMessage(
      "Choose what the browser wants, then send an HTTP request to the server."
    );
  }, [selectedRequestIndex]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers]);

  const stepLabels = [
    "Choose Resource",
    "Send Request",
    "Server Response",
    "Browser Display",
  ];

  const activeStep =
    phase === "choose"
      ? 0
      : phase === "sending"
      ? 1
      : phase === "response"
      ? 2
      : 3;

  const statusTone =
    phase === "displayed"
      ? currentRequest.status === "404 Not Found"
        ? "warning"
        : "success"
      : phase === "sending" || phase === "response"
      ? "info"
      : "neutral";

  const statusTitle =
    phase === "choose"
      ? "Step 1: Choose a resource"
      : phase === "sending"
      ? "Step 2: Browser sends an HTTP request"
      : phase === "response"
      ? "Step 3: Server sends an HTTP response"
      : "Step 4: Browser displays the result";

  const handleSendRequest = () => {
    setPhase("sending");
    setMessage(
      `The browser is sending ${currentRequest.method} ${currentRequest.path} to the server.`
    );

    setTimeout(() => {
      setPhase("response");
      setMessage(
        `The server responded with ${currentRequest.status}. The content is being sent back to the browser.`
      );
    }, 950);

    setTimeout(() => {
      setPhase("displayed");
      setRoundsCompleted((prev) => prev + 1);
      setLoadedResources((prev) => ({
        ...prev,
        [currentRequest.id]: true,
      }));
      setMessage(
        currentRequest.status === "404 Not Found"
          ? "The server could not find that page, so the browser shows a 404 error."
          : `The browser received the ${currentRequest.label.toLowerCase()} and added it to the page. Remember, browsers often need to send separate HTTP requests for all of the parts of a webpage.`
      );
    }, 1700);
  };

  const handleNextRound = () => {
    const nextIndex = (selectedRequestIndex + 1) % requestOptions.length;
    setSelectedRequestIndex(nextIndex);
  };

  const resetActivity = () => {
    setSelectedRequestIndex(0);
    setPhase("choose");
    setMessage(
      "Choose what the browser wants, then send an HTTP request to the server."
    );
    setRoundsCompleted(0);
    setLoadedResources({
      home: false,
      image: false,
      video: false,
      missing: false,
    });
  };

  const RequestIcon =
    currentRequest.type === "image"
      ? FileImage
      : currentRequest.type === "video"
      ? FileVideo
      : currentRequest.type === "error"
      ? HelpCircle
      : Globe;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 4
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            HyperText Transfer Protocol (HTTP)
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Learn how a browser asks a web server for webpages and files, and how
            the server sends a response back.
          </p>
        </header>

        <Section title="What is HTTP?" icon={HelpCircle}>
          <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                <Sparkles className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Fun fact</h3>
                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  Have you ever seen a website say <span className="font-semibold">HTTP</span> or{" "}
                  <span className="font-semibold">HTTPS</span>? HTTPS is the more
                  secure version of HTTP. The extra <span className="font-semibold">S</span> stands for
                  secure.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="leading-7 text-slate-700">
                Have you ever seen a website start with HTTP or HTTPS in the
                address bar? HTTP is a rule used for communication between a
                browser and a web server. The browser sends a request for a
                webpage or file, and the server sends back a response.
              </p>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Real-life analogy
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  Imagine ordering at a café. You ask for something, the staff
                  receive your order, and they give you back what you asked for.
                  HTTP works in a similar way. The browser asks for a webpage or
                  file, and the server sends back the result.
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <h3 className="text-lg font-semibold text-blue-900">
                  Important idea
                </h3>
                <p className="mt-2 text-sm leading-6 text-blue-800">
                  A browser does not always send just one request. To fully load a
                  webpage, it may have to send a request for all of the parts,
                  such as the page itself, images, and videos.
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

        <Section title="Interactive Browser Request Lab" icon={ShieldCheck}>
          <p className="mb-5 leading-7 text-slate-700">
            Choose a resource, send an HTTP request, see the server response, and
            keep building the browser page as new content loads. This shows that
            the browser may need to send separate requests for all of the parts of
            a webpage.
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

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <BrowserWindow
                path={currentRequest.path}
                method={currentRequest.method}
                onSend={handleSendRequest}
                disabled={phase !== "choose"}
              />

              <div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                  Choose what the browser wants
                </h3>
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

                    return (
                      <RequestButton
                        key={item.id}
                        label={item.label}
                        icon={Icon}
                        active={selectedRequestIndex === index}
                        onClick={() => setSelectedRequestIndex(index)}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    HTTP request activity
                  </h3>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Rounds completed: {roundsCompleted}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {phase === "choose" && (
                    <motion.div
                      key="choose"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                        <RequestIcon className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          Pick a resource, then click{" "}
                          <span className="font-semibold">Send Request</span> to see
                          how HTTP works between the browser and server.
                        </p>
                      </div>

                      <BrowserCanvas
                        loadedResources={loadedResources}
                        currentRequest={currentRequest}
                      />
                    </motion.div>
                  )}

                  {phase === "sending" && (
                    <motion.div
                      key="sending"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                        <div className="grid items-center gap-4 md:grid-cols-[120px_minmax(0,1fr)_120px]">
                          <div className="rounded-2xl border border-blue-200 bg-white p-4 text-center">
                            <Globe className="mx-auto h-6 w-6 text-blue-700" />
                            <p className="mt-2 text-sm font-semibold text-blue-900">
                              Browser
                            </p>
                          </div>

                          <div className="relative h-16">
                            <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-200" />
                            <motion.div
                              initial={{ left: "5%", opacity: 0 }}
                              animate={{ left: "82%", opacity: 1 }}
                              transition={{ duration: 0.9, ease: "easeInOut" }}
                              className="absolute top-1/2 -translate-y-1/2"
                            >
                              <div className="rounded-2xl border border-blue-200 bg-white px-4 py-2 text-center shadow-sm">
                                <p className="text-xs font-bold text-blue-800">
                                  {currentRequest.method}
                                </p>
                                <p className="font-mono text-xs text-slate-700">
                                  {currentRequest.path}
                                </p>
                              </div>
                            </motion.div>
                          </div>

                          <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-center">
                            <Server className="mx-auto h-6 w-6 text-emerald-700" />
                            <p className="mt-2 text-sm font-semibold text-emerald-900">
                              Server
                            </p>
                          </div>
                        </div>
                      </div>

                      <BrowserCanvas
                        loadedResources={loadedResources}
                        currentRequest={currentRequest}
                      />
                    </motion.div>
                  )}

                  {phase === "response" && (
                    <motion.div
                      key="response"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="grid items-center gap-4 md:grid-cols-[120px_minmax(0,1fr)_120px]">
                          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-center">
                            <Globe className="mx-auto h-6 w-6 text-blue-700" />
                            <p className="mt-2 text-sm font-semibold text-blue-900">
                              Browser
                            </p>
                          </div>

                          <div className="relative h-16">
                            <div
                              className={`absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full ${
                                currentRequest.status === "404 Not Found"
                                  ? "bg-amber-200"
                                  : "bg-emerald-200"
                              }`}
                            />
                            <motion.div
                              initial={{ left: "82%", opacity: 0 }}
                              animate={{ left: "5%", opacity: 1 }}
                              transition={{ duration: 0.9, ease: "easeInOut" }}
                              className="absolute top-1/2 -translate-y-1/2"
                            >
                              <div
                                className={`rounded-2xl border bg-white px-4 py-2 text-center shadow-sm ${
                                  currentRequest.status === "404 Not Found"
                                    ? "border-amber-200"
                                    : "border-emerald-200"
                                }`}
                              >
                                <p
                                  className={`text-xs font-bold ${
                                    currentRequest.status === "404 Not Found"
                                      ? "text-amber-800"
                                      : "text-emerald-800"
                                  }`}
                                >
                                  {currentRequest.status}
                                </p>
                                <p className="text-xs text-slate-700">Response</p>
                              </div>
                            </motion.div>
                          </div>

                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                            <Server className="mx-auto h-6 w-6 text-emerald-700" />
                            <p className="mt-2 text-sm font-semibold text-emerald-900">
                              Server
                            </p>
                          </div>
                        </div>
                      </div>

                      <BrowserCanvas
                        loadedResources={loadedResources}
                        currentRequest={currentRequest}
                      />

                      <PreviewSummary currentRequest={currentRequest} />
                    </motion.div>
                  )}

                  {phase === "displayed" && (
                    <motion.div
                      key="displayed"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-4"
                    >
                      <BrowserCanvas
                        loadedResources={loadedResources}
                        currentRequest={currentRequest}
                      />

                      <PreviewSummary currentRequest={currentRequest} />

                      <div className="flex flex-wrap justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleNextRound}
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                        >
                          Try Another Request
                        </button>

                        <button
                          type="button"
                          onClick={resetActivity}
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
              <StageCard
                title="1. Browser chooses content"
                subtitle="The browser decides what webpage or file it wants."
                icon={Globe}
                tone="blue"
                active={phase === "choose"}
              />
              <StageCard
                title="2. HTTP request"
                subtitle="The browser sends a request like GET /home to the server."
                icon={ArrowRight}
                tone="blue"
                active={phase === "sending"}
              />
              <StageCard
                title="3. Server response"
                subtitle="The server sends back a response such as 200 OK or 404 Not Found."
                icon={Server}
                tone={
                  currentRequest.status === "404 Not Found" ? "amber" : "emerald"
                }
                active={phase === "response" || phase === "displayed"}
              />
              <StageCard
                title="4. Browser displays result"
                subtitle="The browser shows the webpage, file, or an error message."
                icon={CheckCircle2}
                tone={
                  currentRequest.status === "404 Not Found" ? "amber" : "emerald"
                }
                active={phase === "displayed"}
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Did you know?
                </h3>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    Have you ever seen <span className="font-semibold">HTTP</span> or{" "}
                    <span className="font-semibold">HTTPS</span> in a website address?
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    A <span className="font-semibold">200 OK</span> response means
                    the server found what was requested.
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    A <span className="font-semibold">404 Not Found</span> response
                    means the requested page could not be found.
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                    Browsers often need to send separate requests for all of the
                    parts of a webpage, including images and videos.
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                    <Lock className="h-5 w-5 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-900">
                      Fun fact: HTTPS
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                      HTTPS is the more secure version of HTTP. It helps protect
                      the information being sent between the browser and server.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={resetActivity}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Restart HTTP Activity
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
                  ? "Excellent work — you understand how HTTP helps browsers and servers communicate."
                  : score >= 2
                  ? "Good job — review request, response, status codes, separate page parts, and HTTPS once more."
                  : "Review the module and try the quiz again."}
              </p>
            </div>
          )}
        </Section>

        <Section title="Summary" icon={CheckCircle2}>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">HTTP</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                HTTP is the rule that helps browsers and servers communicate.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">Request</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The browser sends a request for a webpage or file.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">All the parts</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A browser may need to send separate requests for all of the parts
                of a webpage, such as images and videos.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">HTTPS</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                HTTPS is the more secure version of HTTP and helps protect data.
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}