import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GripHorizontal,
  HelpCircle,
  Info,
  Laptop,
  Lightbulb,
  Lock,
  Package,
  RefreshCcw,
  Server,
  ShieldCheck,
  Target,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { markActivityComplete, markQuizPassed } from "../utils/progress";
import m2Diagram from "../assets/m2diagram.png";

const ST_EDS = {
  navy: "#073674",
  blue: "#0A4AA3",
  blue2: "#0F6DF0",
  gold: "#FEC52F",
  silver: "#D1D2D4",
  white: "#FFFFFF",
  pale: "#F8FAFC",
};

const baseQuizQuestions = [
  {
    question:
      "A client wants to send data using TCP. According to the simulation, which event must happen before normal packet transfer begins?",
    options: [
      "The 3-way handshake must confirm both devices are ready",
      "The server must first send packet numbers to the client",
      "The router must rebuild the packets in the correct order",
      "The internet must resend every packet once as a safety check",
    ],
    answer: "The 3-way handshake must confirm both devices are ready",
  },
  {
    question:
      "Why is the 3-way handshake shown as SYN, SYN-ACK, and ACK rather than a single message?",
    options: [
      "It confirms both sides can send and receive before the connection is treated as established",
      "It encrypts every packet before the data begins travelling",
      "It makes the internet choose the fastest website automatically",
      "It breaks the whole file into four numbered pieces",
    ],
    answer:
      "It confirms both sides can send and receive before the connection is treated as established",
  },
  {
    question:
      "In the TCP module, what is the best reason packets are numbered?",
    options: [
      "So the receiver can rebuild the message in the correct sequence",
      "So the server can decide which packets should be deleted",
      "So the client can turn the connection back into Wi-Fi",
      "So missing packets can be ignored without affecting the data",
    ],
    answer: "So the receiver can rebuild the message in the correct sequence",
  },
  {
    question:
      "During the return trip in the simulation, packet 3 slips off the line. What does TCP do next?",
    options: [
      "It requests only the missing packet again because the others already arrived",
      "It deletes packets 1, 2, and 4 and starts the internet again",
      "It sends a brand-new handshake before every resent packet",
      "It ignores packet 3 and rebuilds the message from the remaining packets",
    ],
    answer:
      "It requests only the missing packet again because the others already arrived",
  },
  {
    question:
      "Which statement best matches what the simulation is teaching about TCP reliability?",
    options: [
      "TCP checks the connection, tracks order, and handles missing packets so data arrives reliably",
      "TCP mainly increases screen brightness so packets are easier to identify",
      "TCP stores websites permanently on the client before they are requested",
      "TCP replaces servers by allowing devices to communicate without packet transfer",
    ],
    answer:
      "TCP checks the connection, tracks order, and handles missing packets so data arrives reliably",
  },
  {
    question:
      "A student says, “If one packet goes missing, TCP has to send the entire message again.” Based on the simulation, what is the best correction?",
    options: [
      "TCP can resend only the missing packet if the others were received correctly",
      "TCP cannot detect missing packets, so the message is usually left incomplete",
      "TCP sends the handshake again but never resends data packets",
      "TCP changes the packet numbers so the missing one is no longer needed",
    ],
    answer:
      "TCP can resend only the missing packet if the others were received correctly",
  },
  {
    question:
      "Which sequence best reflects the order shown in the learning resource?",
    options: [
      "SYN → SYN-ACK → ACK → connection established → send packets → find missing packet → resend missing packet → rebuild in order",
      "ACK → SYN → connection established → SYN-ACK → rebuild → resend → send packets",
      "SYN → ACK → SYN-ACK → send packets → rebuild → connection established",
      "Connection established → SYN → SYN-ACK → ACK → resend all packets → rebuild",
    ],
    answer:
      "SYN → SYN-ACK → ACK → connection established → send packets → find missing packet → resend missing packet → rebuild in order",
  },
  {
    question:
      "At the rebuild stage, why does the simulation require the packets to be clicked in order 1, 2, 3, 4?",
    options: [
      "To show that TCP uses sequence information to reconstruct the original message correctly",
      "To prove packets always arrive alphabetically before numerically",
      "To show the server no longer matters once a connection is open",
      "To demonstrate that packet order only affects the speed of Wi-Fi, not the data itself",
    ],
    answer:
      "To show that TCP uses sequence information to reconstruct the original message correctly",
  },
];

