import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Trophy,
  Target,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import modulesData from "../data/modulesData";
import { getModuleState, resetAllProgress } from "../utils/progress";
import PelicanStudy from "../assets/pelican1.png";
import PelicanHappy from "../assets/pelican2.png";

const ROAD_SVG_WIDTH = 170;
const ROAD_SVG_HEIGHT = 2100;
const ROAD_PATH_D =
  "M85 130 C130 320, 40 520, 85 800 C130 1080, 40 1360, 85 1640 C130 1860, 40 1960, 85 2010";

const PELICAN_STORAGE_KEY = "roadmap-last-index";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function Pelican({ point, isComplete, isIntroAnimating }) {
  if (!point) return null;

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
              ? "w-[84px] lg:w-[96px] xl:w-[112px] 2xl:w-[122px] max-w-none animate-pelicanCelebrate"
              : isIntroAnimating
              ? "w-[78px] lg:w-[88px] xl:w-[100px] 2xl:w-[108px] max-w-none animate-pelicanGlide"
              : "w-[78px] lg:w-[88px] xl:w-[100px] 2xl:w-[108px] max-w-none animate-pelicanFloat"
          }`}
          draggable="false"
        />
      </div>
    </div>
  );
}

function MobileTimelineCard({
  module,
  index,
  isCurrent,
  shouldTemporarilyLockFirstCard,
  shouldRunIntroAnimation,
  introReady,
}) {
  const effectiveUnlocked =
    index === 0 && shouldRunIntroAnimation && !introReady
      ? false
      : module.unlocked;

  const isLocked = !effectiveUnlocked;
  const isCompleted = module.completed;

  return (
    <div className="relative pl-10 sm:pl-12">
      <div className="absolute left-3.5 top-5 bottom-[-1.25rem] w-0.5 bg-white/25 sm:left-4.5" />
      <div
        className={`absolute left-0 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-lg sm:h-9 sm:w-9 ${
          isCompleted
            ? "border-[#FEC52F] bg-[#FEC52F] text-[#073674]"
            : isCurrent
            ? "border-white bg-white text-[#073674]"
            : isLocked
            ? "border-white/40 bg-white/15 text-white/80"
            : "border-[#FEC52F] bg-[#073674] text-[#FEC52F]"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 size={16} />
        ) : isLocked ? (
          <Lock size={14} />
        ) : (
          <span className="text-xs font-bold">{index + 1}</span>
        )}
      </div>

      <div
        className={`rounded-[22px] sm:rounded-[24px] bg-white p-2 shadow-xl transition-all duration-500 ${
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
  );
}

export default function Home() {
  const [modules, setModules] = useState([]);
  const [markerPoints, setMarkerPoints] = useState([]);
  const [pelicanPoint, setPelicanPoint] = useState(null);
  const [isIntroAnimating, setIsIntroAnimating] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const roadmapSectionRef = useRef(null);
  const roadmapInnerRef = useRef(null);
  const rowRefs = useRef([]);
  const cardRefs = useRef([]);
  const mobileRowRefs = useRef([]);
  const hasAnimatedOnLoadRef = useRef(false);
  const introTimeoutsRef = useRef([]);
  const hasScrolledForHashRef = useRef(false);
  const hasAutoFocusedRef = useRef(false);

  useEffect(() => {
    const load = () => {
      setModules(getModuleState(modulesData));
    };

    load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);

    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  useEffect(() => {
    return () => {
      introTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  const completedCount = useMemo(
    () => modules.filter((module) => module.completed).length,
    [modules]
  );

  const totalModules = modules.length;
  const isAllComplete = totalModules > 0 && completedCount === totalModules;

  const progressPercentage =
    totalModules > 0 ? (completedCount / totalModules) * 100 : 0;

  const currentModuleIndex = useMemo(() => {
    const current = modules.findIndex(
      (module) => module.unlocked && !module.completed
    );

    if (current !== -1) return current;

    const lastCompletedIndex = [...modules]
      .map((module, index) => ({ ...module, index }))
      .filter((module) => module.completed)
      .at(-1)?.index;

    return lastCompletedIndex ?? 0;
  }, [modules]);

  const activeCheckpointIndex = useMemo(() => {
    if (isAllComplete) return totalModules + 1;
    return currentModuleIndex + 1;
  }, [isAllComplete, totalModules, currentModuleIndex]);

  const shouldRunIntroAnimation = useMemo(() => {
    return completedCount === 0 && activeCheckpointIndex === 1 && totalModules > 0;
  }, [completedCount, activeCheckpointIndex, totalModules]);

  useEffect(() => {
    if (modules.length === 0) return;
    if (!roadmapSectionRef.current) return;
    if (hasScrolledForHashRef.current) return;

    const hash = window.location.hash;
    if (!hash) return;

    const scrollToTarget = () => {
      if (hash === "#roadmap") {
        roadmapSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return;
      }

      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: window.innerWidth < 1024 ? "start" : "center",
        });
      } else {
        roadmapSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const delay = shouldRunIntroAnimation ? 700 : 900;
    const timeoutId = window.setTimeout(() => {
      scrollToTarget();
      hasScrolledForHashRef.current = true;
      hasAutoFocusedRef.current = true;
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [modules.length, shouldRunIntroAnimation]);

  useEffect(() => {
    if (modules.length === 0) return;
    if (!roadmapSectionRef.current) return;
    if (hasScrolledForHashRef.current) return;
    if (hasAutoFocusedRef.current) return;

    const desktopTarget =
      rowRefs.current[Math.min(currentModuleIndex, rowRefs.current.length - 1)];
    const mobileTarget =
      mobileRowRefs.current[
        Math.min(currentModuleIndex, mobileRowRefs.current.length - 1)
      ];

    const targetRow = window.innerWidth >= 1024 ? desktopTarget : mobileTarget;
    if (!targetRow) return;

    const shouldDelayForMotion =
      shouldRunIntroAnimation || isIntroAnimating || activeCheckpointIndex > 1;

    const delay = shouldDelayForMotion ? 850 : 220;

    const timeoutId = window.setTimeout(() => {
      targetRow.scrollIntoView({
        behavior: "smooth",
        block: window.innerWidth < 1024 ? "start" : "center",
      });
      hasAutoFocusedRef.current = true;
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [
    modules.length,
    currentModuleIndex,
    shouldRunIntroAnimation,
    isIntroAnimating,
    activeCheckpointIndex,
  ]);

  useLayoutEffect(() => {
    let frameId = null;
    let resizeObserver = null;

    const updatePositions = () => {
      const innerEl = roadmapInnerRef.current;
      if (!innerEl || modules.length === 0) return;
      if (window.innerWidth < 1024) return;

      const innerRect = innerEl.getBoundingClientRect();
      const centerRoadX = innerRect.width / 2;

      const dynamicOffset = clamp(innerRect.width * 0.03, 28, 46);
      const dynamicStartGap = clamp(innerRect.height * 0.08, 140, 240);
      const dynamicFinishGap = clamp(innerRect.height * 0.08, 140, 240);

      const modulePoints = rowRefs.current.map((rowEl, index) => {
        const cardEl = cardRefs.current[index];
        if (!rowEl || !cardEl) return null;

        const rowRect = rowEl.getBoundingClientRect();
        const cardRect = cardEl.getBoundingClientRect();

        const y = rowRect.top - innerRect.top + rowRect.height / 2;
        const isLeft = index % 2 === 0;

        const x = isLeft
          ? cardRect.right - innerRect.left + dynamicOffset
          : cardRect.left - innerRect.left - dynamicOffset;

        return { x, y, side: isLeft ? "left" : "right", type: "module" };
      });

      const validModulePoints = modulePoints.filter(Boolean);
      if (validModulePoints.length === 0) return;

      const startPoint = {
        x: centerRoadX,
        y: Math.max(100, validModulePoints[0].y - dynamicStartGap),
        side: "center",
        type: "start",
      };

      const finishPoint = {
        x: centerRoadX,
        y: validModulePoints[validModulePoints.length - 1].y + dynamicFinishGap,
        side: "center",
        type: "finish",
      };

      const allPoints = [startPoint, ...validModulePoints, finishPoint];
      setMarkerPoints(allPoints);

      const currentPoint = allPoints[activeCheckpointIndex] || allPoints[0] || null;
      if (!currentPoint) return;

      introTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
      introTimeoutsRef.current = [];

      if (!hasAnimatedOnLoadRef.current) {
        if (shouldRunIntroAnimation && allPoints[0] && allPoints[1]) {
          setIntroReady(false);
          setIsIntroAnimating(true);
          setPelicanPoint(allPoints[0]);

          const moveTimeout = setTimeout(() => {
            setPelicanPoint(allPoints[1]);
          }, 260);

          const unlockTimeout = setTimeout(() => {
            setIntroReady(true);
          }, 900);

          const finishTimeout = setTimeout(() => {
            setIsIntroAnimating(false);
            hasAnimatedOnLoadRef.current = true;
            localStorage.setItem(PELICAN_STORAGE_KEY, "1");
          }, 3200);

          introTimeoutsRef.current.push(moveTimeout, unlockTimeout, finishTimeout);
          return;
        }

        const savedIndexRaw = localStorage.getItem(PELICAN_STORAGE_KEY);
        const savedIndex = Number(savedIndexRaw);
        const hasSavedIndex =
          Number.isInteger(savedIndex) &&
          savedIndex >= 0 &&
          savedIndex < allPoints.length;

        const startIndex = hasSavedIndex
          ? savedIndex
          : Math.max(0, activeCheckpointIndex - 1);

        const startPointForPelican = allPoints[startIndex] || currentPoint;

        setIntroReady(false);
        setIsIntroAnimating(startIndex !== activeCheckpointIndex);
        setPelicanPoint(startPointForPelican);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const moveTimeout = setTimeout(() => {
              setPelicanPoint(currentPoint);
            }, 260);

            const unlockTimeout = setTimeout(() => {
              setIntroReady(true);
            }, startIndex !== activeCheckpointIndex ? 900 : 250);

            const finishTimeout = setTimeout(() => {
              setIsIntroAnimating(false);
              hasAnimatedOnLoadRef.current = true;
              localStorage.setItem(
                PELICAN_STORAGE_KEY,
                String(activeCheckpointIndex)
              );
            }, startIndex !== activeCheckpointIndex ? 3200 : 400);

            introTimeoutsRef.current.push(
              moveTimeout,
              unlockTimeout,
              finishTimeout
            );
          });
        });
      } else {
        setPelicanPoint(currentPoint);
        setIntroReady(true);
        localStorage.setItem(
          PELICAN_STORAGE_KEY,
          String(activeCheckpointIndex)
        );
      }
    };

    const scheduleUpdate = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updatePositions);
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate);

    if (roadmapInnerRef.current) {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      resizeObserver.observe(roadmapInnerRef.current);

      rowRefs.current.forEach((rowEl) => {
        if (rowEl) resizeObserver.observe(rowEl);
      });

      cardRefs.current.forEach((cardEl) => {
        if (cardEl) resizeObserver.observe(cardEl);
      });
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleUpdate);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [modules, activeCheckpointIndex, shouldRunIntroAnimation]);

  const startPoint = markerPoints[0];
  const finishPoint = markerPoints[markerPoints.length - 1];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-[#073674] to-[#0a4aa3] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <p className="mb-3 inline-block rounded-full bg-[#FEC52F] px-3 py-1 text-xs font-semibold text-[#073674] sm:px-4 sm:text-sm">
            St Edmund&apos;s College Canberra
          </p>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Learn How the Internet Works
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:mt-5 sm:text-lg">
            Complete modules, pass quizzes, and progress through your networking
            journey.
          </p>

          <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:p-5">
              <Trophy className="mb-3" />
              <p className="text-2xl font-bold sm:text-3xl">
                {completedCount}/{totalModules}
              </p>
              <p className="text-sm text-slate-200">modules completed</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:p-5">
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

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:p-5 md:col-span-2 xl:col-span-1">
              <Sparkles className="mb-3" />
              <p className="font-bold">Guided roadmap</p>
              <p className="mt-1 text-sm text-slate-200">
                Progress is saved automatically as you complete modules.
              </p>
            </div>
          </div>

          <div className="mt-8 max-w-3xl sm:mt-10">
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

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <a
              href="#roadmap"
              className="rounded-xl bg-[#FEC52F] px-5 py-3 text-center font-semibold text-[#073674] transition hover:brightness-105"
            >
              View Roadmap
            </a>

            <button
              onClick={() => {
                resetAllProgress();
                localStorage.removeItem(PELICAN_STORAGE_KEY);
                hasAnimatedOnLoadRef.current = false;
                hasScrolledForHashRef.current = false;
                hasAutoFocusedRef.current = false;
                setIsIntroAnimating(false);
                setIntroReady(false);
                setModules(getModuleState(modulesData));
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-white transition hover:bg-white/10"
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
        className="roadmap-anchor-target overflow-hidden bg-gradient-to-b from-[#0a4aa3] via-[#0d5bd3] to-[#0f6df0] pb-20 pt-12 text-white sm:pt-14 lg:pb-28 lg:pt-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Networking Roadmap
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                Follow the roadmap one module at a time. On smaller screens, the
                roadmap becomes a vertical timeline so it stays easy to use.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm">
              <span className="font-semibold text-white">Current step:</span>{" "}
              {isAllComplete
                ? "Finished"
                : `Module ${Math.max(1, currentModuleIndex + 1)}`}
            </div>
          </div>

          {/* Mobile / tablet timeline */}
          <div className="space-y-5 lg:hidden">
            <div className="mb-1 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
              <img
                src={isAllComplete ? PelicanHappy : PelicanStudy}
                alt="Pelican mascot"
                className={`h-14 w-14 shrink-0 object-contain ${
                  isAllComplete ? "animate-pelicanCelebrate" : "animate-pelicanFloat"
                }`}
                draggable="false"
              />
              <div>
                <p className="font-semibold text-white">
                  {isAllComplete
                    ? "You completed the roadmap"
                    : modules[currentModuleIndex]?.title || "Start learning"}
                </p>
                <p className="mt-1 text-sm text-blue-100">
                  {isAllComplete
                    ? "Great job — every module has been finished."
                    : "Keep going through the modules below in order."}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {modules.map((module, index) => {
                const isCurrent = module.unlocked && !module.completed;
                const shouldTemporarilyLockFirstCard =
                  index === 0 && shouldRunIntroAnimation && !introReady;

                return (
                  <div
                    key={module.id}
                    id={`module-${index + 1}`}
                    ref={(el) => {
                      mobileRowRefs.current[index] = el;
                    }}
                  >
                    <MobileTimelineCard
                      module={module}
                      index={index}
                      isCurrent={isCurrent}
                      shouldTemporarilyLockFirstCard={
                        shouldTemporarilyLockFirstCard
                      }
                      shouldRunIntroAnimation={shouldRunIntroAnimation}
                      introReady={introReady}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop roadmap */}
          <div ref={roadmapInnerRef} className="relative hidden lg:block">
            <div
              className="absolute left-1/2 top-0 z-0 -translate-x-1/2"
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
              if (!point) return null;

              const isStart = point.type === "start";
              const isFinish = point.type === "finish";
              const moduleIndex = index - 1;
              const module = modules[moduleIndex];

              const isCompleted =
                isStart || (isFinish ? isAllComplete : module?.completed);

              const isCurrent = index === activeCheckpointIndex;

              return (
                <div
                  key={`checkpoint-${index}`}
                  className={`absolute z-20 roadmap-circle ${
                    isCurrent ? "roadmap-circle-current" : ""
                  } ${isCompleted ? "roadmap-circle-completed" : ""}`}
                  style={{
                    left: `${point.x}px`,
                    top: `${point.y}px`,
                  }}
                />
              );
            })}

            <Pelican
              point={pelicanPoint}
              isComplete={isAllComplete}
              isIntroAnimating={isIntroAnimating}
            />

            {startPoint && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2"
                style={{
                  left: `${startPoint.x}px`,
                  top: `${startPoint.y - 50}px`,
                }}
              >
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-white/95 backdrop-blur-sm">
                  START
                </div>
              </div>
            )}

            {finishPoint && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2"
                style={{
                  left: `${finishPoint.x}px`,
                  top: `${finishPoint.y + 34}px`,
                }}
              >
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.22em] text-white/95 backdrop-blur-sm">
                  FINISH
                </div>
              </div>
            )}

            <div className="space-y-12 pt-[120px] pb-[140px] lg:space-y-14 xl:space-y-16 xl:pt-[140px] xl:pb-[160px] 2xl:space-y-20 2xl:pt-[155px] 2xl:pb-[180px]">
              {modules.map((module, index) => {
                const isLeft = index % 2 === 0;
                const isCurrent = module.unlocked && !module.completed;

                const shouldTemporarilyLockFirstCard =
                  index === 0 && shouldRunIntroAnimation && !introReady;

                const effectiveUnlocked = shouldTemporarilyLockFirstCard
                  ? false
                  : module.unlocked;

                return (
                  <div
                    key={module.id}
                    id={`module-${index + 1}`}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    className={`roadmap-anchor-target relative flex min-h-[190px] xl:min-h-[220px] 2xl:min-h-[245px] items-center ${
                      isLeft ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="w-full lg:w-[43%] xl:w-[42%] 2xl:w-[41%]">
                      <div
                        ref={(el) => {
                          cardRefs.current[index] = el;
                        }}
                        className={`rounded-[26px] xl:rounded-[30px] bg-white p-2 shadow-xl transition-all duration-500 ${
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
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}