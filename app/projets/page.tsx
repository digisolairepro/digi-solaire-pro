"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Client } from "../clients/page";
import type { Dimensionnement } from "../dimensionnement/page";

export type Projet = {
  id: string;
  nom: string;
  clientId: string;
  dimensionnementId: string;
  statut: string;
  dateCreation: string;
};

const STATUTS = [
  "Prospection",
  "Devis envoyé",
  "Devis accepté",
  "Installation en cours",
  "Terminé",
  "Annulé",
];

export default function ProjetsPage() {
  const [nom, setNom] = useState("");
  const [clientId, setClientId] = useState("");
  const [dimensionnementId, setDimensionnementId] = useState("");
  const [statut, setStatut] = useState(STATUTS[0]);

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
   const [projetEnModification, setProjetEnModification] = useState<string | null>(null);

  const [projets, setProjets, projetsCharges] = useLocalStorage<Projet[]>(
    "digisolaire-projets",
    []
  );

  const [clients] = useLocalStorage<Client[]>("digisolaire-clients", []);
  const [dimensionnements] = useLocalStorage<Dimensionnement[]>(
    "digisolaire-dimensionnements",
    []
  );

  const nomDuClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.nom : "Client inconnu";
  };

  const nomDuDimensionnement = (id: string) => {
    if (!id) {
      return "Aucun";
    }

    const dimensionnement = dimensionnements.find((d) => d.id === id);
    return dimensionnement
      ? dimensionnement.nomProjet || "Sans nom"
      : "Introuvable";
  };

  const enregistrerProjet = () => {
    if (!nom || !clientId) {
      alert("Veuillez renseigner un nom de projet et sélectionner un client.");
      return;
    }

    if (projetEnModification !== null) {
      setProjets(
        projets.map((p) =>
          p.id === projetEnModification
            ? { ...p, nom, clientId, dimensionnementId, statut }
            : p
        )
      );
      setProjetEnModification(null);
    } else {
      const nouveauProjet: Projet = {
        id: crypto.randomUUID(),
        nom,
        clientId,
        dimensionnementId,
        statut,
        dateCreation: new Date().toISOString(),
      };

      setProjets([...projets, nouveauProjet]);
    }

    setNom("");
    setClientId("");
    setDimensionnementId("");
    setStatut(STATUTS[0]);
    setFormulaireOuvert(false);
  };

  const modifierProjet = (id: string) => {
    const projet = projets.find((p) => p.id === id);

    if (!projet) {
      return;
    }

    setNom(projet.nom);
    setClientId(projet.clientId);
    setDimensionnementId(projet.dimensionnementId);
    setStatut(projet.statut);

    setProjetEnModification(id);
    setFormulaireOuvert(true);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Projets
            </h1>

            <button
              onClick={() => setFormulaireOuvert(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              + Nouveau projet
            </button>
          </div>

          {formulaireOuvert && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {projetEnModification !== null
                  ? "Modifier le projet"
                  : "Nouveau projet"}
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="block font-medium mb-2">
                    Nom du projet
                  </label>

                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Ex : Installation solaire villa Fatou"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Client
                  </label>

                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">
                      -- Sélectionner un client --
                    </option>

                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Dimensionnement associé (optionnel)
                  </label>

                  <select
                    value={dimensionnementId}
                    onChange={(e) => setDimensionnementId(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">
                      -- Aucun pour l&apos;instant --
                    </option>

                    {dimensionnements.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nomProjet || "Sans nom"} ({nomDuClient(d.clientId)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">
                    Statut
                  </label>

                  <select
                    value={statut}
                    onChange={(e) => setStatut(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    {STATUTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => {
                    setFormulaireOuvert(false);
                    setProjetEnModification(null);
                    setNom("");
                    setClientId("");
                    setDimensionnementId("");
                    setStatut(STATUTS[0]);
                  }}
                  className="border px-6 py-3 rounded-lg"
                >
                  Annuler
                </button>

                <button
                  onClick={enregistrerProjet}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Enregistrer
                </button>

              </div>

            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left p-4">Nom du projet</th>
                  <th className="text-left p-4">Client</th>
                  <th className="text-left p-4">Statut</th>
                  <th className="text-left p-4">Dimensionnement</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!projetsCharges ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      Chargement des projets...
                    </td>
                  </tr>
                ) : projets.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      Aucun projet enregistré.
                    </td>
                  </tr>
                ) : (
                  projets.map((projet) => (
                    <tr key={projet.id} className="border-t">
                      <td className="p-4">
                        {projet.nom}
                      </td>

                      <td className="p-4">
                        {nomDuClient(projet.clientId)}
                      </td>

                      <td className="p-4">
                        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                          {projet.statut}
                        </span>
                      </td>

                      <td className="p-4">
                        {nomDuDimensionnement(projet.dimensionnementId)}
                      </td>

                      <td className="p-4 flex gap-4">
                        <button
                          onClick={() => modifierProjet(projet.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => {
                            const nouveauxProjets = projets.filter(
                              (p) => p.id !== projet.id
                            );

                            setProjets(nouveauxProjets);
                          }}
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