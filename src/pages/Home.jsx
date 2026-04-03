import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Trophy, Target, Sparkles, RotateCcw } from "lucide-react"
import ModuleCard from "../components/ModuleCard"
import modulesData from "../data/modulesData"
import { getModuleState, resetAllProgress } from "../utils/progress"
import PelicanStudy from "../assets/pelican1.png"
import PelicanHappy from "../assets/pelican2.png"

const ROAD_SVG_WIDTH = 170
const ROAD_SVG_HEIGHT = 2100

const ROAD_PATH_D =
  "M85 130 C130 320, 40 520, 85 800 C130 1080, 40 1360, 85 1640 C130 1860, 40 1960, 85 2010"

const PELICAN_STORAGE_KEY = "roadmap-last-index"

const CHECKPOINT_OFFSET = 42
const START_GAP = 320
const FINISH_GAP = 320

function Pelican({ point, isComplete, isIntroAnimating }) {
  if (!point) return null

  return (
    <div
      className="absolute z-30 hidden lg:block pelican-marker"
      style={{
        left: `${point.x}px`,
        top: `${point.y}px`,
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#FEC52F]/30 blur-2xl" />
        <img
          src={isComplete ? PelicanHappy : PelicanStudy}
          alt={isComplete ? "Celebrating pelican mascot" : "Pelican mascot"}
          className={`relative pointer-events-none select-none ${
            isComplete
              ? "w-[122px] max-w-none animate-pelicanCelebrate"
              : isIntroAnimating
              ? "w-[108px] max-w-none animate-pelicanGlide"
              : "w-[108px] max-w-none animate-pelicanFloat"
          }`}
          draggable="false"
        />
      </div>
    </div>
  )
}

export default function Home() {
  const [modules, setModules] = useState([])
  const [markerPoints, setMarkerPoints] = useState([])
  const [pelicanPoint, setPelicanPoint] = useState(null)
  const [isIntroAnimating, setIsIntroAnimating] = useState(false)
  const [introReady, setIntroReady] = useState(false)

  const roadmapSectionRef = useRef(null)
  const roadmapInnerRef = useRef(null)
  const rowRefs = useRef([])
  const cardRefs = useRef([])
  const hasAnimatedOnLoadRef = useRef(false)
  const introTimeoutsRef = useRef([])
  const hasScrolledForHashRef = useRef(false)
  const hasAutoFocusedRef = useRef(false)

  useEffect(() => {
    const load = () => {
      setModules(getModuleState(modulesData))
    }

    load()
    window.addEventListener("focus", load)
    window.addEventListener("storage", load)

    return () => {
      window.removeEventListener("focus", load)
      window.removeEventListener("storage", load)
    }
  }, [])

  useEffect(() => {
    return () => {
      introTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [])

  const completedCount = useMemo(
    () => modules.filter((module) => module.completed).length,
    [modules]
  )

  const totalModules = modules.length
  const isAllComplete = totalModules > 0 && completedCount === totalModules

  const progressPercentage =
    totalModules > 0 ? (completedCount / totalModules) * 100 : 0

  const currentModuleIndex = useMemo(() => {
    const current = modules.findIndex(
      (module) => module.unlocked && !module.completed
    )

    if (current !== -1) return current

    const lastCompletedIndex = [...modules]
      .map((module, index) => ({ ...module, index }))
      .filter((module) => module.completed)
      .at(-1)?.index

    return lastCompletedIndex ?? 0
  }, [modules])

  const activeCheckpointIndex = useMemo(() => {
    if (isAllComplete) return totalModules + 1
    return currentModuleIndex + 1
  }, [isAllComplete, totalModules, currentModuleIndex])

  const shouldRunIntroAnimation = useMemo(() => {
    return completedCount === 0 && activeCheckpointIndex === 1 && totalModules > 0
  }, [completedCount, activeCheckpointIndex, totalModules])

  useEffect(() => {
    if (modules.length === 0) return
    if (!roadmapSectionRef.current) return
    if (hasScrolledForHashRef.current) return

    const hash = window.location.hash
    if (!hash) return

    const scrollToTarget = () => {
      if (hash === "#roadmap") {
        roadmapSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
        return
      }

      const target = document.querySelector(hash)
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      } else {
        roadmapSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }

    const delay = shouldRunIntroAnimation ? 700 : 1050
    const timeoutId = window.setTimeout(() => {
      scrollToTarget()
      hasScrolledForHashRef.current = true
      hasAutoFocusedRef.current = true
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [modules.length, shouldRunIntroAnimation])

  useEffect(() => {
    if (modules.length === 0) return
    if (!roadmapSectionRef.current) return
    if (hasScrolledForHashRef.current) return
    if (hasAutoFocusedRef.current) return

    const targetRow =
      rowRefs.current[Math.min(currentModuleIndex, rowRefs.current.length - 1)]

    if (!targetRow) return

    const shouldDelayForMotion =
      shouldRunIntroAnimation || isIntroAnimating || activeCheckpointIndex > 1

    const delay = shouldDelayForMotion ? 900 : 250

    const timeoutId = window.setTimeout(() => {
      targetRow.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
      hasAutoFocusedRef.current = true
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [
    modules.length,
    currentModuleIndex,
    shouldRunIntroAnimation,
    isIntroAnimating,
    activeCheckpointIndex,
  ])

  useLayoutEffect(() => {
    let frameId = null
    let resizeObserver = null

    const updatePositions = () => {
      const innerEl = roadmapInnerRef.current
      if (!innerEl || modules.length === 0) return

      const innerRect = innerEl.getBoundingClientRect()
      const centerRoadX = innerRect.width / 2

      const modulePoints = rowRefs.current.map((rowEl, index) => {
        const cardEl = cardRefs.current[index]
        if (!rowEl || !cardEl) return null

        const rowRect = rowEl.getBoundingClientRect()
        const cardRect = cardEl.getBoundingClientRect()

        const y = rowRect.top - innerRect.top + rowRect.height / 2
        const isLeft = index % 2 === 0

        const x = isLeft
          ? cardRect.right - innerRect.left + CHECKPOINT_OFFSET
          : cardRect.left - innerRect.left - CHECKPOINT_OFFSET

        return { x, y, side: isLeft ? "left" : "right", type: "module" }
      })

      const validModulePoints = modulePoints.filter(Boolean)
      if (validModulePoints.length === 0) return

      const startPoint = {
        x: centerRoadX,
        y: Math.max(100, validModulePoints[0].y - START_GAP),
        side: "center",
        type: "start",
      }

      const finishPoint = {
        x: centerRoadX,
        y: validModulePoints[validModulePoints.length - 1].y + FINISH_GAP,
        side: "center",
        type: "finish",
      }

      const allPoints = [startPoint, ...validModulePoints, finishPoint]
      setMarkerPoints(allPoints)

      const currentPoint = allPoints[activeCheckpointIndex] || allPoints[0] || null
      if (!currentPoint) return

      introTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      introTimeoutsRef.current = []

      if (!hasAnimatedOnLoadRef.current) {
        if (shouldRunIntroAnimation && allPoints[0] && allPoints[1]) {
          setIntroReady(false)
          setIsIntroAnimating(true)
          setPelicanPoint(allPoints[0])

          const moveTimeout = setTimeout(() => {
            setPelicanPoint(allPoints[1])
          }, 260)

          const unlockTimeout = setTimeout(() => {
            setIntroReady(true)
          }, 900)

          const finishTimeout = setTimeout(() => {
            setIsIntroAnimating(false)
            hasAnimatedOnLoadRef.current = true
            localStorage.setItem(PELICAN_STORAGE_KEY, "1")
          }, 3200)

          introTimeoutsRef.current.push(moveTimeout, unlockTimeout, finishTimeout)
          return
        }

        const savedIndexRaw = localStorage.getItem(PELICAN_STORAGE_KEY)
        const savedIndex = Number(savedIndexRaw)
        const hasSavedIndex =
          Number.isInteger(savedIndex) &&
          savedIndex >= 0 &&
          savedIndex < allPoints.length

        const startIndex = hasSavedIndex
          ? savedIndex
          : Math.max(0, activeCheckpointIndex - 1)

        const startPointForPelican = allPoints[startIndex] || currentPoint

        setIntroReady(false)
        setIsIntroAnimating(startIndex !== activeCheckpointIndex)
        setPelicanPoint(startPointForPelican)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const moveTimeout = setTimeout(() => {
              setPelicanPoint(currentPoint)
            }, 260)

            const unlockTimeout = setTimeout(() => {
              setIntroReady(true)
            }, startIndex !== activeCheckpointIndex ? 900 : 250)

            const finishTimeout = setTimeout(() => {
              setIsIntroAnimating(false)
              hasAnimatedOnLoadRef.current = true
              localStorage.setItem(
                PELICAN_STORAGE_KEY,
                String(activeCheckpointIndex)
              )
            }, startIndex !== activeCheckpointIndex ? 3200 : 400)

            introTimeoutsRef.current.push(
              moveTimeout,
              unlockTimeout,
              finishTimeout
            )
          })
        })
      } else {
        setPelicanPoint(currentPoint)
        setIntroReady(true)
        localStorage.setItem(
          PELICAN_STORAGE_KEY,
          String(activeCheckpointIndex)
        )
      }
    }

    const scheduleUpdate = () => {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(updatePositions)
    }

    scheduleUpdate()
    window.addEventListener("resize", scheduleUpdate)

    if (roadmapInnerRef.current) {
      resizeObserver = new ResizeObserver(scheduleUpdate)
      resizeObserver.observe(roadmapInnerRef.current)

      rowRefs.current.forEach((rowEl) => {
        if (rowEl) resizeObserver.observe(rowEl)
      })

      cardRefs.current.forEach((cardEl) => {
        if (cardEl) resizeObserver.observe(cardEl)
      })
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      window.removeEventListener("resize", scheduleUpdate)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [modules, activeCheckpointIndex, shouldRunIntroAnimation])

  const startPoint = markerPoints[0]
  const finishPoint = markerPoints[markerPoints.length - 1]

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-[#073674] to-[#0a4aa3] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-3 inline-block rounded-full bg-[#FEC52F] px-4 py-1 text-sm font-semibold text-[#073674]">
            St Edmund&apos;s College Canberra
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Learn How the Internet Works
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-200">
            Complete modules, pass quizzes, and progress through your networking
            journey.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <Trophy className="mb-3" />
              <p className="text-2xl font-bold">
                {completedCount}/{totalModules}
              </p>
              <p className="text-sm text-slate-200">modules completed</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <Target className="mb-3" />
              <p className="font-bold">
                {isAllComplete
                  ? "Roadmap complete"
                  : modules[currentModuleIndex]?.title || "Start learning"}
              </p>
              <p className="mt-1 text-sm text-slate-200">
                {isAllComplete
                  ? "You finished the full learning resource."
                  : shouldRunIntroAnimation && !introReady
                  ? "The roadmap is opening..."
                  : isIntroAnimating
                  ? "Your pelican is travelling to the next checkpoint."
                  : "You are currently at this checkpoint on the roadmap."}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <Sparkles className="mb-3" />
              <p className="font-bold">Guided roadmap</p>
              <p className="mt-1 text-sm text-slate-200">
                Progress is saved automatically as you complete modules.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-3xl">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>

            <div className="h-3 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-[#FEC52F] transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="#roadmap"
              className="rounded-xl bg-[#FEC52F] px-5 py-3 font-semibold text-[#073674] transition hover:brightness-105"
            >
              View Roadmap
            </a>

            <button
              onClick={() => {
                resetAllProgress()
                localStorage.removeItem(PELICAN_STORAGE_KEY)
                hasAnimatedOnLoadRef.current = false
                hasScrolledForHashRef.current = false
                hasAutoFocusedRef.current = false
                setIsIntroAnimating(false)
                setIntroReady(false)
                setModules(getModuleState(modulesData))
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-white transition hover:bg-white/10"
            >
              <RotateCcw size={18} />
              Reset Progress
            </button>
          </div>
        </div>
      </section>

      <section
        id="roadmap"
        ref={roadmapSectionRef}
        className="roadmap-anchor-target overflow-hidden bg-gradient-to-b from-[#0a4aa3] via-[#0d5bd3] to-[#0f6df0] pt-16 pb-28 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-3xl font-bold text-white">
            Networking Roadmap
          </h2>

          <div ref={roadmapInnerRef} className="relative">
            <div
              className="absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 lg:block"
              style={{
                width: ROAD_SVG_WIDTH,
                height: "100%",
              }}
            >
              <svg
                width={ROAD_SVG_WIDTH}
                height="100%"
                viewBox={`0 0 ${ROAD_SVG_WIDTH} ${ROAD_SVG_HEIGHT}`}
                preserveAspectRatio="none"
              >
                <path
                  d={ROAD_PATH_D}
                  stroke="#FEC52F"
                  strokeWidth="19"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d={ROAD_PATH_D}
                  stroke="white"
                  strokeWidth="3.25"
                  fill="none"
                  strokeDasharray="12 14"
                  strokeLinecap="round"
                  className="animate-roadFlow"
                />
              </svg>
            </div>

            {markerPoints.map((point, index) => {
              if (!point) return null

              const isStart = point.type === "start"
              const isFinish = point.type === "finish"
              const moduleIndex = index - 1
              const module = modules[moduleIndex]

              const isCompleted =
                isStart || (isFinish ? isAllComplete : module?.completed)

              const isCurrent = index === activeCheckpointIndex

              return (
                <div
                  key={`checkpoint-${index}`}
                  className={`absolute z-20 hidden lg:block roadmap-circle ${
                    isCurrent ? "roadmap-circle-current" : ""
                  } ${isCompleted ? "roadmap-circle-completed" : ""}`}
                  style={{
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                  }}
                />
              )
            })}

            <Pelican
              point={pelicanPoint}
              isComplete={isAllComplete}
              isIntroAnimating={isIntroAnimating}
            />

            {startPoint && (
              <div
                className="pointer-events-none absolute z-10 hidden lg:block -translate-x-1/2"
                style={{
                  left: `${startPoint.x}px`,
                  top: `${startPoint.y - 58}px`,
                }}
              >
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-white/95 backdrop-blur-sm">
                  START
                </div>
              </div>
            )}

            {finishPoint && (
              <div
                className="pointer-events-none absolute z-10 hidden lg:block -translate-x-1/2"
                style={{
                  left: `${finishPoint.x}px`,
                  top: `${finishPoint.y + 42}px`,
                }}
              >
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-white/95 backdrop-blur-sm">
                  FINISH
                </div>
              </div>
            )}

            <div className="space-y-28 pt-[180px] pb-[220px]">
              {modules.map((module, index) => {
                const isLeft = index % 2 === 0
                const isCurrent = module.unlocked && !module.completed

                const shouldTemporarilyLockFirstCard =
                  index === 0 && shouldRunIntroAnimation && !introReady

                const effectiveUnlocked = shouldTemporarilyLockFirstCard
                  ? false
                  : module.unlocked

                return (
                  <div
                    key={module.id}
                    id={`module-${index + 1}`}
                    ref={(el) => {
                      rowRefs.current[index] = el
                    }}
                    className={`roadmap-anchor-target relative flex min-h-[250px] items-center ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="w-full lg:w-[43%]">
                      <div
                        ref={(el) => {
                          cardRefs.current[index] = el
                        }}
                        className={`rounded-[30px] bg-white p-2 shadow-xl transition-all duration-500 ${
                          shouldTemporarilyLockFirstCard
                            ? "pointer-events-none opacity-55 saturate-50"
                            : "opacity-100"
                        }`}
                      >
                        <ModuleCard
                          title={module.title}
                          description={module.description}
                          path={module.path}
                          unlocked={effectiveUnlocked}
                          completed={module.completed}
                          activityCompleted={module.activityCompleted}
                          quizPassed={module.quizPassed}
                          stepNumber={index + 1}
                          isCurrent={isCurrent && !shouldTemporarilyLockFirstCard}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
    
  )
}