const overviewCards = [
  {
    step: 1,
    title: "Check both devices are ready",
    text:
      "TCP begins with a 3-way handshake so both sides know they can communicate properly.",
  },
  {
    step: 2,
    title: "Send the packets",
    text:
      "Once the connection is established, data can be sent as packets across the network.",
  },
  {
    step: 3,
    title: "Track order and missing data",
    text:
      "TCP uses packet numbers so the receiver knows the correct order and can detect if something is missing.",
  },
  {
    step: 4,
    title: "Resend only what is missing",
    text:
      "If one packet is lost, TCP can request that missing packet again instead of restarting everything.",
  },
  {
    step: 5,
    title: "Rebuild the original message",
    text:
      "The receiver uses the packet numbers to rebuild the full message in the right order.",
  },
];

const keyIdeas = [
  "TCP helps devices communicate reliably.",
  "The 3-way handshake checks both devices are ready.",
  "If one packet is missing, TCP can request only that packet again.",
  "Packet numbers help rebuild the data in the correct order.",
];

const misconceptionCards = [
  {
    wrong: "TCP sends everything again if one packet is lost.",
    right:
      "TCP can resend only the missing packet if the other packets already arrived.",
  },
  {
    wrong: "TCP starts sending normal data immediately.",
    right:
      "TCP first uses the 3-way handshake to confirm both devices are ready.",
  },
  {
    wrong: "Packet order does not matter.",
    right:
      "TCP uses sequence information so the receiver can rebuild the original message correctly.",
  },
];

