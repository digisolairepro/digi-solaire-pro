"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Client } from "../clients/page";
import type { Dimensionnement } from "../dimensionnement/page";
import type { Projet } from "../projets/page";

export type LigneDevis = {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
};

export type Devis = {
  id: string;
  dimensionnementId: string;
  statut: string;
  dateCreation: string;
  lignes: LigneDevis[];
};

const STATUTS_DEVIS = ["Brouillon", "Envoyé", "Accepté", "Refusé"];

export default function DevisPage() {
  const [devis, setDevis, devisCharges] = useLocalStorage<Devis[]>(
    "digisolaire-devis",
    []
  );

  const [clients] = useLocalStorage<Client[]>("digisolaire-clients", []);
  const [dimensionnements] = useLocalStorage<Dimensionnement[]>(
    "digisolaire-dimensionnements",
    []
  );
  const [projets] = useLocalStorage<Projet[]>("digisolaire-projets", []);

  const [dimensionnementIdChoisi, setDimensionnementIdChoisi] = useState("");
  const [statut, setStatut] = useState(STATUTS_DEVIS[0]);
  const [lignes, setLignes] = useState<LigneDevis[]>([]);

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const [devisEnModification, setDevisEnModification] = useState<string | null>(null);

  const nomDuClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : "Client inconnu";
  };

  const dimensionnementDe = (dimensionnementId: string) => {
    return dimensionnements.find((d) => d.id === dimensionnementId);
  };

  const genererLignesDepuisDimensionnement = (
    dimensionnementId: string
  ): LigneDevis[] => {
    const d = dimensionnementDe(dimensionnementId);

    if (!d) {
      return [];
    }

    return [
      {
        id: crypto.randomUUID(),
        designation: `Panneaux solaires ${d.puissancePanneau} W`,
        quantite: d.nombrePanneaux,
        prixUnitaire: 0,
      },
      {
        id: crypto.randomUUID(),
        designation: `Onduleur ${Math.round(d.puissanceOnduleur)} W`,
        quantite: 1,
        prixUnitaire: 0,
      },
      {
        id: crypto.randomUUID(),
        designation: `Batterie ${d.tensionBatterie} V - ${Math.round(
          d.capaciteBatterieAh
        )} Ah`,
        quantite: 1,
        prixUnitaire: 0,
      },
    ];
  };

  const choisirDimensionnement = (id: string) => {
    setDimensionnementIdChoisi(id);

    if (devisEnModification === null && id) {
      setLignes(genererLignesDepuisDimensionnement(id));
    }
  };

  const ajouterLigneVide = () => {
    setLignes([
      ...lignes,
      {
        id: crypto.randomUUID(),
        designation: "",
        quantite: 1,
        prixUnitaire: 0,
      },
    ]);
  };

  const modifierLigne = (
    id: string,
    champ: keyof LigneDevis,
    valeur: string
  ) => {
    setLignes(
      lignes.map((ligne) => {
        if (ligne.id !== id) {
          return ligne;
        }

        if (champ === "designation") {
          return { ...ligne, designation: valeur };
        }

        return { ...ligne, [champ]: Number(valeur) || 0 };
      })
    );
  };

  const supprimerLigne = (id: string) => {
    setLignes(lignes.filter((ligne) => ligne.id !== id));
  };

  const totalDevis = lignes.reduce(
    (somme, ligne) => somme + ligne.quantite * ligne.prixUnitaire,
    0
  );

  const reinitialiserFormulaire = () => {
    setDimensionnementIdChoisi("");
    setStatut(STATUTS_DEVIS[0]);
    setLignes([]);
    setDevisEnModification(null);
    setFormulaireOuvert(false);
  };

  const enregistrerDevis = () => {
    if (!dimensionnementIdChoisi) {
      alert("Veuillez sélectionner un dimensionnement.");
      return;
    }

    const dimensionnement = dimensionnementDe(dimensionnementIdChoisi);

    if (!dimensionnement) {
      alert("Dimensionnement introuvable.");
      return;
    }

    const projetExiste = projets.some(
      (p) => p.clientId === dimensionnement.clientId
    );

    if (!projetExiste) {
      alert(
        "Vous devez d'abord créer un projet pour ce client avant de faire un devis."
      );
      return;
    }

    if (devisEnModification !== null) {
      setDevis(
        devis.map((d) =>
          d.id === devisEnModification
            ? {
                ...d,
                dimensionnementId: dimensionnementIdChoisi,
                statut,
                lignes,
              }
            : d
        )
      );
    } else {
      const nouveauDevis: Devis = {
        id: crypto.randomUUID(),
        dimensionnementId: dimensionnementIdChoisi,
        statut,
        dateCreation: new Date().toISOString(),
        lignes,
      };

      setDevis([...devis, nouveauDevis]);
    }

    reinitialiserFormulaire();
  };

  const modifierDevis = (id: string) => {
    const d = devis.find((dv) => dv.id === id);

    if (!d) {
      return;
    }

    setDimensionnementIdChoisi(d.dimensionnementId);
    setStatut(d.statut);
    setLignes(d.lignes);
    setDevisEnModification(id);
    setFormulaireOuvert(true);
  };

  const totalDe = (d: Devis) => {
    return d.lignes.reduce(
      (somme, ligne) => somme + ligne.quantite * ligne.prixUnitaire,
      0
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Devis
            </h1>

            <button
              onClick={() => setFormulaireOuvert(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              + Nouveau devis
            </button>
          </div>

          {formulaireOuvert && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {devisEnModification !== null
                  ? "Modifier le devis"
                  : "Nouveau devis"}
              </h2>

              <div className="space-y-4 mb-6">

                <div>
                  <label className="block font-medium mb-2">
                    Dimensionnement
                  </label>

                  <select
                    value={dimensionnementIdChoisi}
                    onChange={(e) => choisirDimensionnement(e.target.value)}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">
                      -- Sélectionner un dimensionnement --
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
                    {STATUTS_DEVIS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {lignes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Lignes du devis</h3>

                  <table className="w-full mb-4">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Désignation</th>
                        <th className="text-left p-2 w-24">Qté</th>
                        <th className="text-left p-2 w-40">
                          Prix unitaire
                        </th>
                        <th className="text-left p-2 w-32">Sous-total</th>
                        <th className="p-2 w-16"></th>
                      </tr>
                    </thead>

                    <tbody>
                      {lignes.map((ligne) => (
                        <tr key={ligne.id} className="border-t">
                          <td className="p-2">
                            <input
                              type="text"
                              value={ligne.designation}
                              onChange={(e) =>
                                modifierLigne(
                                  ligne.id,
                                  "designation",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded p-2"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={ligne.quantite}
                              onChange={(e) =>
                                modifierLigne(
                                  ligne.id,
                                  "quantite",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded p-2"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={ligne.prixUnitaire}
                              onChange={(e) =>
                                modifierLigne(
                                  ligne.id,
                                  "prixUnitaire",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded p-2"
                            />
                          </td>

                          <td className="p-2 font-semibold">
                            {(
                              ligne.quantite * ligne.prixUnitaire
                            ).toLocaleString("fr-FR")}{" "}
                            FCFA
                          </td>

                          <td className="p-2">
                            <button
                              onClick={() => supprimerLigne(ligne.id)}
                              className="text-red-600 hover:underline"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={ajouterLigneVide}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    + Ajouter une ligne
                  </button>

                  <div className="text-right mt-4 text-xl font-bold">
                    Total : {totalDevis.toLocaleString("fr-FR")} FCFA
                  </div>
                </div>
              )}

              <div className="flex gap-4">

                <button
                  onClick={reinitialiserFormulaire}
                  className="border px-6 py-3 rounded-lg"
                >
                  Annuler
                </button>

                <button
                  onClick={enregistrerDevis}
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
                  <th className="text-left p-4">Client</th>
                  <th className="text-left p-4">Projet</th>
                  <th className="text-left p-4">Statut</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!devisCharges ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      Chargement des devis...
                    </td>
                  </tr>
                ) : devis.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={5}>
                      Aucun devis enregistré.
                    </td>
                  </tr>
                ) : (
                  devis.map((d) => {
                    const dim = dimensionnementDe(d.dimensionnementId);

                    return (
                      <tr key={d.id} className="border-t">
                        <td className="p-4">
                          {dim ? nomDuClient(dim.clientId) : "Client inconnu"}
                        </td>

                        <td className="p-4">
                          {dim ? dim.nomProjet || "Sans nom" : "Introuvable"}
                        </td>

                        <td className="p-4">
                          <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                            {d.statut}
                          </span>
                        </td>

                        <td className="p-4 font-semibold">
                          {totalDe(d).toLocaleString("fr-FR")} FCFA
                        </td>

                        <td className="p-4 flex gap-4">
                          <button
                            onClick={() => modifierDevis(d.id)}
                            className="text-blue-600 hover:underline"
                          >
                            Modifier
                          </button>

                          <button
                            onClick={() => {
                              setDevis(
                                devis.filter((dv) => dv.id !== d.id)
                              );
                            }}
                            className="text-red-600 hover:underline"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

            </table>

          </div>

        </div>
      </main>
    </div>
  );
}