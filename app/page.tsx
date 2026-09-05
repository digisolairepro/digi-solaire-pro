import Link from "next/link";
import Logo from "../components/Logo";

export default function AccueilPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      <header className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <Logo />

          <div className="flex gap-3">
            <Link
              href="/connexion"
              className="px-5 py-2 rounded-lg border border-white/30 hover:border-white transition"
            >
              Se connecter
            </Link>

            <Link
              href="/inscription"
              className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold transition"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Calculez la bonne taille d&apos;installation solaire,
              pour chaque client.
            </h1>

            <p className="mt-6 text-lg text-stone-600">
              DigiSolaire Pro détermine les panneaux, la batterie et
              l&apos;onduleur qu&apos;il faut à partir de la
              consommation réelle du foyer. Vos clients, vos projets
              et vos devis restent au même endroit.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="/image/solaire.jpg"
              alt="Casque de chantier et rapport technique posés sur des panneaux solaires"
              className="w-full max-w-md rounded-lg shadow-lg object-cover"
            />
          </div>

        </div>
      </main>

      <footer className="border-t border-stone-200 py-8">
        <p className="text-center text-sm text-stone-400">
          © 2026 DigiSolaire Pro
        </p>
      </footer>

    </div>
  );
}