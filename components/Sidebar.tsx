"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [estOuvert, setEstOuvert] = useState(false);

  const fermerMenu = () => setEstOuvert(false);

  return (
    <>
      {/* Bouton hamburger — visible uniquement sur téléphone (caché à partir de md) */}
      <button
        onClick={() => setEstOuvert(!estOuvert)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-lg shadow-lg"
        aria-label="Ouvrir le menu"
      >
        {estOuvert ? "✕" : "☰"}
      </button>

      {/* Fond sombre derrière le menu quand il est ouvert sur téléphone */}
      {estOuvert && (
        <div
          onClick={fermerMenu}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}

      <aside
        className={`
          w-64 bg-slate-900 text-white min-h-screen p-6
          fixed inset-y-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          ${estOuvert ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold text-yellow-400">
          ☀ DIGI SOLAIRE PRO
        </h2>

        <nav className="mt-10">
          <ul className="space-y-4">
            <li>
              <Link
                href="/"
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
                href="#"
                onClick={fermerMenu}
                className="block hover:text-yellow-400"
              >
                ⚙️ Paramètres
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}