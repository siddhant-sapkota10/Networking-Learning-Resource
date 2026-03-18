import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  GripHorizontal,
  HelpCircle,
  Laptop,
  Package,
  RefreshCcw,
  Server,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

const quizQuestions = [
  {
    question: "Why does TCP use a 3-way handshake?",
    options: [
      "To establish a reliable connection between devices",
      "To turn Wi-Fi on",
      "To delete packets",
    ],
    answer: "To establish a reliable connection between devices",
  },
  {
    question: "What does TCP do if a packet goes missing?",
    options: [
      "Ask for the missing packet again",
      "Ignore it",
      "Restart the internet",
    ],
    answer: "Ask for the missing packet again",
  },
  {
    question: "Why are packets numbered in TCP?",
    options: [
      "To rebuild the data in the correct order",
      "To decorate them",
      "To slow down the network",
    ],
    answer: "To rebuild the data in the correct order",
  },
  {
    question: "Which idea best describes TCP?",
    options: [
      "A rule that helps internet data arrive reliably",
      "A screen brightness setting",
      "A type of keyboard cable",
    ],
    answer: "A rule that helps internet data arrive reliably",
  },
];

const keyIdeas = [
  "TCP helps devices communicate reliably.",
  "The 3-way handshake checks both devices are ready.",
  "If one packet is missing, TCP can request only that packet again.",
  "Packet numbers help rebuild the data in the correct order.",
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

function Device({ type, title, subtitle }) {
  const isClient = type === "client";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {isClient ? (
          <Laptop className="h-9 w-9 text-blue-600" />
        ) : (
          <Server className="h-9 w-9 text-emerald-600" />
        )}
      </div>
      <p className="text-xl font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function StatusBox({ title, body, tone = "neutral" }) {
  const styles =
    tone === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "info"
      ? "bg-blue-50 text-blue-800 border-blue-200"
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

export default function TCP() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const [phase, setPhase] = useState("syn");
  const [feedback, setFeedback] = useState(
    "Drag SYN from the client side into the server area to begin the TCP connection."
  );

  const [slippedFound, setSlippedFound] = useState(false);
  const [packetOrder, setPacketOrder] = useState([]);
  const [scrambledPackets, setScrambledPackets] = useState([]);

  useEffect(() => {
    setScrambledPackets(shuffleArray([1, 2, 3, 4]));
  }, []);

  const score = useMemo(() => {
    return quizQuestions.reduce(
      (total, q, i) => total + (selectedAnswers[i] === q.answer ? 1 : 0),
      0
    );
  }, [selectedAnswers]);

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

  const connectionEstablished = ["connected", "send", "slip", "resend", "rebuild", "done"].includes(phase);

  const handleHandshakeSuccess = (packet) => {
    if (packet === "SYN" && phase === "syn") {
      setPhase("synack");
      setFeedback("The server received SYN. Now drag SYN-ACK back to the client.");
      return;
    }

    if (packet === "SYN-ACK" && phase === "synack") {
      setPhase("ack");
      setFeedback("Great. Now drag ACK to the server to complete the handshake.");
      return;
    }

    if (packet === "ACK" && phase === "ack") {
      setPhase("connected");
      setFeedback("The TCP connection is now established. Both devices are ready.");
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 2
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
            Transmission Control Protocol (TCP)
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Learn how TCP creates a reliable connection, resends missing data,
            and rebuilds packets in the correct order.
          </p>
        </header>

        <Section title="What is TCP?" icon={HelpCircle}>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="leading-7 text-slate-700">
                TCP is a rule used on the internet to make communication reliable.
                Before data is sent, TCP checks both devices are ready. It also
                keeps packets in order and can request missing packets again if one
                is lost.
              </p>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Real-life analogy
                </h3>
                <p className="mt-2 leading-7 text-slate-700">
                  Think of sending numbered pages in a letter. First, both people
                  make sure they are ready to communicate. If one page goes
                  missing, only that page is sent again. The page numbers help the
                  receiver put everything back in the right order.
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

        <Section title="Interactive TCP Simulation" icon={ShieldCheck}>
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
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
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
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
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
                              ? "bg-slate-900 hover:bg-slate-800"
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
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
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
                  ? "Excellent work — you understand how TCP helps internet communication stay reliable."
                  : score >= 2
                  ? "Good job — review the handshake, missing packet, and rebuild steps once more."
                  : "Review the simulation and try again."}
              </p>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}