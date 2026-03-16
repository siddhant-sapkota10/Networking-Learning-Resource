import ModuleCard from "../components/ModuleCard"
import modulesData from "../data/modulesData"

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-[#073674] to-[#0a458f] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="mb-3 inline-block rounded-full bg-[#FEC52F] px-4 py-1 text-sm font-semibold text-[#073674]">
            St Edmund&apos;s College Canberra
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Learn How the Internet Works
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Explore networking through interactive modules on data travel, TCP,
            bandwidth, DNS, HTTP, and internet security.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#073674]">
            Learning Modules
          </h2>
          <p className="mt-2 text-slate-600">
            Choose a module below to begin your learning journey. 
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modulesData.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              description={module.description}
              path={module.path}
            />
          ))}
        </div>
      </section>
    </main>
  )
}