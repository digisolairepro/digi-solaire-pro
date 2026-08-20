"use client";

import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Client } from "./clients/page";
import type { Projet } from "./projets/page";
import type { Dimensionnement } from "./dimensionnement/page";
import type { Devis } from "./devis/page";

export default function Home() {
  const [clients] = useLocalStorage<Client[]>("digisolaire-clients", []);
  const [projets] = useLocalStorage<Projet[]>("digisolaire-projets", []);
  const [dimensionnements] = useLocalStorage<Dimensionnement[]>(
    "digisolaire-dimensionnements",
    []
  );
  const [devis] = useLocalStorage<Devis[]>("digisolaire-devis", []);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Bienvenue sur Digi Solaire Pro
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Tableau de bord de la plateforme.
          </p>

          <div className="grid grid-cols-4 gap-6 mt-10">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Clients</h2>
              <p className="text-3xl font-bold mt-2">
                {clients.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Projets</h2>
              <p className="text-3xl font-bold mt-2">
                {projets.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Dimensionnements</h2>
              <p className="text-3xl font-bold mt-2">
                {dimensionnements.length}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Devis</h2>
              <p className="text-3xl font-bold mt-2">
                {devis.length}
              </p>
            </div>
          </div>

          <Link
            href="/projets"
            className="mt-10 inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Nouveau projet
          </Link>
        </div>
      </main>
    </div>
  );
}