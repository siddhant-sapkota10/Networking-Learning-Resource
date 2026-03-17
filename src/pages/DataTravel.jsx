import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Monitor,
  Router,
  Server,
  Globe,
  HelpCircle,
  RefreshCcw,
  BookOpen,
  MousePointerClick,
  BadgeCheck,
  Search,
  Play,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const travelStops = [
  {
    id: 0,
    key: "device",
    title: "Your Device",
    icon: Monitor,
    description:
      "You click on a YouTube video. Your device creates a request asking for the video data.",
    badge: "Request created on your device",
    accent: {
      card: "border-blue-200 bg-blue-50 text-blue-800",
      soft: "bg-blue-100 text-blue-700 border-blue-200",
      ring: "ring-blue-100",
      button: "bg-blue-600 hover:bg-blue-700",
      progress: "bg-blue-500",
    },
  },
  {
    id: 1,
    key: "router",
    title: "Router / Wi-Fi",
    icon: Router,
    description:
      "Your device sends the request to the router. The router directs your request out of your home or school network and towards the internet.",
    badge: "Request sent to the router",
    accent: {
      card: "border-amber-200 bg-amber-50 text-amber-800",
      soft: "bg-amber-100 text-amber-700 border-amber-200",
      ring: "ring-amber-100",
      button: "bg-amber-600 hover:bg-amber-700",
      progress: "bg-amber-500",
    },
  },
  {
    id: 2,
    key: "internet",
    title: "The Internet",
    icon: Globe,
    description:
      "The request travels across many connected networks on the internet until it reaches the correct server.",
    badge: "Request travelling across the internet",
    accent: {
      card: "border-violet-200 bg-violet-50 text-violet-800",
      soft: "bg-violet-100 text-violet-700 border-violet-200",
      ring: "ring-violet-100",
      button: "bg-violet-600 hover:bg-violet-700",
      progress: "bg-violet-500",
    },
  },
  {
    id: 3,
    key: "server",
    title: "Web Server",
    icon: Server,
    description:
      "The web server receives your request and prepares the data needed for the webpage or video.",
    badge: "Server processing request",
    accent: {
      card: "border-emerald-200 bg-emerald-50 text-emerald-800",
      soft: "bg-emerald-100 text-emerald-700 border-emerald-200",
      ring: "ring-emerald-100",
      button: "bg-emerald-600 hover:bg-emerald-700",
      progress: "bg-emerald-500",
    },
  },
  {
    id: 4,
    key: "back",
    title: "Back to Your Device",
    icon: Monitor,
    description:
      "The server sends the website data back across the internet in small pieces called packets. Your device receives them, puts them back together, and loads the video on your screen.",
    badge: "Data packets returning to your device",
    accent: {
      card: "border-cyan-200 bg-cyan-50 text-cyan-800",
      soft: "bg-cyan-100 text-cyan-700 border-cyan-200",
      ring: "ring-cyan-100",
      button: "bg-cyan-600 hover:bg-cyan-700",
      progress: "bg-cyan-500",
    },
  },
];

const introSteps = [
  {
    title: "Step 1: You ask for something online",

  },
  {
    title: "Step 2: The request leaves your device",
  },
  {
    title: "Step 3: It travels across the internet",
  },
  {
    title: "Step 4: The server sends data back",
  },
  {
    title: "Step 5: Your device loads the content",
  },
];

const quizQuestions = [
  {
    question: "What happens first when you click a website or video?",
    options: [
      "The router stores the whole website",
      "Your device sends a request",
      "The server appears on your screen",
    ],
    answer: "Your device sends a request",
  },
  {
    question: "What is the job of the router in this journey?",
    options: [
      "It helps direct the request out to the internet",
      "It stores YouTube videos forever",
      "It rebuilds the webpage on your screen",
    ],
    answer: "It helps direct the request out to the internet",
  },
  {
    question: "What happens after the server finds the data?",
    options: [
      "The data is sent back to your device",
      "The router stores the video",
      "The internet turns off",
    ],
    answer: "The data is sent back to your device",
  },
];

