import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function ModuleCard({ title, description, path }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 h-2 w-16 rounded-full bg-[#FEC52F]" />

      <h2 className="mb-3 text-xl font-bold text-[#073674]">
        {title}
      </h2>

      <p className="mb-6 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <Link
        to={path}
        className="inline-flex items-center gap-2 rounded-lg bg-[#073674] px-4 py-2 font-medium text-white transition hover:bg-[#0a458f]"
      >
        Start Module
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}