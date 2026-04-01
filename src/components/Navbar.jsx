import { Link } from "react-router-dom"
import { Network } from "lucide-react"

export default function Navbar() {
  return (
    <header className="bg-[#073674] text-white shadow-md">
      <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-6 py-4">
        
        {/* LEFT */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full">
            <img
              src="https://sec.act.edu.au/wp-content/uploads/2017/10/Crest.png"
              alt="St Edmund's College"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold leading-tight">
              St Edmund&apos;s Networking Hub
            </h1>
            <p className="text-sm text-slate-200">
              Interactive Networking Modules
            </p>
          </div>
        </Link>

        {/* CENTER */}
        <nav className="flex justify-center">
          <Link
            to="/"
            className="text-lg font-semibold text-white hover:text-[#FEC52F]"
          >
            Home
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="flex justify-end">
          <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm md:flex">
            <Network size={16} />
            <span>Created by Sid Sapkota - Year 12 2026</span>
          </div>
        </div>

      </div>
    </header>
  )
}