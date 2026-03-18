import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  Globe,
  HelpCircle,
  Monitor,
  MousePointerClick,
  Package,
  Play,
  RefreshCcw,
  Router,
  Search,
  Server,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const stops = [
  {
    key: "device",
    title: "Your Device",
    icon: Monitor,
    short: "Your device creates a request for the website or video.",
    fact: "A request is just your device asking for information.",
    badge: "Request created",
    accent: "blue",
  },
  {
    key: "router",
    title: "Router / Wi-Fi",
    icon: Router,
    short: "The router sends the request out of your home or school network.",
    fact: "The router helps move the request in the right direction.",
    badge: "Request sent to router",
    accent: "amber",
  },
  {
    key: "internet",
    title: "The Internet",
    icon: Globe,
    short: "The request travels across many connected networks.",
    fact: "The internet is a huge network of networks.",
    badge: "Travelling across internet",
    accent: "violet",
  },
  {
    key: "server",
    title: "Web Server",
    icon: Server,
    short: "The server receives the request and finds the correct data.",
    fact: "A server stores and sends websites, videos, images, and more.",
    badge: "Request reached server",
    accent: "emerald",
  },
  {
    key: "return",
    title: "Packets Return",
    icon: Package,
    short: "The server sends data back in packets so your device can rebuild it.",
    fact: "Packets are smaller pieces of data that are easier to send and rebuild.",
    badge: "Packets returning",
    accent: "cyan",
  },
];

const introPoints = [
  "Your device asks for information.",
  "The router helps send the request outward.",
  "The request travels across the internet.",
  "The server finds the correct content.",
  "Packets return so the content can load.",
];

const keyIdeas = [
  "A router helps move your request onward.",
  "The internet is many connected networks.",
  "A server stores and sends online content.",
  "Packets are smaller pieces of data.",
];

const packetFacts = [
  "Smaller pieces are easier to send.",
  "Packets can be checked and rebuilt.",
  "Your device puts the pieces back together.",
];

