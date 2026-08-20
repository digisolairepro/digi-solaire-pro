"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import type { Client } from "../clients/page";

export type Appareil = {
  nom: string;
  quantite: number;
  puissance: number;
  heures: number;
};

export type Dimensionnement = {
  id: string;
  dateCreation: string;

  // Informations du projet
  nomProjet: string;
  clientId: string;
  ville: string;
  typeInstallation: string;

  // Ce que vous avez saisi
  appareils: Appareil[];
  puissancePanneau: number;
  autonomie: number;
  tensionBatterie: number;
  dod: number;
  rendementBatterie: number;

  // Résultats figés au moment de l'enregistrement
  consommationTotale: number;
  consommationKWh: number;
  puissancePV: number;
  nombrePanneaux: number;
  puissancePVInstallee: number;
  puissanceMaximale: number;
  puissanceOnduleur: number;
  energieAutonomie: number;
  capaciteBatterieKWh: number;
  capaciteBatterieAh: number;
};

function DimensionnementContent() {
// ==========================================
  // INFORMATIONS DU PROJET
  // ==========================================

  const [nomProjet, setNomProjet] = useState("");
  const [clientId, setClientId] = useState("");
  const [clients] = useLocalStorage<Client[]>("digisolaire-clients", []);
  const [ville, setVille] = useState("");
  const [typeInstallation, setTypeInstallation] = useState("");

  // ==========================================
  // PANNEAU SOLAIRE
  // ==========================================

  const [puissancePanneau, setPuissancePanneau] =
    useState(450);

  // ==========================================
  // BATTERIE
  // ==========================================

  const [autonomie, setAutonomie] = useState(1);
  const [tensionBatterie, setTensionBatterie] =
    useState(48);
  const [dod, setDod] = useState(80);
  const [rendementBatterie, setRendementBatterie] =
    useState(90);

  // ==========================================
  // APPAREILS
  // ==========================================

  const [appareils, setAppareils] = useState<Appareil[]>([
    {
      nom: "",
      quantite: 1,
      puissance: 0,
      heures: 0,
    },
  ]);
  // ==========================================
  // MODIFICATION D'UN DIMENSIONNEMENT EXISTANT
  // ==========================================

  const searchParams = useSearchParams();
  const idModification = searchParams.get("id");

  const [dejaCharge, setDejaCharge] = useState(false);

  // ==========================================
  // AJOUTER UN APPAREIL
  // ==========================================

  const ajouterAppareil = () => {
    setAppareils((anciensAppareils) => [
      ...anciensAppareils,
      {
        nom: "",
        quantite: 1,
        puissance: 0,
        heures: 0,
      },
    ]);
  };

  // ==========================================
  // MODIFIER UN APPAREIL
  // ==========================================

  const modifierAppareil = (
    index: number,
    champ: keyof Appareil,
    valeur: string
  ) => {
    setAppareils((anciensAppareils) =>
      anciensAppareils.map((appareil, i) => {
        if (i !== index) {
          return appareil;
        }

        if (champ === "nom") {
          return {
            ...appareil,
            nom: valeur,
          };
        }

        return {
          ...appareil,
          [champ]: Number(valeur) || 0,
        };
      })
    );
  };

  // ==========================================
  // SUPPRIMER UN APPAREIL
  // ==========================================

  const supprimerAppareil = (index: number) => {
    setAppareils((anciensAppareils) =>
      anciensAppareils.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // CONSOMMATION QUOTIDIENNE
  // ==========================================

  const consommationTotale = appareils.reduce(
    (total, appareil) => {
      return (
        total +
        appareil.quantite *
          appareil.puissance *
          appareil.heures
      );
    },
    0
  );

  // Conversion Wh → kWh

  const consommationKWh =
    consommationTotale / 1000;
console.log("TABLEAU APPAREILS :", appareils);
console.log("TOTAL WH :", consommationTotale);
console.log("TOTAL KWH :", consommationKWh);

  // ==========================================
  // PARAMÈTRES SOLAIRES
  // ==========================================

  const hsp = 5.8;
  const rendement = 0.8;

  // ==========================================
  // DIMENSIONNEMENT PV
  // ==========================================

  const puissancePV =
    consommationKWh > 0
      ? consommationKWh /
        (hsp * rendement)
      : 0;

  // Nombre de panneaux nécessaires
  const nombrePanneaux =
    puissancePV > 0
      ? Math.ceil(
          (puissancePV * 1000) /
            puissancePanneau
        )
      : 0;

  // Puissance réellement installée
  const puissancePVInstallee =
    (nombrePanneaux *
      puissancePanneau) /
    1000;

  // ==========================================
  // PUISSANCE MAXIMALE DES APPAREILS
  // ==========================================

  const puissanceMaximale =
    appareils.reduce(
      (total, appareil) =>
        total +
        appareil.quantite *
          appareil.puissance,
      0
    );

  // ==========================================
  // DIMENSIONNEMENT ONDULEUR
  // ==========================================

  const margeOnduleur = 1.25;

  const puissanceOnduleur =
    puissanceMaximale > 0
      ? puissanceMaximale *
        margeOnduleur
      : 0;

  // ==========================================
  // DIMENSIONNEMENT BATTERIE
  // ==========================================

  // Énergie nécessaire pendant l'autonomie
  const energieAutonomie =
    consommationKWh * autonomie;

  // Capacité nominale de batterie
  const capaciteBatterieKWh =
    energieAutonomie /
    ((dod / 100) *
      (rendementBatterie / 100));

  // Conversion en Wh
  const capaciteBatterieWh =
    capaciteBatterieKWh * 1000;

  // Conversion en Ah
  const capaciteBatterieAh =
    tensionBatterie > 0
      ? capaciteBatterieWh /
        tensionBatterie
      : 0;

  // ==========================================
  // BOUTON CALCUL
  // ==========================================

    const resultatsRef = useRef<HTMLDivElement>(null);

    const [dimensionnements, setDimensionnements] = useLocalStorage<Dimensionnement[]>("digisolaire-dimensionnements", []);
  const calculerDimensionnement = () => {
    if (!clientId) {
      alert("Veuillez sélectionner un client avant d'enregistrer.");
      return;
    }

        if (idModification) {
      const dimensionnementsMisAJour = dimensionnements.map((d) =>
        d.id === idModification
          ? {
              ...d,
              dateCreation: new Date().toISOString(),
              nomProjet,
              clientId,
              ville,
              typeInstallation,
              appareils,
              puissancePanneau,
              autonomie,
              tensionBatterie,
              dod,
              rendementBatterie,
              consommationTotale,
              consommationKWh,
              puissancePV,
              nombrePanneaux,
              puissancePVInstallee,
              puissanceMaximale,
              puissanceOnduleur,
              energieAutonomie,
              capaciteBatterieKWh,
              capaciteBatterieAh,
            }
          : d
      );

      setDimensionnements(dimensionnementsMisAJour);

      alert("Dimensionnement mis à jour avec succès !");
    } else {
      const nouveauDimensionnement: Dimensionnement = {
        id: crypto.randomUUID(),
        dateCreation: new Date().toISOString(),

        nomProjet,
        clientId,
        ville,
        typeInstallation,

        appareils,
        puissancePanneau,
        autonomie,
        tensionBatterie,
        dod,
        rendementBatterie,

        consommationTotale,
        consommationKWh,
        puissancePV,
        nombrePanneaux,
        puissancePVInstallee,
        puissanceMaximale,
        puissanceOnduleur,
        energieAutonomie,
        capaciteBatterieKWh,
        capaciteBatterieAh,
      };

      setDimensionnements([...dimensionnements, nouveauDimensionnement]);

      alert("Dimensionnement enregistré avec succès !");
    }

    resultatsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (!idModification || dejaCharge) {
      return;
    }

    const dimensionnementExistant = dimensionnements.find(
      (d) => d.id === idModification
    );

    if (dimensionnementExistant) {
      setNomProjet(dimensionnementExistant.nomProjet);
      setClientId(dimensionnementExistant.clientId);
      setVille(dimensionnementExistant.ville);
      setTypeInstallation(dimensionnementExistant.typeInstallation);
      setAppareils(dimensionnementExistant.appareils);
      setPuissancePanneau(dimensionnementExistant.puissancePanneau);
      setAutonomie(dimensionnementExistant.autonomie);
      setTensionBatterie(dimensionnementExistant.tensionBatterie);
      setDod(dimensionnementExistant.dod);
      setRendementBatterie(dimensionnementExistant.rendementBatterie);

      setDejaCharge(true);
    }
  }, [idModification, dimensionnements, dejaCharge]);

  // ==========================================
  // AFFICHAGE
  // ==========================================

    return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">

        <Header />

        <div className="p-10">

        {/* ======================================
            TITRE
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            ☀️ Dimensionnement solaire
          </h1>

          <p className="mt-3 text-lg text-gray-600">
            Créez un nouveau dimensionnement
            pour une installation solaire.
          </p>

        </div>


        {/* ======================================
            INFORMATIONS PROJET
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Informations du projet
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block font-medium mb-2">
                Nom du projet
              </label>

              <input
                type="text"
                value={nomProjet}
                onChange={(e) =>
                  setNomProjet(e.target.value)
                }
                placeholder="Ex : Installation solaire maison"
                className="w-full border rounded-lg p-3"
              />

            </div>


            <div>

              <label className="block font-medium mb-2">
                Client
              </label>

                            <select
                value={clientId}
                onChange={(e) =>
                  setClientId(e.target.value)
                }
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

              {clients.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Aucun client enregistré. Ajoutez-en un
                  d&apos;abord dans la page Clients.
                </p>
              )}

            </div>


            <div>

              <label className="block font-medium mb-2">
                Ville / Localisation
              </label>

              <input
                type="text"
                value={ville}
                onChange={(e) =>
                  setVille(e.target.value)
                }
                placeholder="Ex : Dakar"
                className="w-full border rounded-lg p-3"
              />

            </div>


            <div>

              <label className="block font-medium mb-2">
                Type d'installation
              </label>

              <select
                value={typeInstallation}
                onChange={(e) =>
                  setTypeInstallation(
                    e.target.value
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value="">
                  Sélectionner
                </option>

                <option value="autoconsommation">
                  Autoconsommation
                </option>

                <option value="site-isole">
                  Site isolé
                </option>

                <option value="hybride">
                  Installation hybride
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ======================================
            CONSOMMATION
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Consommation électrique
          </h2>

          <p className="text-gray-500 mb-6">
            Ajoutez les appareils utilisés par le client.
          </p>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-200">

                <tr>

                  <th className="text-left p-4">
                    Appareil
                  </th>

                  <th className="text-left p-4">
                    Quantité
                  </th>

                  <th className="text-left p-4">
                    Puissance (W)
                  </th>

                  <th className="text-left p-4">
                    Utilisation (h/j)
                  </th>

                  <th className="text-left p-4">
                    Énergie (Wh/j)
                  </th>

                  <th className="text-left p-4">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {appareils.map(
                  (appareil, index) => {

                    const energieAppareil =
                      appareil.quantite *
                      appareil.puissance *
                      appareil.heures;

                    return (

                      <tr
                        key={index}
                        className="border-t"
                      >

                        <td className="p-4">

                          <input
                            type="text"
                            value={appareil.nom}
                            onChange={(e) =>
                              modifierAppareil(
                                index,
                                "nom",
                                e.target.value
                              )
                            }
                            placeholder="Ex : Lampe"
                            className="border rounded-lg p-2 w-full"
                          />

                        </td>


                        <td className="p-4">

                          <input
                            type="number"
                            min="1"
                            value={appareil.quantite}
                            onChange={(e) =>
                              modifierAppareil(
                                index,
                                "quantite",
                                e.target.value
                              )
                            }
                            className="border rounded-lg p-2 w-full"
                          />

                        </td>


                        <td className="p-4">

                          <input
                            type="number"
                            min="0"
                            value={appareil.puissance}
                            onChange={(e) =>
                              modifierAppareil(
                                index,
                                "puissance",
                                e.target.value
                              )
                            }
                            placeholder="Ex : 100"
                            className="border rounded-lg p-2 w-full"
                          />

                        </td>


                        <td className="p-4">

                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.1"
                            value={appareil.heures}
                            onChange={(e) =>
                              modifierAppareil(
                                index,
                                "heures",
                                e.target.value
                              )
                            }
                            placeholder="Ex : 5"
                            className="border rounded-lg p-2 w-full"
                          />

                        </td>


                        <td className="p-4 font-semibold">

                          {energieAppareil.toLocaleString(
                            "fr-FR"
                          )}{" "}
                          Wh

                        </td>


                        <td className="p-4">

                          <button
                            type="button"
                            onClick={() =>
                              supprimerAppareil(index)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                          >
                            Supprimer
                          </button>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>


          <button
            type="button"
            onClick={ajouterAppareil}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            + Ajouter un appareil
          </button>

        </div>


        {/* ======================================
            CONSOMMATION QUOTIDIENNE
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Consommation quotidienne
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Consommation par jour
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">

                {consommationTotale.toLocaleString(
                  "fr-FR"
                )}{" "}
                Wh/jour

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Énergie quotidienne
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">

                {consommationKWh.toFixed(3)}{" "}
                kWh/jour

              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            RESSOURCE SOLAIRE
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ☀️ Ressource solaire
          </h2>

          <p className="text-gray-500 mb-6">
            Paramètres utilisés pour le
            pré-dimensionnement.
          </p>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Heures solaires de pointe
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {hsp} h
              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Rendement global
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {(rendement * 100).toFixed(0)} %
              </p>

            </div>


            <div>

              <label className="block font-medium mb-2">
                Puissance du panneau
              </label>

              <select
                value={puissancePanneau}
                onChange={(e) =>
                  setPuissancePanneau(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value={400}>
                  400 Wc
                </option>

                <option value={450}>
                  450 Wc
                </option>

                <option value={500}>
                  500 Wc
                </option>

                <option value={530}>
                  530 Wc
                </option>

                <option value={550}>
                  550 Wc
                </option>

                <option value={580}>
                  580 Wc
                </option>

                <option value={600}>
                  600 Wc
                </option>

                <option value={610}>
                  610 Wc
                </option>

                <option value={620}>
                  620 Wc
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ======================================
            DIMENSIONNEMENT PV
        ====================================== */}

        <div
          ref={resultatsRef}
          className="bg-white rounded-xl shadow p-6 mb-8"
        >

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ⚡ Dimensionnement photovoltaïque
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Puissance PV nécessaire
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">

                {puissancePV.toFixed(2)} kWc

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Nombre de panneaux
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">

                {nombrePanneaux}

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Puissance PV installée
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">

                {puissancePVInstallee.toFixed(2)} kWc

              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            PARAMÈTRES BATTERIE
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🔋 Paramètres batterie
          </h2>

          <p className="text-gray-500 mb-6">
            Définissez les paramètres du système de stockage.
          </p>


          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block font-medium mb-2">
                Autonomie souhaitée
              </label>

              <select
                value={autonomie}
                onChange={(e) =>
                  setAutonomie(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value={1}>
                  1 jour
                </option>

                <option value={2}>
                  2 jours
                </option>

                <option value={3}>
                  3 jours
                </option>

                <option value={4}>
                  4 jours
                </option>

                <option value={5}>
                  5 jours
                </option>

              </select>

            </div>


            <div>

              <label className="block font-medium mb-2">
                Tension du parc batterie
              </label>

              <select
                value={tensionBatterie}
                onChange={(e) =>
                  setTensionBatterie(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value={12}>
                  12 V
                </option>

                <option value={24}>
                  24 V
                </option>

                <option value={48}>
                  48 V
                </option>

              </select>

            </div>


            <div>

              <label className="block font-medium mb-2">
                Profondeur de décharge (DoD)
              </label>

              <select
                value={dod}
                onChange={(e) =>
                  setDod(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value={50}>
                  50 %
                </option>

                <option value={60}>
                  60 %
                </option>

                <option value={70}>
                  70 %
                </option>

                <option value={80}>
                  80 %
                </option>

                <option value={90}>
                  90 %
                </option>

              </select>

            </div>


            <div>

              <label className="block font-medium mb-2">
                Rendement de la batterie
              </label>

              <select
                value={rendementBatterie}
                onChange={(e) =>
                  setRendementBatterie(
                    Number(e.target.value)
                  )
                }
                className="w-full border rounded-lg p-3 bg-white"
              >

                <option value={85}>
                  85 %
                </option>

                <option value={90}>
                  90 %
                </option>

                <option value={95}>
                  95 %
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* ======================================
            DIMENSIONNEMENT BATTERIE
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📊 Dimensionnement du stockage
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Énergie pour l'autonomie
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">

                {energieAutonomie.toFixed(2)} kWh

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Capacité nécessaire
              </p>

              <p className="text-3xl font-bold text-yellow-600 mt-2">

                {capaciteBatterieKWh.toFixed(2)} kWh

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Capacité du parc
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">

                {capaciteBatterieAh.toFixed(0)} Ah

              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            ONDULEUR
        ====================================== */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🔌 Dimensionnement de l'onduleur
          </h2>

          <p className="text-gray-500 mb-6">
            Estimation basée sur la puissance
            maximale des appareils.
          </p>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Puissance maximale des appareils
              </p>

              <p className="text-3xl font-bold text-gray-800 mt-2">

                {puissanceMaximale.toLocaleString(
                  "fr-FR"
                )}{" "}
                W

              </p>

            </div>


            <div className="bg-gray-100 rounded-lg p-5">

              <p className="text-gray-500">
                Puissance recommandée de l'onduleur
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">

                {puissanceOnduleur.toFixed(0)} W

              </p>

            </div>

          </div>

        </div>


        {/* ======================================
            BOUTON
        ====================================== */}

                <button
          type="button"
          onClick={calculerDimensionnement}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg"
        >
          💾 Enregistrer le dimensionnement
        </button>

               </div>

      </main>
    </div>
  );
}

export default function DimensionnementPage() {
  return (
    <Suspense fallback={<div className="p-10">Chargement...</div>}>
      <DimensionnementContent />
    </Suspense>
  );
}