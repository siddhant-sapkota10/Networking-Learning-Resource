import { useEffect, useMemo, useRef, useState } from "react"
import {
  Laptop,
  Server,
  Package,
  RefreshCcw,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  GripHorizontal,
} from "lucide-react"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"

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

function DraggablePacketLane({
  label,
  direction,
  disabled,
  onSuccess,
  helperText,
}) {
  const x = useMotionValue(0)
  const laneRef = useRef(null)
  const [maxDrag, setMaxDrag] = useState(220)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const updateWidth = () => {
      if (!laneRef.current) return
      const width = laneRef.current.offsetWidth
      const travelSpace = Math.max(140, width / 2 - 70)
      setMaxDrag(travelSpace)
      x.set(0)
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [x])

  const targetReached =
    direction === "right" ? x.get() >= maxDrag * 0.78 : x.get() <= -maxDrag * 0.78

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>Client side</span>
        <span>Server side</span>
      </div>

      <div
        ref={laneRef}
        className="relative h-24 overflow-hidden rounded-3xl border border-slate-200 bg-white px-4 shadow-sm"
      >
        <div className="absolute left-4 right-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />

        <div className="absolute left-3 top-1/2 h-10 w-24 -translate-y-1/2 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/70" />
        <div className="absolute right-3 top-1/2 h-10 w-24 -translate-y-1/2 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/70" />

        <div className="absolute left-4 top-3 text-[11px] font-semibold text-blue-600">
          Client
        </div>
        <div className="absolute right-4 top-3 text-[11px] font-semibold text-emerald-600">
          Server
        </div>

        <motion.div
          drag={!disabled ? "x" : false}
          dragConstraints={{ left: -maxDrag, right: maxDrag }}
          dragElastic={0.03}
          style={{ x }}
          whileDrag={{ scale: 1.03 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={() => {
            setDragging(false)

            if (targetReached) {
              onSuccess()
            }

            x.set(0)
          }}
          className={`absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 ${
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-grab active:cursor-grabbing"
          }`}
        >
          <div
            className={`inline-flex min-w-[110px] select-none items-center justify-center gap-2 rounded-2xl border px-4 py-3 shadow-sm transition ${
              dragging
                ? "border-slate-400 bg-slate-100"
                : "border-slate-200 bg-white"
            }`}
          >
            {direction === "left" && <ArrowLeft className="h-4 w-4 text-slate-500" />}
            <GripHorizontal className="h-4 w-4 text-slate-400" />
            <span className="font-semibold text-slate-800">{label}</span>
            {direction === "right" && <ArrowRight className="h-4 w-4 text-slate-500" />}
          </div>
        </motion.div>
      </div>

      <p className="mt-3 text-center text-sm text-slate-500">{helperText}</p>
    </div>
  )
}

function PacketPill({ number, lost, highlight, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition ${
        lost
          ? "border-amber-300 bg-amber-50 text-amber-700"
          : highlight
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-white text-slate-700"
      } ${disabled ? "cursor-default" : "hover:border-slate-300 hover:bg-slate-50"}`}
    >
      <div className="flex flex-col items-center">
        <Package className="h-4 w-4" />
        <span className="text-xs font-bold">{number}</span>
      </div>
    </button>
  )
}

function MissingPacketSlot({ selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed transition ${
        selected
          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
          : "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
      }`}
    >
      <div className="flex flex-col items-center">
        <Package className="h-4 w-4" />
        <span className="text-xs font-bold">?</span>
      </div>
    </button>
  )
}