const quizQuestions = [
  {
    question: "What happens first when you open a website or video?",
    options: [
      "Your device sends a request",
      "The router stores the whole website",
      "The server appears on your screen",
    ],
    answer: "Your device sends a request",
  },
  {
    question: "What is the router’s job in this journey?",
    options: [
      "Help send the request out to the internet",
      "Store every website forever",
      "Play the video on your screen",
    ],
    answer: "Help send the request out to the internet",
  },
  {
    question: "Why is data often sent back in packets?",
    options: [
      "Because smaller pieces are easier to send and rebuild",
      "Because websites are too colourful",
      "Because the router wants extra copies",
    ],
    answer: "Because smaller pieces are easier to send and rebuild",
  },
  {
    question: "Which order is correct?",
    options: [
      "Device → Router → Internet → Server → Packets back",
      "Server → Router → Device → Internet → Packets back",
      "Router → Device → Server → Internet → Packets back",
    ],
    answer: "Device → Router → Internet → Server → Packets back",
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

function accentClasses(accent) {
  switch (accent) {
    case "blue":
      return {
        soft: "bg-blue-50 text-blue-800 border-blue-200",
        pill: "bg-blue-100 text-blue-700",
        line: "bg-blue-500",
      };
    case "amber":
      return {
        soft: "bg-amber-50 text-amber-800 border-amber-200",
        pill: "bg-amber-100 text-amber-700",
        line: "bg-amber-500",
      };
    case "violet":
      return {
        soft: "bg-violet-50 text-violet-800 border-violet-200",
        pill: "bg-violet-100 text-violet-700",
        line: "bg-violet-500",
      };
    case "emerald":
      return {
        soft: "bg-emerald-50 text-emerald-800 border-emerald-200",
        pill: "bg-emerald-100 text-emerald-700",
        line: "bg-emerald-500",
      };
    default:
      return {
        soft: "bg-cyan-50 text-cyan-800 border-cyan-200",
        pill: "bg-cyan-100 text-cyan-700",
        line: "bg-cyan-500",
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
      className={`rounded-2xl border px-4 py-3 text-left transition ${
        active
          ? `${accent.soft} shadow-sm`
          : complete
          ? "border-slate-300 bg-slate-100 text-slate-800"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <Icon className="h-5 w-5" />
        {complete ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : active ? (
          <Circle className="h-5 w-5" />
        ) : null}
      </div>
      <p className="text-sm font-semibold">{item.title}</p>
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

function QuizOption({
  option,
  isSelected,
  isCorrect,
  submitted,
  onClick,
}) {
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

export default function DataTravel() {
  const [currentStop, setCurrentStop] = useState(0);
  const [packetsArrived, setPacketsArrived] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

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

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, index) => total + (selectedAnswers[index] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers]);

  const progressPercent = (currentStop / (stops.length - 1)) * 100;

  const requestLeft =
    currentStop === 0
      ? "10%"
      : currentStop === 1
      ? "33%"
      : currentStop === 2
      ? "55%"
      : "86%";

  const progressWidth =
    currentStop === 0
      ? "0%"
      : currentStop === 1
      ? "23%"
      : currentStop === 2
      ? "46%"
      : currentStop >= 3
      ? "76%"
      : "0%";

  const title =
    currentStop === 4 && packetsArrived
      ? "Your device rebuilds the content"
      : currentStop === 4
      ? "Packets are travelling back"
      : stop.title;

  const body =
    currentStop === 4 && packetsArrived
      ? "The packets have arrived back at your device. Your device puts the pieces together so the video can appear on screen."
      : currentStop === 4
      ? "The server has sent the data back in smaller pieces called packets. They are travelling through the network toward your device."
      : stop.short;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 1
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            How Data Travels Through the Internet
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Follow a simple journey to see how your device asks for information,
            how a server responds, and how packets help content appear on screen.
          </p>
        </header>

        <Section title="General Overview" icon={BookOpen}>
          <div className="grid gap-3 md:grid-cols-5">
            {introPoints.map((point, index) => (
              <div
                key={point}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold leading-5 text-slate-800">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Real-life analogy
              </h3>
              <p className="mt-2 leading-7 text-slate-700">
                Think about ordering food online. You place the order, the
                restaurant receives it, prepares it, and sends it back to you.
                The internet works in a similar way. Your device asks for
                information, the server finds it, and the data returns so your
                screen can show it.
              </p>
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

        <Section title="Interactive Learning Activity" icon={MousePointerClick}>
          <p className="mb-5 leading-7 text-slate-700">
            Move through each step to follow the request to the server, then
            watch the packets return and rebuild the video.
          </p>

          <div className="mb-5 flex items-center justify-between text-sm text-slate-600">
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

          <div className="mb-6 grid gap-3 md:grid-cols-5">
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

          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  Packet Journey
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.pill}`}
                >
                  {stop.badge}
                </span>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 md:px-6">
                <div className="hidden md:block">
                  <div className="relative pt-10">
                    <div className="absolute left-[10%] right-[14%] top-[70px] h-1 rounded-full bg-slate-200" />

                    <motion.div
                      className={`absolute left-[10%] top-[68px] h-[6px] rounded-full ${accent.line}/30`}
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

                    {currentStop === 4 && !packetsArrived &&
                      [0, 1, 2].map((packet) => (
                        <motion.div
                          key={packet}
                          className="pointer-events-none absolute top-[16px] z-20 -translate-x-1/2"
                          initial={{ left: "86%", opacity: 0 }}
                          animate={{
                            left: ["86%", "72%", "58%", "44%", "30%", "10%"],
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
                      <div className="pointer-events-none absolute left-[10%] top-[12px] z-20 -translate-x-1/2">
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

                        const isArrivalTarget = currentStop === 4 && packetsArrived && index === 0;

                        return (
                          <div key={item.key} className="flex flex-col items-center text-center">
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

                <div className="grid gap-3 md:hidden">
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
                      <h4 className="font-semibold text-slate-900">Video now loaded</h4>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                      <div className="aspect-video bg-slate-900 p-4">
                        <div className="flex h-full flex-col justify-between">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">
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
                              The packets reached your device and the content could now be shown on screen.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
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
                    <p className="mt-2 leading-7">{body}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <h4 className="font-semibold text-slate-900">Quick fact</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {stop.fact}
                  </p>
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
                <div className="flex items-center justify-center gap-3">
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
                    className={`rounded-2xl px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      stop.accent === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : stop.accent === "amber"
                        ? "bg-amber-600 hover:bg-amber-700"
                        : stop.accent === "violet"
                        ? "bg-violet-600 hover:bg-violet-700"
                        : stop.accent === "emerald"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-cyan-600 hover:bg-cyan-700"
                    }`}
                  >
                    Next
                  </button>
                </div>

                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStop(0);
                      setPacketsArrived(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-slate-700 transition hover:bg-slate-50"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Quick Quiz" icon={HelpCircle}>
          <div className="space-y-5">
            {quizQuestions.map((q, qIndex) => (
              <div
                key={q.question}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <h3 className="font-semibold text-slate-900">
                  {qIndex + 1}. {q.question}
                </h3>

                <div className="mt-4 grid gap-3">
                  {q.options.map((option) => (
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
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSubmittedQuiz(true)}
              className="rounded-2xl bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-800"
            >
              Submit Quiz
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedAnswers({});
                setSubmittedQuiz(false);
              }}
              className="rounded-2xl border border-slate-300 px-5 py-2.5 text-slate-700 transition hover:bg-slate-50"
            >
              Reset Quiz
            </button>
          </div>

          {submittedQuiz && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-slate-50 p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                Your Score: {score} / {quizQuestions.length}
              </h3>
              <p className="mt-2 leading-7 text-slate-600">
                {score === 4
                  ? "Excellent work — you understand the basic journey of data through the internet."
                  : score >= 2
                  ? "Good job — review the journey once more to lock in the order."
                  : "Nice try — go back through the interactive journey and try again."}
              </p>
            </motion.div>
          )}
        </Section>
      </div>
    </div>
  );
}