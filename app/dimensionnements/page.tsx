"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import type { Dimensionnement } from "../dimensionnement/page";
import type { Client } from "../clients/page";

export default function DimensionnementsPage() {
  const [dimensionnements, setDimensionnements] = useState<Dimensionnement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [chargements, setChargements] = useState(false);

  const chargerDonnees = async () => {
    const [reponseDimensionnements, reponseClients] = await Promise.all([
      fetch("/api/dimensionnements"),
      fetch("/api/clients"),
    ]);

    setDimensionnements(await reponseDimensionnements.json());
    setClients(await reponseClients.json());
    setChargements(true);
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const nomDuClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : "Client inconnu";
  };

  const formaterDate = (dateIso: string) => {
    return new Date(dateIso).toLocaleDateString("fr-FR");
  };

  const supprimerDimensionnement = async (id: string) => {
    await fetch(`/api/dimensionnements/${id}`, { method: "DELETE" });
    await chargerDonnees();
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Dimensionnements
            </h1>

            <Link
              href="/dimensionnement"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              + Nouveau dimensionnement
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Client</th>
                  <th className="text-left p-4">Projet</th>
                  <th className="text-left p-4">Ville</th>
                  <th className="text-left p-4">Puissance PV</th>
                  <th className="text-left p-4">Panneaux</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {!chargements ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={7}>
                      Chargement des dimensionnements...
                    </td>
                  </tr>
                ) : dimensionnements.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={7}>
                      Aucun dimensionnement enregistré.
                    </td>
                  </tr>
                ) : (
                  dimensionnements.map((d) => (
                    <tr key={d.id} className="border-t">
                      <td className="p-4">
                        {formaterDate(d.dateCreation)}
                      </td>

                      <td className="p-4">
                        {nomDuClient(d.clientId)}
                      </td>

                      <td className="p-4">
                        {d.nomProjet || "Sans nom"}
                      </td>

                      <td className="p-4">
                        {d.ville}
                      </td>

                      <td className="p-4">
                        {d.puissancePVInstallee.toFixed(2)} kWc
                      </td>

                      <td className="p-4">
                        {d.nombrePanneaux}
                      </td>

                      <td className="p-4 flex gap-4">
                        <Link
                          href={`/dimensionnement?id=${d.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </Link>

                        <button
                          onClick={() => supprimerDimensionnement(d.id)}
                          className="text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  );
}