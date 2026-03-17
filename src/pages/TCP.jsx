import { useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GripHorizontal,
  HelpCircle,
  Laptop,
  Package,
  RefreshCcw,
  Server,
  ShieldCheck,
} from "lucide-react"
import { AnimatePresence, motion, useMotionValue } from "framer-motion"

const quizQuestions = [
  {
    question: "What is the purpose of the TCP 3-way handshake?",
    options: [
      "To delete packets",
      "To establish a reliable connection between devices",
      "To turn Wi-Fi on",
    ],
    answer: "To establish a reliable connection between devices",
  },
  {
    question: "What does TCP do if a packet goes missing?",
    options: [
      "Ignore it",
      "Ask for the missing packet again",
      "Restart the internet",
    ],
    answer: "Ask for the missing packet again",
  },
  {
    question: "Why are packets numbered?",
    options: [
      "To rebuild the data in the correct order",
      "To decorate them",
      "To slow down the network",
    ],
    answer: "To rebuild the data in the correct order",
  },
]

function shuffleArray(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

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
  )
}

function StepChip({ active, complete, children }) {
  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? "bg-slate-900 text-white"
          : complete
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-500"
      }`}
    >
      {children}
    </div>
  )
}

function StatusStrip({ title, body, tone = "neutral" }) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "info"
        ? "border-blue-200 bg-blue-50 text-blue-800"
        : "border-slate-200 bg-slate-50 text-slate-700"

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneClasses}`}>
      <div className="flex items-start gap-3">
        {tone === "success" && (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
        )}
        <div>
          <p className="font-semibold">{title}</p>
          {body ? <p className="mt-1 text-sm opacity-90">{body}</p> : null}
        </div>
      </div>
    </div>
  )
}

