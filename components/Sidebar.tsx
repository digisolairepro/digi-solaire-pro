import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold text-yellow-400">
        ☀ DIGI SOLAIRE PRO
      </h2>

      <nav className="mt-10">
        <ul className="space-y-4">
          <li>
            <Link href="/" className="block hover:text-yellow-400">
              🏠 Tableau de bord
            </Link>
          </li>

          <li>
            <Link href="/clients" className="block hover:text-yellow-400">
              👥 Clients
            </Link>
          </li>

          <li>
            <Link href="#" className="block hover:text-yellow-400">
              📁 Projets
            </Link>
          </li>

          <li>
            <Link href="#" className="block hover:text-yellow-400">
              ☀️ Dimensionnement
            </Link>
          </li>

          <li>
            <Link href="#" className="block hover:text-yellow-400">
              📄 Devis
            </Link>
          </li>

          <li>
            <Link href="#" className="block hover:text-yellow-400">
              ⚙️ Paramètres
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}