function SectionCard({ title, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function getRequestPosition(index, total) {
  return `${((index + 0.5) / total) * 100}%`;
}

export default function DataTravel() {
  const [currentStop, setCurrentStop] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const stop = travelStops[currentStop];
  const progressPercent = (currentStop / (travelStops.length - 1)) * 100;

  const score = useMemo(() => {
    return quizQuestions.reduce((total, q, index) => {
      return total + (selectedAnswers[index] === q.answer ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const handleNextStop = () => {
    if (currentStop < travelStops.length - 1) {
      setCurrentStop((prev) => prev + 1);
    }
  };

  const handlePrevStop = () => {
    if (currentStop > 0) {
      setCurrentStop((prev) => prev - 1);
    }
  };

  const resetJourney = () => {
    setCurrentStop(0);
  };

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const handleQuizSubmit = () => {
    setSubmittedQuiz(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setSubmittedQuiz(false);
  };

  const showVideoLoaded = currentStop === 4;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              Module 1
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              How Data Travels Through the Internet
            </h1>

          </div>
        </header>

        <SectionCard title="General Overview" icon={BookOpen}>
         

          <div className="grid gap-4">
            {introSteps.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="flex gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className = "flex items-center">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

           <div className=" mt-6 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Real-life analogy
            </h3>
            <p className="text-slate-700 leading-7">
              Imagine ordering food. You place the order, the restaurant receives
              it, prepares it, and sends it back to you. The internet works in a
              similar way. Your device asks for information, the server finds it,
              and then sends the data back so your screen can show it.
            </p>
          </div>
        </SectionCard>


        <SectionCard
          title="Interactive Learning Activity"
          icon={MousePointerClick}
        >
          <div className="mb-5">
            <p className="text-slate-700 leading-7">
              Click through each stop to follow the journey of data. Read the
              explanation at every stage so you understand what is happening.
            </p>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Journey progress</span>
              <span>
                Stop {currentStop + 1} of {travelStops.length}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className={`h-full rounded-full ${stop.accent.progress}`}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.45 }}
              />
            </div>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-5">
            {travelStops.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentStop === index;
              const isCompleted = currentStop > index;

              return (
                <motion.button
                  key={item.key}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setCurrentStop(index)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? `${item.accent.soft} shadow-sm ring-2 ${item.accent.ring}`
                      : isCompleted
                      ? "border-slate-300 bg-slate-100 text-slate-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <Icon className="h-5 w-5" />
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <Circle className="h-5 w-5" />
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold">{item.title}</p>
                </motion.button>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Packet Journey
                </h3>
                <div
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${stop.accent.card}`}
                >
                  {stop.badge}
                </div>
              </div>

              <div className="relative rounded-3xl border border-slate-200 bg-white px-4 pt-16 pb-8">
                <div className="pointer-events-none absolute left-[8%] right-[8%] top-[76px] hidden h-1 rounded-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 md:block" />

{!showVideoLoaded && (
  <motion.div
    className="pointer-events-none absolute top-[20px] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm md:flex"
    animate={{ left: getRequestPosition(currentStop, travelStops.length) }}
    transition={{
      type: "spring",
      stiffness: 110,
      damping: 18,
      mass: 0.8,
    }}
  >
    <motion.div
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <Search className="h-4 w-4 text-slate-700" />
    </motion.div>
  </motion.div>
)}

                <div className="grid grid-cols-5 items-start justify-items-center gap-2">
                  {travelStops.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentStop === index;
                    const isCompleted = currentStop > index;

                    return (
                      <div
                        key={item.key}
                        className="flex flex-col items-center text-center"
                      >
                        <motion.div
                          animate={{
                            scale: isActive ? 1.08 : 1,
                            y: isActive ? -2 : 0,
                          }}
                          transition={{ duration: 0.25 }}
                          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border transition ${
                            isActive
                              ? `${item.accent.soft} ring-2 ${item.accent.ring}`
                              : isCompleted
                              ? "border-slate-300 bg-slate-200 text-slate-800"
                              : "border-slate-200 bg-white text-slate-500"
                          }`}
                        >
                          <Icon className="h-7 w-7" />

                          {showVideoLoaded && index === 4 && (
                            <div className="absolute -top-8 flex gap-1">
                              {[0, 1, 2].map((packet) => (
                                <motion.div
                                  key={packet}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: packet * 0.12 }}
                                  className="flex h-6 w-6 items-center justify-center rounded-md border border-cyan-200 bg-cyan-100"
                                >
                                  <Package className="h-3.5 w-3.5 text-cyan-700" />
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>

                        <p className="mt-3 max-w-[100px] text-sm font-medium leading-5 text-slate-700">
                          {item.title}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Current stop
                  </p>
                  <h4 className="mt-1 text-xl font-bold text-slate-900">
                    {stop.title}
                  </h4>
                  <p className="mt-2 text-slate-600 leading-7">{stop.short}</p>

 

                  {showVideoLoaded && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                          <Play className="h-4 w-4 fill-red-600 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            YouTube Video Loaded
                          </p>
                          <p className="text-xs text-slate-500">
                            Your device has rebuilt the data
                          </p>
                        </div>
                      </div>

                      <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_35%)]" />
                        <div className="z-10 flex flex-col items-center gap-3 text-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                            <Play className="h-8 w-8 fill-white text-white" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-white">
                              Roblox Football Skills Video
                            </p>
                            <p className="text-sm text-slate-200">
                              Pretend video player
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                What is happening here?
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStop}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl border p-4 ${stop.accent.card}`}
                >
                  <p className="leading-7">{stop.description}</p>
                </motion.div>
              </AnimatePresence>



              <div className="mt-6 gap-3">
                <div className="mb-4 flex items-center justify-center gap-4">

                
                <button
                  onClick={handlePrevStop}
                  disabled={currentStop === 0}
                  className="rounded-2xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous Stop
                </button>

                <button
                  onClick={handleNextStop}
                  disabled={currentStop === travelStops.length - 1}
                  className={`rounded-2xl px-4 py-2 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${stop.accent.button}`}
                >
                  Go to Next Stop
                </button>
</div>
                <button
                  onClick={resetJourney}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCcw className="h-5 w-5" />
                  Restart
                </button>
              </div>

              {currentStop === travelStops.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div>
                      <h4 className="font-semibold text-emerald-800">
                        Journey complete
                      </h4>
                      <p className="mt-1 leading-7 text-emerald-700">
                        Nice work. Your device asked for the video, the server
                        found the data, and the data returned so the video could
                        load on your screen.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick Quiz" icon={HelpCircle}>
          <div className="space-y-5">
            {quizQuestions.map((q, qIndex) => (
              <div
                key={q.question}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {qIndex + 1}. {q.question}
                </h3>

                <div className="mt-4 grid gap-3">
                  {q.options.map((option) => {
                    const isSelected = selectedAnswers[qIndex] === option;
                    const isCorrect = q.answer === option;

                    let optionStyle =
                      "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

                    if (submittedQuiz) {
                      if (isCorrect) {
                        optionStyle =
                          "border-emerald-300 bg-emerald-50 text-emerald-800";
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          "border-rose-300 bg-rose-50 text-rose-800";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "border-slate-900 bg-slate-900 text-white";
                    }

                    return (
                      <motion.button
                        key={option}
                        whileHover={submittedQuiz ? {} : { y: -1 }}
                        whileTap={submittedQuiz ? {} : { scale: 0.995 }}
                        onClick={() => handleAnswerSelect(qIndex, option)}
                        disabled={submittedQuiz}
                        className={`rounded-2xl border p-3 text-left transition ${optionStyle} ${
                          submittedQuiz ? "cursor-default" : ""
                        }`}
                      >
                        {option}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleQuizSubmit}
              className="rounded-2xl bg-slate-900 px-5 py-2.5 font-medium text-white transition hover:bg-slate-800"
            >
              Submit Quiz
            </button>

            <button
              onClick={resetQuiz}
              className="rounded-2xl border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset Quiz
            </button>
          </div>

          {submittedQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Your Score: {score} / {quizQuestions.length}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                {score === 3
                  ? "Excellent work — you understand the basic journey of data through the internet."
                  : score === 2
                  ? "Good job — you understand most of the idea. Review the journey once more to lock it in."
                  : "Nice try — go back through the interactive journey and try the quiz again."}
              </p>
            </motion.div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}