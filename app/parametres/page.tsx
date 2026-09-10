"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function ParametresPage() {
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [nineaRccm, setNineaRccm] = useState("");
  const [statutAbonnement, setStatutAbonnement] = useState("");

  const [chargement, setChargement] = useState(true);
  const [messageProfil, setMessageProfil] = useState("");

  const [ancienMotDePasse, setAncienMotDePasse] = useState("");
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");
  const [messageMotDePasse, setMessageMotDePasse] = useState("");

  useEffect(() => {
    const chargerProfil = async () => {
      const reponse = await fetch("/api/auth/moi");
      const donnees = await reponse.json();

      if (donnees.connecte) {
        setNomEntreprise(donnees.nomEntreprise);
        setEmail(donnees.email);
        setTelephone(donnees.telephone);
        setAdresse(donnees.adresse);
        setNineaRccm(donnees.nineaRccm);
        setStatutAbonnement(donnees.statutAbonnement);
      }

      setChargement(false);
    };

    chargerProfil();
  }, []);

  const enregistrerProfil = async () => {
    setMessageProfil("");

    const reponse = await fetch("/api/auth/profil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomEntreprise, telephone, adresse, nineaRccm }),
    });

    if (!reponse.ok) {
      const donnees = await reponse.json();
      setMessageProfil(donnees.erreur || "Une erreur est survenue.");
      return;
    }

    setMessageProfil("Profil mis à jour avec succès.");
  };

  const changerMotDePasse = async () => {
    setMessageMotDePasse("");

    const reponse = await fetch("/api/auth/mot-de-passe", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ancienMotDePasse, nouveauMotDePasse }),
    });

    const donnees = await reponse.json();

    if (!reponse.ok) {
      setMessageMotDePasse(donnees.erreur || "Une erreur est survenue.");
      return;
    }

    setMessageMotDePasse("Mot de passe modifié avec succès.");
    setAncienMotDePasse("");
    setNouveauMotDePasse("");
  };

  if (chargement) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-100 min-h-screen">
          <Header />
          <div className="p-10 text-gray-500">Chargement...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10 max-w-2xl">

          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            Paramètres
          </h1>

          <div className="bg-white rounded-xl shadow p-6 mb-8">

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Mon entreprise
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Ces informations apparaîtront plus tard sur vos devis.
            </p>

            {messageProfil && (
              <div
                className={`p-3 rounded-lg mb-4 ${
                  messageProfil.includes("succès")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageProfil}
              </div>
            )}

            <div className="space-y-4">

              <div>
                <label className="block font-medium mb-2">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  value={nomEntreprise}
                  onChange={(e) => setNomEntreprise(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full border rounded-lg p-3 bg-gray-100 text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  L&apos;email ne peut pas être modifié pour l&apos;instant.
                </p>
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="Ex : 77 123 45 67"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="Ex : Liberté 6, Dakar"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  NINEA / RCCM
                </label>
                <input
                  type="text"
                  value={nineaRccm}
                  onChange={(e) => setNineaRccm(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Statut de l&apos;abonnement
                </label>
                <span className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm capitalize">
                  {statutAbonnement}
                </span>
              </div>

            </div>

            <button
              onClick={enregistrerProfil}
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Enregistrer
            </button>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Changer le mot de passe
            </h2>

            {messageMotDePasse && (
              <div
                className={`p-3 rounded-lg mb-4 ${
                  messageMotDePasse.includes("succès")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {messageMotDePasse}
              </div>
            )}

            <div className="space-y-4">

              <div>
                <label className="block font-medium mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={ancienMotDePasse}
                  onChange={(e) => setAncienMotDePasse(e.target.value)}
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  className="w-full border rounded-lg p-3"
                  placeholder="Au moins 6 caractères"
                />
              </div>

            </div>

            <button
              onClick={changerMotDePasse}
              className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Modifier le mot de passe
            </button>

          </div>

        </div>
      </main>
    </div>
  );
}