"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InscriptionPage() {
  const router = useRouter();

  const [nomEntreprise, setNomEntreprise] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const sInscrire = async () => {
    setErreur("");

    if (!nomEntreprise || !email || !motDePasse) {
      setErreur("Tous les champs sont obligatoires.");
      return;
    }

    if (motDePasse.length < 6) {
      setErreur("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setChargement(true);

    const reponse = await fetch("/api/auth/inscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse, nomEntreprise }),
    });

    setChargement(false);

    if (!reponse.ok) {
      const donnees = await reponse.json();
      setErreur(donnees.erreur || "Une erreur est survenue.");
      return;
    }

    router.push("/tableau-de-bord");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Créer un compte
        </h1>

        {erreur && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {erreur}
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
              placeholder="Ex : Soleil Énergie SARL"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Au moins 6 caractères"
            />
          </div>
        </div>

        <button
          onClick={sInscrire}
          disabled={chargement}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold mt-6"
        >
          {chargement ? "Création..." : "Créer mon compte"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}