function DeviceColumn({ side, title, subtitle }) {
  const isClient = side === "client"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        {isClient ? (
          <Laptop className="h-9 w-9 text-blue-600" />
        ) : (
          <Server className="h-9 w-9 text-emerald-600" />
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{title}</p>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  )
}

function PacketBox({
  number,
  onClick,
  disabled,
  success,
  danger,
  highlighted,
  size = "md",
}) {
  const sizeClasses =
    size === "sm"
      ? "h-12 w-12"
      : size === "lg"
        ? "h-20 w-20"
        : "h-16 w-16"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex ${sizeClasses} items-center justify-center rounded-2xl border transition ${
        success
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : danger
            ? "border-rose-300 bg-rose-50 text-rose-700"
            : highlighted
              ? "border-blue-300 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-700"
      } ${disabled ? "cursor-default" : "hover:border-slate-300 hover:bg-slate-50"}`}
    >
      <div className="flex flex-col items-center justify-center">
        <Package className="h-4 w-4" />
        <span className="mt-1 text-sm font-bold">{number}</span>
      </div>
    </button>
  )
}

function PacketDeck({ packets, side = "right" }) {
  const isRight = side === "right"

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 ${isRight ? "right-10" : "left-10"}`}
    >
      <div className="relative h-14 w-28">
        {packets.map((packet, index) => (
          <motion.div
            key={`deck-${side}-${packet}`}
            initial={{ opacity: 0, x: isRight ? 10 : -10, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: index * 0.08, duration: 0.2 }}
            className="absolute top-0"
            style={{
              left: `${index * 16}px`,
              zIndex: index + 1,
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm">
              <div className="flex flex-col items-center">
                <Package className="h-3.5 w-3.5" />
                <span className="mt-0.5 text-xs font-bold">{packet}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function DraggablePacketLane({
  label,
  direction,
  helperText,
  onSuccess,
  connected = false,
}) {
  const laneRef = useRef(null)
  const x = useMotionValue(0)
  const [travelDistance, setTravelDistance] = useState(280)

  useEffect(() => {
    const updateWidth = () => {
      if (!laneRef.current) return
      const width = laneRef.current.offsetWidth
      const distance = Math.max(180, width - 250)
      setTravelDistance(distance)
      x.set(0)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [x])

  const isRight = direction === "right"
  const startClass = isRight ? "left-4 md:left-6" : "right-4 md:right-6"
  const threshold = travelDistance * 0.58

  const handleDragEnd = () => {
    const current = x.get()

    if (isRight && current >= threshold) {
      x.set(travelDistance)
      setTimeout(() => {
        onSuccess()
        x.set(0)
      }, 220)
      return
    }

    if (!isRight && current <= -threshold) {
      x.set(-travelDistance)
      setTimeout(() => {
        onSuccess()
        x.set(0)
      }, 220)
      return
    }

    x.set(0)
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Client side</span>
        <span>Server side</span>
      </div>

      <div
        ref={laneRef}
        className="relative h-32 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 shadow-sm md:px-6"
      >
        <div
          className={`absolute left-10 right-10 top-1/2 h-2 -translate-y-1/2 rounded-full ${
            connected ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />

        <div className="absolute left-3 top-1/2 h-14 w-28 -translate-y-1/2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/80" />
        <div className="absolute right-3 top-1/2 h-14 w-28 -translate-y-1/2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/80" />

        <div className="absolute left-5 top-4 text-[11px] font-semibold text-blue-600">
          Client
        </div>
        <div className="absolute right-5 top-4 text-[11px] font-semibold text-emerald-600">
          Server
        </div>

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
          <div className="inline-flex min-w-[118px] items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            {!isRight && <ArrowLeft className="h-4 w-4 text-slate-500" />}
            <GripHorizontal className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-800">{label}</span>
            {isRight && <ArrowRight className="h-4 w-4 text-slate-500" />}
          </div>
        </motion.div>
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">{helperText}</p>
    </div>
  )
}

function ConnectionEstablishedTrack() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Client ready</span>
        <span>Server ready</span>
      </div>

      <div className="relative h-44 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div className="absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-300" />

        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50" />
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50" />
        </div>

        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
          Reliable connection ready
        </div>
      </div>
    </div>
  )
}

function ConnectionTrack({
  direction = "right",
  packets = [],
  slipPacket = null,
  onSlipClick,
  lineLabel,
  connected = false,
  foundMissing = false,
  deckPackets,
}) {
  const isRight = direction === "right"

  const startX = isRight ? "14%" : "86%"
  const travelEndX = isRight ? "78%" : "22%"

  const deliveredPackets =
    deckPackets ??
    (slipPacket ? packets.filter((packet) => packet !== slipPacket) : packets)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>{isRight ? "Client sending" : "Server sending back"}</span>
        <span>{isRight ? "Server receiving" : "Client receiving"}</span>
      </div>

      <div className="relative h-44 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div
          className={`absolute left-8 right-8 top-1/2 h-2 -translate-y-1/2 rounded-full ${
            connected ? "bg-emerald-300" : "bg-slate-200"
          }`}
        />

        <div className="absolute left-6 top-1/2 -translate-y-1/2">
          <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50" />
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50" />
        </div>

        {lineLabel && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
            {lineLabel}
          </div>
        )}

        {packets.map((packet, index) => {
          const shouldSlip = packet === slipPacket

          return (
            <motion.div
              key={`${direction}-${packet}`}
              initial={{
                left: startX,
                top: "50%",
                opacity: 0,
                scale: 0.95,
              }}
              animate={
                shouldSlip
                  ? {
                      left: "50%",
                      top: foundMissing ? "70%" : ["50%", "50%", "70%"],
                      opacity: [0, 1, 1],
                      rotate: foundMissing ? -18 : [0, 0, -18],
                    }
                  : {
                      left: travelEndX,
                      top: "50%",
                      opacity: [0, 1, 1, 0],
                      scale: [0.95, 1, 1, 0.96],
                    }
              }
              transition={{
                duration: shouldSlip ? 0.9 : 0.85,
                delay: index * 0.55,
                ease: "easeInOut",
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              {shouldSlip ? (
                <button
                  type="button"
                  onClick={onSlipClick}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border shadow-md transition ${
                    foundMissing
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-100"
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
          )
        })}

        {deliveredPackets.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: packets.length * 0.55 + 0.2,
              duration: 0.25,
            }}
          >
            <PacketDeck
              packets={deliveredPackets}
              side={isRight ? "right" : "left"}
            />
          </motion.div>
        )}

        {foundMissing && !isRight && slipPacket && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-1/2 bottom-4 -translate-x-1/2"
          >
            <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Missing packet found
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
export default function TCP() {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submittedQuiz, setSubmittedQuiz] = useState(false)

  const [phase, setPhase] = useState("syn")
  const [feedback, setFeedback] = useState(
    "Drag SYN from the client side into the server area to begin the TCP connection."
  )

  const [slippedFound, setSlippedFound] = useState(false)
  const [resent, setResent] = useState(false)
  const [packetOrder, setPacketOrder] = useState([])
  const [scrambledPackets, setScrambledPackets] = useState([])

  useEffect(() => {
    setScrambledPackets(shuffleArray([1, 2, 3, 4]))
  }, [])

  const score = useMemo(() => {
    return quizQuestions.reduce((total, q, i) => {
      return total + (selectedAnswers[i] === q.answer ? 1 : 0)
    }, 0)
  }, [selectedAnswers])

  const stepLabels = [
    "SYN",
    "SYN-ACK",
    "ACK",
    "Connected",
    "Send",
    "Slip",
    "Resend",
    "Rebuild",
  ]

  const activeStep = (() => {
    switch (phase) {
      case "syn":
        return 0
      case "synack":
        return 1
      case "ack":
        return 2
      case "connected":
        return 3
      case "send":
        return 4
      case "slip":
        return 5
      case "resend":
        return 6
      case "rebuild":
      case "done":
        return 7
      default:
        return 0
    }
  })()

  const connectionEstablished =
    phase === "connected" ||
    phase === "send" ||
    phase === "slip" ||
    phase === "resend" ||
    phase === "rebuild" ||
    phase === "done"

  const handleHandshakeSuccess = (packet) => {
    if (packet === "SYN" && phase === "syn") {
      setPhase("synack")
      setFeedback(
        "Great. The server received SYN. Now drag SYN-ACK back into the client area."
      )
      return
    }

    if (packet === "SYN-ACK" && phase === "synack") {
      setPhase("ack")
      setFeedback(
        "Nice. Now drag ACK into the server area to complete the TCP 3-way handshake."
      )
      return
    }

    if (packet === "ACK" && phase === "ack") {
      setPhase("connected")
      setFeedback(
        "The TCP connection is now established. Notice the green line. Click the next step to begin sending data packets."
      )
    }
  }

  const handleStartSending = () => {
    setPhase("send")
    setFeedback(
      "The client now sends the data packets to the server one by one."
    )
  }

  const handleStartReturnTrip = () => {
    setPhase("slip")
    setFeedback(
      "The server sends the data back to the client. Packet 3 slips off the line. Tap the fallen packet."
    )
  }

  const handleSlipClick = () => {
    setSlippedFound(true)
    setFeedback(
      "Correct. Packet 3 is the missing packet. Packets 1, 2, and 4 already arrived, so TCP only needs to request packet 3 again."
    )
  }

  const handleResend = () => {
    if (!slippedFound) {
      setFeedback(
        "Tap the slipped packet first so TCP knows which packet is missing."
      )
      return
    }

    setResent(true)
    setPhase("resend")
    setFeedback(
      "Only packet 3 is resent. The other packets were already received correctly, so the client now has all four packets."
    )
  }

  const handleRebuildStart = () => {
    setPhase("rebuild")
    setFeedback(
      "Click the packets in order: 1, 2, 3, 4. This shows how the client reassembles the full message."
    )
  }

  const handleRebuildClick = (number) => {
    if (!resent || phase !== "rebuild") return
    if (packetOrder.includes(number)) return

    const expected = packetOrder.length + 1

    if (number === expected) {
      const next = [...packetOrder, number]
      setPacketOrder(next)

      if (next.length === 4) {
        setPhase("done")
        setFeedback(
          "Excellent. TCP rebuilt the packets in the correct order and the client received the full data."
        )
      } else {
        setFeedback(`Good. Now place packet ${expected + 1} next.`)
      }
    } else {
      setFeedback(`Not quite. Packet ${expected} must come next.`)
    }
  }

  const resetSimulation = () => {
    setPhase("syn")
    setFeedback(
      "Drag SYN from the client side into the server area to begin the TCP connection."
    )
    setSlippedFound(false)
    setResent(false)
    setPacketOrder([])
    setScrambledPackets(shuffleArray([1, 2, 3, 4]))
  }

  const submitQuiz = () => setSubmittedQuiz(true)

  const resetQuiz = () => {
    setSubmittedQuiz(false)
    setSelectedAnswers({})
  }

  const packetMotion = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  }

  const stripTone =
    phase === "done" || slippedFound
      ? "success"
      : phase === "connected" ||
          phase === "send" ||
          phase === "slip" ||
          phase === "resend" ||
          phase === "rebuild"
        ? "info"
        : "neutral"

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
              ? "Packets are moving to the server"
              : phase === "slip" && slippedFound
                ? "Missing packet found"
                : phase === "slip"
                  ? "Find the slipped packet"
                  : phase === "resend"
                    ? "Packet 3 resent"
                    : phase === "rebuild"
                      ? "Rebuild the data"
                      : "TCP delivery complete"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 2
          </span>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Transmission Control Protocol (TCP)
          </h1>
        </header>
 <SectionCard title="What is TCP?" icon={HelpCircle}>
<p>
  TCP is a core protocol of the Internet that enables reliable communication between devices. It establishes a connection, ensures data is delivered in order, and handles any lost packets along the way. TCP is like the postal service of the internet, making sure your messages get to the right place intact.
</p>
           <div className=" mt-6 mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              Real-life analogy
            </h3>
            <p className="text-slate-700 leading-7">
TCP is like sending a package through the mail with tracking. You put your items in a box (data packets), label it with the destination address (IP address), and drop it off at the post office (network). The postal service (TCP) takes care of delivering it to the recipient, making sure it arrives safely and in the right order. If a package gets lost, you can request a replacement, and the postal service will resend it until it reaches its destination.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Interactive TCP Simulation" icon={ShieldCheck}>
          <p className="mb-6 text-slate-700">
            Complete the handshake, follow the packet boxes, find the slipped
            packet, request it again, and rebuild the data so the client
            receives the full message.
          </p>

          <div className="mb-6 flex flex-wrap gap-2">
            {stepLabels.map((label, index) => (
              <StepChip
                key={label}
                active={activeStep === index}
                complete={activeStep > index}
              >
                {label}
              </StepChip>   
            ))}
          </div>

          <div className="mb-4">
            <StatusStrip title={stripTitle} body={feedback} tone={stripTone} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex justify-center">
              <motion.div
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  connectionEstablished
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
                animate={{
                  opacity: 1,
                  scale: connectionEstablished ? 1 : 0.98,
                }}
              >
                {connectionEstablished
                  ? "Connection established"
                  : "Connection not established"}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:items-start">
              <DeviceColumn side="client" title="Client" subtitle="Your Device" />

              <div className="flex min-h-[360px] flex-col justify-start">
                <AnimatePresence mode="wait">
                  {phase === "syn" && (
                    <motion.div key="syn" {...packetMotion}>
                      <DraggablePacketLane
                        label="SYN"
                        direction="right"
                        onSuccess={() => handleHandshakeSuccess("SYN")}
                        helperText="Drag SYN to the server."
                        connected={false}
                      />
                    </motion.div>
                  )}

                  {phase === "synack" && (
                    <motion.div key="synack" {...packetMotion}>
                      <DraggablePacketLane
                        label="SYN-ACK"
                        direction="left"
                        onSuccess={() => handleHandshakeSuccess("SYN-ACK")}
                        helperText="Drag SYN-ACK back to the client."
                        connected={false}
                      />
                    </motion.div>
                  )}

                  {phase === "ack" && (
                    <motion.div key="ack" {...packetMotion}>
                      <DraggablePacketLane
                        label="ACK"
                        direction="right"
                        onSuccess={() => handleHandshakeSuccess("ACK")}
                        helperText="Drag ACK to the server to finish the handshake."
                        connected={false}
                      />
                    </motion.div>
                  )}

                  {phase === "connected" && (
                    <motion.div
                      key="connected"
                      {...packetMotion}
                      className="space-y-4"
                    >
                      <ConnectionEstablishedTrack />

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleStartSending}
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                        >
                          Start Sending Packets
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {phase === "send" && (
                    <motion.div key="send" {...packetMotion} className="space-y-4">
                      <ConnectionTrack
                        direction="right"
                        packets={[1, 2, 3, 4]}
                        lineLabel="Client → Server"
                        connected
                      />

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleStartReturnTrip}
                          className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
                        >
                          Show Return Trip
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {phase === "slip" && (
                    <motion.div key="slip" {...packetMotion} className="space-y-4">
                      <ConnectionTrack
                        direction="left"
                        packets={[1, 2, 3, 4]}
                        slipPacket={3}
                        onSlipClick={handleSlipClick}
                        lineLabel="Server → Client"
                        connected
                        foundMissing={slippedFound}
                      />

                      {slippedFound && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <StatusStrip
                            title="Packet 3 found"
                            body="Packets 1, 2, and 4 already arrived. TCP only needs to request packet 3 again."
                            tone="success"
                          />
                        </motion.div>
                      )}

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleResend}
                          className={`rounded-2xl px-5 py-2 text-white transition ${
                            slippedFound
                              ? "bg-slate-900 hover:bg-slate-800"
                              : "cursor-not-allowed bg-slate-400"
                          }`}
                          disabled={!slippedFound}
                        >
                          Request Missing Packet Again
                        </button>
                      </div>
                    </motion.div>
                  )}

{phase === "resend" && (
  <motion.div key="resend" {...packetMotion} className="space-y-4">
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
        onClick={handleRebuildStart}
        className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
      >
        Rebuild Data in Order
      </button>
    </div>
  </motion.div>
)}

                  {(phase === "rebuild" || phase === "done") && (
                    <motion.div key="rebuild" {...packetMotion}>
                      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="mb-3 text-center text-sm font-semibold text-slate-700">
                          Rebuild the data in TCP sequence order: 1, 2, 3, 4
                        </p>

                        <p className="mb-5 text-center text-sm text-slate-500">
                          Click the packets in the correct order to show how the
                          client reassembles the full message.
                        </p>

                        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                          {scrambledPackets.map((num) => (
                            <PacketBox
                              key={num}
                              number={num}
                              onClick={() => handleRebuildClick(num)}
                              disabled={
                                packetOrder.includes(num) || phase === "done"
                              }
                              success={packetOrder.includes(num)}
                            />
                          ))}
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="mb-3 text-center text-sm font-semibold text-slate-700">
                            Client rebuilds the data here
                          </p>

                          <div className="flex min-h-[64px] flex-wrap items-center justify-center gap-2">
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
                                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-700"
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

              <DeviceColumn side="server" title="Server" subtitle="Web Server" />
            </div>
          </div>

          {phase === "done" && (
            <div className="mt-4">
              <StatusStrip
                title="Client received the full message"
                body="TCP used sequence numbers to rebuild the data correctly."
                tone="success"
              />
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={resetSimulation}
              className="flex items-center gap-2 rounded-2xl border border-slate-300 px-5 py-2 text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Restart Simulation
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Quick Quiz" icon={HelpCircle}>
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
                  {q.options.map((option) => {
                    const isSelected = selectedAnswers[i] === option
                    const isCorrect = q.answer === option

                    let style = "border-slate-200 bg-white text-slate-700"

                    if (submittedQuiz) {
                      if (isCorrect) {
                        style =
                          "border-emerald-300 bg-emerald-50 text-emerald-800"
                      } else if (isSelected) {
                        style = "border-rose-300 bg-rose-50 text-rose-800"
                      }
                    } else if (isSelected) {
                      style = "border-slate-900 bg-slate-900 text-white"
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={submittedQuiz}
                        onClick={() =>
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [i]: option,
                          }))
                        }
                        className={`rounded-xl border p-3 text-left transition ${style}`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={submitQuiz}
              className="rounded-2xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800"
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

          {submittedQuiz && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-900">
                Your Score: {score} / {quizQuestions.length}
              </h3>

              <p className="mt-2 text-slate-600">
                {score === 3
                  ? "Excellent work — you understand how TCP ensures reliable communication."
                  : score === 2
                    ? "Good job — review the handshake, retransmission, and sequence number steps."
                    : "Review the simulation and try again."}
              </p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}