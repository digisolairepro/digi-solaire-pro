"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Home() {
  const [nombreClients, setNombreClients] = useState(0);
  const [nombreProjets, setNombreProjets] = useState(0);
  const [nombreDimensionnements, setNombreDimensionnements] = useState(0);
  const [nombreDevis, setNombreDevis] = useState(0);

  useEffect(() => {
    const chargerCompteurs = async () => {
      const [reponseClients, reponseProjets, reponseDimensionnements, reponseDevis] =
        await Promise.all([
          fetch("/api/clients"),
          fetch("/api/projets"),
          fetch("/api/dimensionnements"),
          fetch("/api/devis"),
        ]);

      const clients = await reponseClients.json();
      const projets = await reponseProjets.json();
      const dimensionnements = await reponseDimensionnements.json();
      const devis = await reponseDevis.json();

      setNombreClients(clients.length);
      setNombreProjets(projets.length);
      setNombreDimensionnements(dimensionnements.length);
      setNombreDevis(devis.length);
    };

    chargerCompteurs();
  }, []);

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
                {nombreClients}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Projets</h2>
              <p className="text-3xl font-bold mt-2">
                {nombreProjets}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Dimensionnements</h2>
              <p className="text-3xl font-bold mt-2">
                {nombreDimensionnements}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Devis</h2>
              <p className="text-3xl font-bold mt-2">
                {nombreDevis}
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