import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Shield,
  Globe,
  Wifi,
  Waypoints,
  Network,
  FileCode2,
} from "lucide-react"

function getModuleIcon(path) {
  switch (path) {
    case "/data-travel":
      return Waypoints
    case "/tcp":
      return Network
    case "/bitrate-bandwidth":
      return Wifi
    case "/dns":
      return Globe
    case "/http":
      return FileCode2
    case "/internet-security":
      return Shield
    default:
      return Globe
  }
}

export default function ModuleCard({
  title,
  description,
  path,
  unlocked,
  completed,
  activityCompleted,
  quizPassed,
  stepNumber,
  isCurrent,
}) {
  const Icon = getModuleIcon(path)

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-300",
        unlocked
          ? "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-2xl"
          : "border-slate-200/80 bg-slate-100/90 opacity-90",
        isCurrent ? "ring-2 ring-[#FEC52F] shadow-xl" : "",
      ].join(" ")}
    >
      {isCurrent && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#FEC52F] via-[#ffe082] to-[#FEC52F]" />
      )}

      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FEC52F]/10 blur-2xl" />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={[
              "flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300",
              completed
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : unlocked
                ? "border-[#FEC52F]/40 bg-[#073674] text-white group-hover:scale-105"
                : "border-slate-300 bg-slate-200 text-slate-500",
            ].join(" ")}
          >
            {completed ? <CheckCircle2 size={26} /> : <Icon size={26} />}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Module {stepNumber}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {completed ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Completed
                </span>
              ) : unlocked ? (
                <span className="rounded-full bg-[#FEC52F]/20 px-3 py-1 text-xs font-semibold text-[#7a5900]">
                  Unlocked
                </span>
              ) : (
                <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  Locked
                </span>
              )}

              {isCurrent && !completed && (
                <span className="animate-pulse rounded-full bg-[#073674] px-3 py-1 text-xs font-semibold text-white">
                  Current
                </span>
              )}
            </div>
          </div>
        </div>

        {!unlocked ? (
          <div className="rounded-full bg-slate-200 p-2 text-slate-500">
            <Lock size={18} />
          </div>
        ) : null}
      </div>

      <h2
        className={[
          "mb-3 text-xl font-bold leading-snug",
          unlocked ? "text-[#073674]" : "text-slate-500",
        ].join(" ")}
      >
        {title}
      </h2>

      <p
        className={[
          "mb-6 text-sm leading-6",
          unlocked ? "text-slate-600" : "text-slate-500",
        ].join(" ")}
      >
        {description}
      </p>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            activityCompleted
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600",
          ].join(" ")}
        >
          <span className="block text-xs font-semibold uppercase tracking-wide">
            Activity
          </span>
          <span className="mt-1 block font-medium">
            {activityCompleted ? "Completed" : "Not completed"}
          </span>
        </div>

        <div
          className={[
            "rounded-2xl border px-4 py-3 text-sm",
            quizPassed
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600",
          ].join(" ")}
        >
          <span className="block text-xs font-semibold uppercase tracking-wide">
            Quiz
          </span>
          <span className="mt-1 block font-medium">
            {quizPassed ? "Passed" : "Not passed"}
          </span>
        </div>
      </div>

      {unlocked ? (
        <Link
          to={path}
          className="inline-flex items-center gap-2 rounded-xl bg-[#073674] px-5 py-3 font-semibold text-white transition hover:bg-[#0a458f]"
        >
          {completed ? "Review Module" : "Start Module"}
          <ArrowRight size={18} />
        </Link>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-xl bg-slate-300 px-5 py-3 font-semibold text-slate-600">
          Locked
          <Lock size={16} />
        </div>
      )}
    </div>
  )
}