function shuffleArray(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function TCP() {
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submittedQuiz, setSubmittedQuiz] = useState(false)

  const [handshakeStep, setHandshakeStep] = useState(0)
  const [handshakeFeedback, setHandshakeFeedback] = useState(
    "Drag SYN all the way across from the client to the server to begin the connection."
  )
  const [connectionEstablished, setConnectionEstablished] = useState(false)

  const [showPacketPhase, setShowPacketPhase] = useState(false)
  const [clickedMissingPacket, setClickedMissingPacket] = useState(null)
  const [resent, setResent] = useState(false)
  const [rebuilt, setRebuilt] = useState(false)

  const [packetOrder, setPacketOrder] = useState([])
  const [scrambledPackets, setScrambledPackets] = useState([])

  const correctMissingPacket = 3

  const stepLabels = ["SYN", "SYN-ACK", "ACK", "Packets", "Resend", "Rebuild"]

  useEffect(() => {
    setScrambledPackets(shuffleArray([1, 2, 3, 4]))
  }, [])

  const score = useMemo(() => {
    return quizQuestions.reduce((total, q, i) => {
      return total + (selectedAnswers[i] === q.answer ? 1 : 0)
    }, 0)
  }, [selectedAnswers])

  const handleAnswerSelect = (index, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [index]: option }))
  }

  const submitQuiz = () => setSubmittedQuiz(true)

  const resetQuiz = () => {
    setSubmittedQuiz(false)
    setSelectedAnswers({})
  }

  const activeStep = rebuilt
    ? 5
    : resent
    ? 4
    : showPacketPhase
    ? 3
    : handshakeStep

  const handleHandshakeSuccess = (packet) => {
    if (packet === "SYN" && handshakeStep === 0) {
      setHandshakeStep(1)
      setHandshakeFeedback(
        "Great. The server received SYN. Now drag SYN-ACK all the way back to the client."
      )
      return
    }

    if (packet === "SYN-ACK" && handshakeStep === 1) {
      setHandshakeStep(2)
      setHandshakeFeedback(
        "Nice. Now drag ACK all the way back to the server to finish the 3-way handshake."
      )
      return
    }

    if (packet === "ACK" && handshakeStep === 2) {
      setHandshakeStep(3)
      setConnectionEstablished(true)
      setShowPacketPhase(true)
      setHandshakeFeedback(
        "Connection established. One packet went missing during transfer. Click the missing packet gap to identify it."
      )
    }
  }

  const handleMissingPacketClick = () => {
    setClickedMissingPacket(correctMissingPacket)
    setHandshakeFeedback(
      "Correct. Packet 3 is missing. TCP detects the missing sequence number and requests packet 3 again."
    )
  }

  const handleResend = () => {
    if (clickedMissingPacket === correctMissingPacket) {
      setResent(true)
      setHandshakeFeedback(
        "Packet 3 has been resent. Now rebuild the message. TCP uses sequence numbers to place packets back into the correct order."
      )
    } else {
      setHandshakeFeedback("First identify which packet is missing.")
    }
  }

  const handleRebuildClick = (number) => {
    if (!resent) return
    if (packetOrder.includes(number)) return

    const expected = packetOrder.length + 1

    if (number === expected) {
      const nextOrder = [...packetOrder, number]
      setPacketOrder(nextOrder)

      if (nextOrder.length === 4) {
        setRebuilt(true)
        setHandshakeFeedback(
          "Excellent. TCP used sequence numbers to rebuild the data in the correct order."
        )
      } else {
        setHandshakeFeedback(
          `Good. TCP expects packet ${expected + 1} next based on the sequence numbers.`
        )
      }
    } else {
      setHandshakeFeedback(
        `Not quite. TCP reorders packets by sequence number, so packet ${expected} must be placed next.`
      )
    }
  }

  const resetSimulation = () => {
    setHandshakeStep(0)
    setHandshakeFeedback(
      "Drag SYN all the way across from the client to the server to begin the connection."
    )
    setConnectionEstablished(false)
    setShowPacketPhase(false)
    setClickedMissingPacket(null)
    setResent(false)
    setRebuilt(false)
    setPacketOrder([])
    setScrambledPackets(shuffleArray([1, 2, 3, 4]))
  }

  const packetMotion = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.35 },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Module 2
          </span>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            TCP: Reliable Data Communication
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            TCP ensures reliable communication across the internet. It begins
            with a connection setup called the <strong>3-way handshake</strong>,
            then sends data in packets. If packets go missing, TCP requests them
            again and uses <strong>sequence numbers</strong> to rebuild the data
            in the correct order.
          </p>
        </header>

        <SectionCard title="Interactive TCP Simulation" icon={ShieldCheck}>
          <p className="mb-6 text-slate-700">
            Complete the handshake by dragging each packet all the way to the
            correct side, then identify the missing packet, resend it, and
            rebuild the message in sequence number order.
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

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:items-start">
              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <Laptop className="h-9 w-9 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">Client</p>
                <p className="text-sm text-slate-500">Your Device</p>
              </div>

              <div className="relative min-h-[360px]">
                <div className="absolute left-0 right-0 top-8 flex items-center justify-center">
                  <motion.div
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
                    initial={false}
                    animate={{
                      opacity: connectionEstablished ? 1 : 0.75,
                      scale: connectionEstablished ? 1 : 0.98,
                    }}
                  >
                    {connectionEstablished
                      ? "Connection established"
                      : "Connection not established yet"}
                  </motion.div>
                </div>

                <AnimatePresence mode="wait">
                  {!showPacketPhase && handshakeStep === 0 && (
                    <motion.div
                      key="syn-lane"
                      {...packetMotion}
                      className="absolute inset-x-0 top-24"
                    >
                      <DraggablePacketLane
                        label="SYN"
                        direction="right"
                        onSuccess={() => handleHandshakeSuccess("SYN")}
                        helperText="Step 1: The client sends SYN to request a TCP connection."
                      />
                    </motion.div>
                  )}

                  {!showPacketPhase && handshakeStep === 1 && (
                    <motion.div
                      key="synack-lane"
                      {...packetMotion}
                      className="absolute inset-x-0 top-24"
                    >
                      <DraggablePacketLane
                        label="SYN-ACK"
                        direction="left"
                        onSuccess={() => handleHandshakeSuccess("SYN-ACK")}
                        helperText="Step 2: The server replies with SYN-ACK to confirm it is ready."
                      />
                    </motion.div>
                  )}

                  {!showPacketPhase && handshakeStep === 2 && (
                    <motion.div
                      key="ack-lane"
                      {...packetMotion}
                      className="absolute inset-x-0 top-24"
                    >
                      <DraggablePacketLane
                        label="ACK"
                        direction="right"
                        onSuccess={() => handleHandshakeSuccess("ACK")}
                        helperText="Step 3: The client sends ACK back to complete the TCP 3-way handshake."
                      />
                    </motion.div>
                  )}

                  {showPacketPhase && !resent && (
                    <motion.div
                      key="packet-phase"
                      {...packetMotion}
                      className="absolute inset-x-0 top-24"
                    >
                      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="mb-5 text-center text-sm font-semibold text-slate-700">
                          During transfer, one packet goes missing. Click the gap
                          to identify the missing packet.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                          <PacketPill
                            number={1}
                            highlight={clickedMissingPacket === 1}
                            onClick={() =>
                              setHandshakeFeedback(
                                "Packet 1 arrived successfully. Look for the missing sequence number."
                              )
                            }
                          />
                          <PacketPill
                            number={2}
                            highlight={clickedMissingPacket === 2}
                            onClick={() =>
                              setHandshakeFeedback(
                                "Packet 2 arrived successfully. Look for the missing sequence number."
                              )
                            }
                          />
                          <MissingPacketSlot
                            selected={clickedMissingPacket === 3}
                            onClick={handleMissingPacketClick}
                          />
                          <PacketPill
                            number={4}
                            highlight={clickedMissingPacket === 4}
                            onClick={() =>
                              setHandshakeFeedback(
                                "Packet 4 arrived successfully. Look for the missing sequence number."
                              )
                            }
                          />
                        </div>

                        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-600">
                          TCP can see that packet <strong>3</strong> is missing
                          because the sequence jumps from <strong>2</strong> to{" "}
                          <strong>4</strong>.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {resent && !rebuilt && (
                    <motion.div
                      key="resent-phase"
                      {...packetMotion}
                      className="absolute inset-x-0 top-24"
                    >
                      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex flex-wrap items-center justify-center gap-4 md:gap-6">
                          {[1, 2, 3, 4].map((num) => (
                            <PacketPill
                              key={num}
                              number={num}
                              highlight={num === 3}
                              disabled
                            />
                          ))}
                        </div>

                        <div className="relative mx-auto mb-5 h-16 max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                          <motion.div
                            initial={{ x: -80, opacity: 0 }}
                            animate={{ x: "calc(100% - 40px)", opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute top-1/2 -translate-y-1/2"
                          >
                            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 shadow-sm">
                              Packet 3 resent
                            </div>
                          </motion.div>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-600">
                          TCP now has all the packets. Next, it places them back
                          into the correct order using their{" "}
                          <strong>sequence numbers</strong>.
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {resent && (
                    <motion.div
                      key="rebuild-area"
                      {...packetMotion}
                      className="absolute inset-x-0 bottom-0"
                    >
                      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="mb-3 text-center text-sm font-semibold text-slate-700">
                          Rebuild the data in TCP sequence order: 1, 2, 3, 4
                        </p>

                        <p className="mb-5 text-center text-sm text-slate-500">
                          The packets below are scrambled. Click them in the
                          correct order to show how TCP reassembles data.
                        </p>

                        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
                          {scrambledPackets.map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleRebuildClick(num)}
                              disabled={packetOrder.includes(num) || rebuilt}
                              className={`flex h-14 w-14 items-center justify-center rounded-2xl border text-sm font-bold transition ${
                                packetOrder.includes(num)
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="mb-3 text-center text-sm font-semibold text-slate-700">
                            Reassembled stream
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

              <div className="flex flex-col items-center gap-2 pt-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  <Server className="h-9 w-9 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">Server</p>
                <p className="text-sm text-slate-500">Web Server</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <h3 className="text-lg font-bold text-slate-900">
              {rebuilt
                ? "Data Rebuilt"
                : resent
                ? "Packet Resent"
                : showPacketPhase
                ? "Find the Missing Packet"
                : handshakeStep === 0
                ? "Step 1: SYN"
                : handshakeStep === 1
                ? "Step 2: SYN-ACK"
                : handshakeStep === 2
                ? "Step 3: ACK"
                : "Connection Established"}
            </h3>

            <p className="mx-auto mt-2 max-w-3xl leading-7 text-slate-600">
              {handshakeFeedback}
            </p>
          </div>

          {connectionEstablished && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-700" />
              <p className="font-semibold text-emerald-800">
                Reliable TCP connection established
              </p>
            </div>
          )}

          {rebuilt && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-emerald-700" />
              <p className="font-semibold text-emerald-800">
                Data successfully reconstructed using TCP sequence numbers
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-4">
            {showPacketPhase && !resent && (
              <button
                type="button"
                onClick={handleResend}
                className="rounded-2xl bg-slate-900 px-5 py-2 text-white transition hover:bg-slate-800"
              >
                Resend Missing Packet
              </button>
            )}

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
                        disabled={submittedQuiz}
                        onClick={() => handleAnswerSelect(i, option)}
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
              onClick={submitQuiz}
              className="rounded-2xl bg-slate-900 px-5 py-2 text-white hover:bg-slate-800"
            >
              Submit Quiz
            </button>

            <button
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