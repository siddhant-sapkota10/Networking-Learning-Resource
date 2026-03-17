import { useEffect, useMemo, useState } from "react";
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
  Search,
  Play,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const stageStops = [
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
      "Your device sends the request to the router. The router forwards your request out of your home or school network and towards the internet.",
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
      "The request has reached the web server. The server finds the correct data and gets it ready to send back.",
    badge: "Request reached the web server",
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
    key: "return",
    title: "Packets Return",
    icon: Package,
    description:
      "The server sends the data back as packets. Those packets travel all the way back to your device, where they are put back together so the video can load.",
    badge: "Packets returning to your device",
    accent: {
      card: "border-cyan-200 bg-cyan-50 text-cyan-800",
      soft: "bg-cyan-100 text-cyan-700 border-cyan-200",
      ring: "ring-cyan-100",
      button: "bg-cyan-600 hover:bg-cyan-700",
      progress: "bg-cyan-500",
    },
  },
];

const journeyNodes = [
  { key: "device", title: "Your Device", icon: Monitor },
  { key: "router", title: "Router / Wi-Fi", icon: Router },
  { key: "internet", title: "The Internet", icon: Globe },
  { key: "server", title: "Web Server", icon: Server },
];

const introSteps = [
  { title: "Step 1: You ask for something online" },
  { title: "Step 2: The request leaves your device" },
  { title: "Step 3: It travels across the internet" },
  { title: "Step 4: The request reaches the web server" },
  { title: "Step 5: Packets return and your device loads the content" },
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
    question: "What happens after the request reaches the web server?",
    options: [
      "The server sends the data back as packets",
      "The router stores the video",
      "The internet turns off",
    ],
    answer: "The server sends the data back as packets",
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

function PacketChip({ className = "" }) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-md border shadow-sm ${className}`}
    >
      <Package className="h-4 w-4" />
    </div>
  );
}

function ArrivedPacketDeck() {
  return (
    <div className="pointer-events-none absolute left-[12%] top-[8px] z-20 -translate-x-1/2">
      <div className="relative h-8 w-[62px]">
        <motion.div
          initial={{ opacity: 0, x: 5, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.04 }}
          className="absolute left-0 top-0"
        >
          <PacketChip className="border-cyan-200 bg-cyan-100 text-cyan-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 5, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.1 }}
          className="absolute left-[17px] top-0"
        >
          <PacketChip className="border-cyan-200 bg-cyan-100 text-cyan-700" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 5, y: 4 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.16 }}
          className="absolute left-[34px] top-0"
        >
          <PacketChip className="border-cyan-200 bg-cyan-100 text-cyan-700" />
        </motion.div>
      </div>
    </div>
  );
}

export default function DataTravel() {
  const [currentStop, setCurrentStop] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [packetsArrived, setPacketsArrived] = useState(false);

  const stop = stageStops[currentStop];
  const progressPercent = (currentStop / (stageStops.length - 1)) * 100;

  useEffect(() => {
    if (currentStop === 4) {
      setPacketsArrived(false);
      const timer = setTimeout(() => setPacketsArrived(true), 2200);
      return () => clearTimeout(timer);
    }
    setPacketsArrived(false);
  }, [currentStop]);

  const score = useMemo(() => {
    return quizQuestions.reduce((total, q, index) => {
      return total + (selectedAnswers[index] === q.answer ? 1 : 0);
    }, 0);
  }, [selectedAnswers]);

  const handleNextStop = () => {
    if (currentStop < stageStops.length - 1) {
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
    setPacketsArrived(false);
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

  const showRequestBubble = currentStop <= 3;
  const showPacketReturn = currentStop === 4;
  const showVideoLoaded = currentStop === 4 && packetsArrived;

  const explanationText =
    currentStop === 4 && !packetsArrived
      ? "The web server has sent the packets back. They are now travelling through the network toward your device."
      : currentStop === 4 && packetsArrived
      ? "The packets have reached your device. Your device puts them back together, and the video can now load."
      : stop.description;

  const lineWidth =
    currentStop === 0
      ? "0%"
      : currentStop === 1
      ? "25.33%"
      : currentStop === 2
      ? "50.66%"
      : currentStop === 3
      ? "76%"
      : "76%";

  const requestLeft =
    currentStop === 0
      ? "12%"
      : currentStop === 1
      ? "37.33%"
      : currentStop === 2
      ? "62.66%"
      : "88%";

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
            <p className="max-w-3xl leading-7 text-slate-600">
              Follow a simple step-by-step journey showing how a request leaves
              your device, reaches a server, and then returns as packets so the
              content can load on your screen.
            </p>
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
                <div className="flex items-center">
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mb-6 mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Real-life analogy
            </h3>
            <p className="leading-7 text-slate-700">
              Imagine ordering food. You place the order, the restaurant
              receives it, prepares it, and sends it back to you. The internet
              works in a similar way. Your device asks for information, the
              server finds it, and then sends the data back so your screen can
              show it.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Interactive Learning Activity" icon={MousePointerClick}>
          <div className="mb-5">
            <p className="leading-7 text-slate-700">
              Click through each stop to follow the journey of data. The request
              stops at the web server first. On the next stop, the server sends
              packets all the way back to your device, and the video only loads
              after they arrive.
            </p>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Journey progress</span>
              <span>
                Stop {currentStop + 1} of {stageStops.length}
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

          <div className="mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {stageStops.map((item, index) => {
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
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Packet Journey
                </h3>
                <div
                  className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${stop.accent.card}`}
                >
                  {stop.badge}
                </div>
              </div>

              <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-6 md:px-6">
                <div className="hidden md:block">
                  <div className="relative pt-12">
                    <div className="absolute left-[12%] right-[12%] top-[72px] h-1 rounded-full bg-slate-200" />

                    <motion.div
                      className="absolute top-[66px] h-4 rounded-full bg-sky-300/40"
                      initial={false}
                      animate={{
                        left: "12%",
                        width: lineWidth,
                      }}
                      transition={{ duration: 0.45 }}
                    />

                    {showRequestBubble && (
                      <motion.div
                        key={`request-${currentStop}`}
                        className="pointer-events-none absolute z-20 -translate-x-1/2"
                        initial={false}
                        animate={{
                          left: requestLeft,
                          top: 20,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 120,
                          damping: 18,
                        }}
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-md">
                          <Search className="h-4 w-4 text-slate-700" />
                        </div>
                      </motion.div>
                    )}

                    {showPacketReturn &&
                      !packetsArrived &&
                      [0, 1, 2].map((packet) => (
                        <motion.div
                          key={`travel-${packet}`}
                          className="pointer-events-none absolute top-[18px] z-20 -translate-x-1/2"
                          initial={{ left: "88%", opacity: 0 }}
                          animate={{
                            left: ["88%", "75%", "62%", "50%", "37%", "25%", "12%"],
                            opacity: [0, 1, 1, 1, 1, 1, 1],
                          }}
                          transition={{
                            duration: 2,
                            delay: packet * 0.14,
                            ease: "easeInOut",
                          }}
                        >
                          <PacketChip className="border-cyan-200 bg-cyan-100 text-cyan-700" />
                        </motion.div>
                      ))}

                    {showPacketReturn && packetsArrived && <ArrivedPacketDeck />}

                    <div className="relative grid grid-cols-4 gap-4">
                      {journeyNodes.map((item, index) => {
                        const Icon = item.icon;
                        const isActive =
                          (currentStop === 0 && index === 0) ||
                          (currentStop === 1 && index === 1) ||
                          (currentStop === 2 && index === 2) ||
                          (currentStop === 3 && index === 3) ||
                          (currentStop === 4 && index === 3);

                        const isCompleted =
                          (currentStop > 0 && index === 0) ||
                          (currentStop > 1 && index === 1) ||
                          (currentStop > 2 && index === 2);

                        const isArrivalTarget = currentStop === 4 && packetsArrived && index === 0;

                        return (
                          <div
                            key={item.key}
                            className="flex flex-col items-center text-center"
                          >
                            <motion.div
                              animate={{
                                scale:
                                  isActive || isArrivalTarget
                                    ? 1.07
                                    : 1,
                                y:
                                  isActive || isArrivalTarget
                                    ? -2
                                    : 0,
                              }}
                              transition={{ duration: 0.22 }}
                              className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border transition ${
                                isArrivalTarget
                                  ? "border-blue-200 bg-blue-100 text-blue-800 ring-2 ring-blue-100"
                                  : isActive
                                  ? `${stop.accent.soft} ring-2 ${stop.accent.ring}`
                                  : isCompleted
                                  ? "border-slate-300 bg-slate-200 text-slate-800"
                                  : "border-slate-200 bg-white text-slate-500"
                              }`}
                            >
                              <Icon className="h-7 w-7" />
                            </motion.div>

                            <p className="mt-3 min-h-[44px] max-w-[110px] text-sm font-medium leading-5 text-slate-700">
                              {item.title}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:hidden">
                  {stageStops.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = currentStop === index;
                    const isCompleted = currentStop > index;

                    return (
                      <div
                        key={item.key}
                        className={`rounded-2xl border p-4 ${
                          isActive
                            ? `${item.accent.soft} ring-2 ${item.accent.ring}`
                            : isCompleted
                            ? "border-slate-300 bg-slate-100"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                              isActive
                                ? "border-current/20 bg-white/60"
                                : "border-slate-200 bg-white"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-sm text-slate-500">
                              Stop {index + 1}
                            </p>
                          </div>
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-slate-600" />
                          ) : isActive ? (
                            <Circle className="h-5 w-5 text-slate-600" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentStop === 4 && !packetsArrived && (
                  <div className="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                    <p className="font-semibold text-cyan-800">
                      Packets are on the way back
                    </p>
                    <p className="mt-1 text-cyan-700">
                      The server has sent the packets. Your device will load the
                      video once they arrive.
                    </p>
                  </div>
                )}

                {showVideoLoaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Play className="h-5 w-5 text-red-500" />
                      <h5 className="font-semibold text-slate-900">
                        Video now loaded
                      </h5>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="aspect-video bg-slate-900">
                        <div className="flex h-full flex-col justify-between p-4">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                              YouTube video
                            </span>
                            <span className="text-xs text-slate-300">
                              Rebuilt from packets
                            </span>
                          </div>

                          <div className="flex flex-1 items-center justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg">
                              <Play className="ml-1 h-7 w-7 fill-white text-white" />
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-white">
                              Roblox gameplay video
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                              The packets reached your device and the video can
                              now be shown on screen.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-center">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                What is happening here?
              </h3>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentStop}-${packetsArrived}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl border p-4 ${stop.accent.card}`}
                >
                  <p className="leading-7">{explanationText}</p>
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
                    disabled={currentStop === stageStops.length - 1}
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

              {currentStop === stageStops.length - 1 && packetsArrived && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
                >
                  <div>
                    <h4 className="font-semibold text-emerald-800">
                      Journey complete
                    </h4>
                    <p className="mt-1 leading-7 text-emerald-700">
                      Nice work. Your device sent a request, the server found
                      the data, and the packets travelled back to your device
                      before the video loaded.
                    </p>
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