"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Sidebar() {
  const router = useRouter();
  const [estOuvert, setEstOuvert] = useState(false);

  const fermerMenu = () => setEstOuvert(false);

  const seDeconnecter = async () => {
    await fetch("/api/auth/deconnexion", { method: "POST" });
    router.push("/");
  };

  return (
    <>
      <button
        onClick={() => setEstOuvert(!estOuvert)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-lg shadow-lg"
        aria-label="Ouvrir le menu"
      >
        {estOuvert ? "✕" : "☰"}
      </button>

      {estOuvert && (
        <div
          onClick={fermerMenu}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      <aside
        className={`
          w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${estOuvert ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <Logo size="sm" />

        <nav className="mt-10 flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                href="/tableau-de-bord"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                🏠 Tableau de bord
              </Link>
            </li>

            <li>
              <Link
                href="/clients"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                👥 Clients
              </Link>
            </li>

            <li>
              <Link
                href="/projets"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                📁 Projets
              </Link>
            </li>

            <li>
              <Link
                href="/dimensionnement"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                ☀️ Dimensionnement
              </Link>
            </li>

            <li>
              <Link
                href="/dimensionnements"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                📊 Mes dimensionnements
              </Link>
            </li>

            <li>
              <Link
                href="/devis"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                📄 Devis
              </Link>
            </li>

            <li>
              <Link
                href="/parametres"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                ⚙️ Paramètres
              </Link>
            </li>
          </ul>
        </nav>

        <button
          onClick={seDeconnecter}
          className="text-left text-red-400 hover:text-red-300 mt-6"
        >
          🚪 Se déconnecter
        </button>
      </aside>
    </>
  );
}