const stepLabels = [
  "SYN",
  "SYN-ACK",
  "ACK",
  "Connected",
  "Send",
  "Missing",
  "Resend",
  "Rebuild",
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

function Device({ type, title, subtitle }) {
  const isClient = type === "client";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {isClient ? (
          <Laptop className="h-9 w-9" style={{ color: ST_EDS.blue }} />
        ) : (
          <Server className="h-9 w-9 text-emerald-600" />
        )}
      </div>
      <p className="text-xl font-bold" style={{ color: ST_EDS.navy }}>
        {title}
      </p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusBox({ title, body, tone = "neutral" }) {
  const styles =
    tone === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "info"
      ? "bg-[#eef5ff] text-[#0a4aa3] border-[#bfd7ff]"
      : tone === "danger"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className={`rounded-2xl border p-4 ${styles}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-6 opacity-90">{body}</p>
    </div>
  );
}

function DraggablePacketLane({
  label,
  direction,
  helperText,
  onSuccess,
  connected = false,
}) {
  const laneRef = useRef(null);
  const x = useMotionValue(0);
  const [travelDistance, setTravelDistance] = useState(280);

  useEffect(() => {
    const updateWidth = () => {
      if (!laneRef.current) return;
      const width = laneRef.current.offsetWidth;
      const distance = Math.max(180, width - 250);
      setTravelDistance(distance);
      x.set(0);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [x]);

  const isRight = direction === "right";
  const startClass = isRight ? "left-4 md:left-6" : "right-4 md:right-6";
  const threshold = travelDistance * 0.56;

  const handleDragEnd = () => {
    const current = x.get();

    if (isRight && current >= threshold) {
      x.set(travelDistance);
      setTimeout(() => {
        onSuccess();
        x.set(0);
      }, 180);
      return;
    }

    if (!isRight && current <= -threshold) {
      x.set(-travelDistance);
      setTimeout(() => {
        onSuccess();
        x.set(0);
      }, 180);
      return;
    }

    x.set(0);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Client</span>
        <span>Server</span>
      </div>

      <div
        ref={laneRef}
        className="relative h-28 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 shadow-sm md:px-6"
      >
        <div
          className={`absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full ${
            connected ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />

        <div className="absolute left-3 top-1/2 h-14 w-24 -translate-y-1/2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/80" />
        <div className="absolute right-3 top-1/2 h-14 w-24 -translate-y-1/2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/80" />

        <motion.div
          drag="x"
          dragConstraints={{
            left: isRight ? 0 : -travelDistance,
            right: isRight ? travelDistance : 0,
          }}
          dragElastic={0.05}
          style={{ x }}
          whileDrag={{ scale: 1.03 }}
          onDragEnd={handleDragEnd}
          className={`absolute top-1/2 z-10 -translate-y-1/2 ${startClass} cursor-grab active:cursor-grabbing`}
        >
          <div className="inline-flex min-w-[128px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            {!isRight && <ArrowLeft className="h-4 w-4 text-slate-500" />}
            <GripHorizontal className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-800">{label}</span>
            {isRight && <ArrowRight className="h-4 w-4 text-slate-500" />}
          </div>
        </motion.div>
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">{helperText}</p>
    </div>
  );
}

function PacketDeck({ packets, side = "right" }) {
  const isRight = side === "right";

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${
        isRight ? "right-8" : "left-8"
      }`}
    >
      <div className="relative h-12 w-28">
        {packets.map((packet, index) => (
          <motion.div
            key={`${side}-${packet}`}
            initial={{ opacity: 0, x: isRight ? 8 : -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: index * 0.07, duration: 0.2 }}
            className="absolute top-0"
            style={{ left: `${index * 16}px`, zIndex: index + 1 }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
              <div className="flex flex-col items-center">
                <Package className="h-3.5 w-3.5" />
                <span className="mt-0.5 text-xs font-bold">{packet}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ConnectionTrack({
  direction = "right",
  packets = [],
  slipPacket = null,
  foundMissing = false,
  onSlipClick,
  lineLabel,
  connected = false,
  deckPackets,
}) {
  const isRight = direction === "right";
  const startX = isRight ? "14%" : "86%";
  const endX = isRight ? "78%" : "22%";

  const deliveredPackets =
    deckPackets ?? (slipPacket ? packets.filter((p) => p !== slipPacket) : packets);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>{isRight ? "Client sending" : "Server sending back"}</span>
        <span>{isRight ? "Server receiving" : "Client receiving"}</span>
      </div>

      <div className="relative h-40 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div
          className={`absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full ${
            connected ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />
        <div className="absolute left-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50" />
        <div className="absolute right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50" />

        {lineLabel && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {lineLabel}
          </div>
        )}

        {packets.map((packet, index) => {
          const isSlip = packet === slipPacket;

          return (
            <motion.div
              key={`${direction}-${packet}`}
              initial={{ left: startX, top: "50%", opacity: 0, scale: 0.95 }}
              animate={
                isSlip
                  ? {
                      left: "50%",
                      top: foundMissing ? "70%" : ["50%", "50%", "70%"],
                      opacity: [0, 1, 1],
                      rotate: foundMissing ? -18 : [0, 0, -18],
                    }
                  : {
                      left: endX,
                      top: "50%",
                      opacity: [0, 1, 1, 0],
                      scale: [0.95, 1, 1, 0.96],
                    }
              }
              transition={{
                duration: isSlip ? 0.9 : 0.8,
                delay: index * 0.45,
                ease: "easeInOut",
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              {isSlip ? (
                <button
                  type="button"
                  onClick={onSlipClick}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-md transition ${
                    foundMissing
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <Package className="h-4 w-4" />
                    <span className="mt-1 text-sm font-bold">{packet}</span>
                  </div>
                </button>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm">
                  <div className="flex flex-col items-center">
                    <Package className="h-4 w-4" />
                    <span className="mt-1 text-sm font-bold">{packet}</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {deliveredPackets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: packets.length * 0.4 + 0.1, duration: 0.25 }}
          >
            <PacketDeck packets={deliveredPackets} side={isRight ? "right" : "left"} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PacketButton({ number, onClick, success, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition ${
        success
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } ${disabled ? "cursor-default" : ""}`}
    >
      <div className="flex flex-col items-center">
        <Package className="h-4 w-4" />
        <span className="mt-1 text-sm font-bold">{number}</span>
      </div>
    </button>
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

function ModuleProgress({ currentPage }) {
  const pages = [{ label: "Overview" }, { label: "Activity" }, { label: "Quiz" }];

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

export default function TCP() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  const [phase, setPhase] = useState("syn");
  const [feedback, setFeedback] = useState(
    "Drag SYN from the client side into the server area to begin the TCP connection."
  );

  const [slippedFound, setSlippedFound] = useState(false);
  const [packetOrder, setPacketOrder] = useState([]);
  const [scrambledPackets, setScrambledPackets] = useState([]);

  const [modulePage, setModulePage] = useState(0);
  const [overviewUnlocked, setOverviewUnlocked] = useState(false);
  const [activityUnlocked, setActivityUnlocked] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);

  const overviewRef = useRef(null);

  useEffect(() => {
    setScrambledPackets(shuffleArray([1, 2, 3, 4]));
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
    if (phase === "done") {
      setActivityUnlocked(true);
      setShowCompletionOverlay(true);
      markActivityComplete("/tcp");
    }
  }, [phase]);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers, quizQuestions]);

  useEffect(() => {
    if (submittedQuiz && score >= 6) {
      markQuizPassed("/tcp");
    }
  }, [submittedQuiz, score]);

  const allAnswered =
    quizQuestions.length > 0 &&
    quizQuestions.every((_, index) => typeof selectedAnswers[index] === "string");

  const activeStep = (() => {
    switch (phase) {
      case "syn":
        return 0;
      case "synack":
        return 1;
      case "ack":
        return 2;
      case "connected":
        return 3;
      case "send":
        return 4;
      case "slip":
        return 5;
      case "resend":
        return 6;
      case "rebuild":
      case "done":
        return 7;
      default:
        return 0;
    }
  })();

  const connectionEstablished = [
    "connected",
    "send",
    "slip",
    "resend",
    "rebuild",
    "done",
  ].includes(phase);

  const handleHandshakeSuccess = (packet) => {
    if (packet === "SYN" && phase === "syn") {
      setPhase("synack");
      setFeedback(
        "The server received SYN. Now drag SYN-ACK back to the client. This means the server received the first message and is replying."
      );
      return;
    }

    if (packet === "SYN-ACK" && phase === "synack") {
      setPhase("ack");
      setFeedback(
        "Great. Now drag ACK to the server to complete the handshake. This final message confirms both sides are ready."
      );
      return;
    }

    if (packet === "ACK" && phase === "ack") {
      setPhase("connected");
      setFeedback(
        "The TCP connection is now established. Both devices are ready, so reliable packet transfer can begin."
      );
    }
  };

  const handleSlipClick = () => {
    setSlippedFound(true);
    setFeedback(
      "Correct. Packet 3 is the missing packet. Packets 1, 2, and 4 already arrived, so TCP only needs to request packet 3 again."
    );
  };

  const handleRebuildClick = (number) => {
    if (phase !== "rebuild") return;
    if (packetOrder.includes(number)) return;

    const expected = packetOrder.length + 1;

    if (number === expected) {
      const next = [...packetOrder, number];
      setPacketOrder(next);

      if (next.length === 4) {
        setPhase("done");
        setFeedback(
          "Excellent. TCP rebuilt the packets in the correct order and the full data arrived successfully."
        );
      } else {
        setFeedback(`Good. Now place packet ${expected + 1} next.`);
      }
    } else {
      setFeedback(`Not quite. Packet ${expected} must come next.`);
    }
  };

  const resetSimulation = () => {
    setPhase("syn");
    setFeedback(
      "Drag SYN from the client side into the server area to begin the TCP connection."
    );
    setSlippedFound(false);
    setPacketOrder([]);
    setScrambledPackets(shuffleArray([1, 2, 3, 4]));
    setActivityUnlocked(false);
    setShowCompletionOverlay(false);
  };

  const resetQuiz = () => {
    setSubmittedQuiz(false);
    setSelectedAnswers({});
    setQuizQuestions(buildShuffledQuiz(baseQuizQuestions));
  };

  const stripTone =
    phase === "done" || slippedFound
      ? "success"
      : connectionEstablished
      ? "info"
      : "neutral";

  const stripTitle =
    phase === "syn"
      ? "Step 1: Send SYN"
      : phase === "synack"
      ? "Step 2: Return SYN-ACK"
      : phase === "ack"
      ? "Step 3: Send ACK"
      : phase === "connected"
      ? "Connection established"
      : phase === "send"
      ? "Packets are moving"
      : phase === "slip" && slippedFound
      ? "Missing packet found"
      : phase === "slip"
      ? "Find the missing packet"
      : phase === "resend"
      ? "Packet 3 resent"
      : phase === "rebuild"
      ? "Rebuild the data"
      : "TCP delivery complete";

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
            Transmission Control Protocol (TCP)
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-100">
            Learn how TCP creates a reliable connection, checks both devices are ready,
            handles missing packets, and rebuilds data in the correct order.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <ShieldCheck className="mb-2 h-5 w-5" />
              <p className="font-semibold">Reliable transfer</p>
              <p className="mt-1 text-sm text-slate-200">
                See how TCP confirms both devices are ready before normal transfer begins.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Package className="mb-2 h-5 w-5" />
              <p className="font-semibold">Packet handling</p>
              <p className="mt-1 text-sm text-slate-200">
                Learn how missing packets are detected and resent.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <Trophy className="mb-2 h-5 w-5" />
              <p className="font-semibold">Quiz feedback</p>
              <p className="mt-1 text-sm text-slate-200">
                Review what you selected and compare it to the correct answer.
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
                <Section title="What is TCP?" icon={HelpCircle}>
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
                          TCP is a protocol used to make data transfer reliable. It checks
                          that both devices are ready before normal transfer begins, uses
                          packet numbers to keep track of order, and can resend missing
                          packets if one is lost.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-5">
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
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {card.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" style={{ color: ST_EDS.gold }} />
                        <h3 className="text-lg font-semibold" style={{ color: ST_EDS.navy }}>
                          Real-life analogy
                        </h3>
                      </div>
                      <p className="mt-3 leading-7 text-slate-700">
                        Think of sending numbered pages in a letter. First, both people
                        make sure they are ready to communicate. If one page goes missing,
                        only that page is sent again. The page numbers help the receiver
                        put everything back in the right order.
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
                    <img src={m2Diagram} alt="TCP diagram" className="w-full rounded-2xl" />
                  </div>

                  <div className="mt-8 rounded-3xl border border-[#bfd7ff] bg-[#eef5ff] p-5">
                    <h3 className="font-semibold" style={{ color: ST_EDS.navy }}>
                      What do SYN, SYN-ACK, and ACK mean?
                    </h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="font-semibold" style={{ color: ST_EDS.navy }}>SYN</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          The client starts the connection and says it wants to communicate.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="font-semibold" style={{ color: ST_EDS.navy }}>SYN-ACK</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          The server replies to say it received the message and is ready too.
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white/80 p-4">
                        <p className="font-semibold" style={{ color: ST_EDS.navy }}>ACK</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          The client sends a final confirmation so the connection becomes established.
                        </p>
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
                      On the next page, you will complete the handshake, send the packets,
                      find a missing one, resend it, and rebuild the full message in order.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm leading-6 text-slate-700">
                      Scroll to the bottom of this page to unlock the TCP simulation.
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
              <Section title="Interactive TCP Simulation" icon={ShieldCheck}>
                <div className="relative">
                  <p className="mb-5 leading-7 text-slate-700">
                    Complete the handshake, send the packets, find the missing one, request
                    it again, and rebuild the message in order.
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

                  <StatusBox title={stripTitle} body={feedback} tone={stripTone} />

                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex justify-center">
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          connectionEstablished
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {connectionEstablished
                          ? "Connection established"
                          : "Connection not established"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[160px_minmax(0,1fr)_160px] lg:items-start">
                      <Device type="client" title="Client" subtitle="Your Device" />

                      <div className="flex min-h-[330px] flex-col justify-start">
                        <AnimatePresence mode="wait">
                          {phase === "syn" && (
                            <motion.div
                              key="syn"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <DraggablePacketLane
                                label="SYN"
                                direction="right"
                                onSuccess={() => handleHandshakeSuccess("SYN")}
                                helperText="Drag SYN to the server."
                              />
                            </motion.div>
                          )}

                          {phase === "synack" && (
                            <motion.div
                              key="synack"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <DraggablePacketLane
                                label="SYN-ACK"
                                direction="left"
                                onSuccess={() => handleHandshakeSuccess("SYN-ACK")}
                                helperText="Drag SYN-ACK back to the client."
                                connected
                              />
                            </motion.div>
                          )}

                          {phase === "ack" && (
                            <motion.div
                              key="ack"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <DraggablePacketLane
                                label="ACK"
                                direction="right"
                                onSuccess={() => handleHandshakeSuccess("ACK")}
                                helperText="Drag ACK to the server to finish the handshake."
                                connected
                              />
                            </motion.div>
                          )}

                          {phase === "connected" && (
                            <motion.div
                              key="connected"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  <span>Client ready</span>
                                  <span>Server ready</span>
                                </div>

                                <div className="relative h-36 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                                  <div className="absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-300" />
                                  <div className="absolute left-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50" />
                                  <div className="absolute right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50" />
                                  <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                    Reliable connection ready
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPhase("send");
                                    setFeedback(
                                      "The client now sends the data packets to the server one by one."
                                    );
                                  }}
                                  className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
                                >
                                  Start Sending Packets
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {phase === "send" && (
                            <motion.div
                              key="send"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <ConnectionTrack
                                direction="right"
                                packets={[1, 2, 3, 4]}
                                lineLabel="Client → Server"
                                connected
                              />

                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPhase("slip");
                                    setFeedback(
                                      "The server sends the data back to the client. Packet 3 slips off the line. Tap the fallen packet."
                                    );
                                  }}
                                  className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
                                >
                                  Show Return Trip
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {phase === "slip" && (
                            <motion.div
                              key="slip"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <ConnectionTrack
                                direction="left"
                                packets={[1, 2, 3, 4]}
                                slipPacket={3}
                                onSlipClick={handleSlipClick}
                                lineLabel="Server → Client"
                                connected
                                foundMissing={slippedFound}
                              />

                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  disabled={!slippedFound}
                                  onClick={() => {
                                    if (!slippedFound) return;
                                    setPhase("resend");
                                    setFeedback(
                                      "Only packet 3 is resent. The other packets already arrived correctly."
                                    );
                                  }}
                                  className={`rounded-2xl px-5 py-2 text-white transition ${
                                    slippedFound
                                      ? "bg-[#073674] hover:bg-[#0a4aa3]"
                                      : "cursor-not-allowed bg-slate-400"
                                  }`}
                                >
                                  Request Missing Packet Again
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {phase === "resend" && (
                            <motion.div
                              key="resend"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="space-y-4"
                            >
                              <ConnectionTrack
                                direction="left"
                                packets={[3]}
                                deckPackets={[1, 2, 4]}
                                lineLabel="Server → Client (only packet 3 resent)"
                                connected
                              />

                              <div className="flex justify-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPhase("rebuild");
                                    setFeedback(
                                      "Click the packets in order: 1, 2, 3, 4. This shows how TCP rebuilds the full message."
                                    );
                                  }}
                                  className="rounded-2xl bg-[#073674] px-5 py-2 text-white transition hover:bg-[#0a4aa3]"
                                >
                                  Rebuild Data in Order
                                </button>
                              </div>
                            </motion.div>
                          )}

                          {(phase === "rebuild" || phase === "done") && (
                            <motion.div
                              key="rebuild"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-center text-sm font-semibold text-slate-700">
                                  Rebuild the data in TCP sequence order: 1, 2, 3, 4
                                </p>

                                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                                  {scrambledPackets.map((num) => (
                                    <PacketButton
                                      key={num}
                                      number={num}
                                      onClick={() => handleRebuildClick(num)}
                                      success={packetOrder.includes(num)}
                                      disabled={packetOrder.includes(num) || phase === "done"}
                                    />
                                  ))}
                                </div>

                                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                                  <p className="mb-3 text-center text-sm font-semibold text-slate-700">
                                    Packets rebuilt here
                                  </p>

                                  <div className="flex min-h-[56px] flex-wrap items-center justify-center gap-2">
                                    {packetOrder.length === 0 ? (
                                      <span className="text-sm text-slate-400">
                                        Ordered packets will appear here
                                      </span>
                                    ) : (
                                      packetOrder.map((num) => (
                                        <motion.div
                                          key={num}
                                          initial={{ opacity: 0, y: 8 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700"
                                        >
                                          {num}
                                        </motion.div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Device type="server" title="Server" subtitle="Web Server" />
                    </div>
                  </div>

                  {phase === "done" && (
                    <div className="mt-5">
                      <StatusBox
                        title="Client received the full message"
                        body="TCP used packet numbers and retransmission to make sure the data arrived reliably."
                        tone="success"
                      />
                    </div>
                  )}

                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={resetSimulation}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Restart Simulation
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
                            You successfully completed the full TCP process, including the
                            handshake, missing packet detection, retransmission, and rebuild.
                          </p>

                          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                              type="button"
                              onClick={resetSimulation}
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
                      : "Complete the full TCP simulation to unlock the quiz."}
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
                        ? "Excellent work — you clearly understand how TCP establishes reliability, handles missing packets, and rebuilds data."
                        : score >= 6
                        ? "Good job — you understand most of TCP, but review the handshake sequence and exactly what happens when a packet goes missing."
                        : score >= 4
                        ? "Decent effort — revisit the interactive simulation, especially the difference between connection setup, retransmission, and rebuilding."
                        : "This quiz is meant to reward real understanding. Go back through the full module and pay close attention to the order of steps."}
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

                     <a href="/#module2"><button
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