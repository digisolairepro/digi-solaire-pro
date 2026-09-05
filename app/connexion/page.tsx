"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConnexionPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const seConnecter = async () => {
    setErreur("");
    setChargement(true);

    const reponse = await fetch("/api/auth/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, motDePasse }),
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
          Connexion
        </h1>

        {erreur && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {erreur}
          </div>
        )}

        <div className="space-y-4">
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
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          onClick={seConnecter}
          disabled={chargement}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold mt-6"
        >
          {chargement ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-gray-600 mt-6">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-blue-600 hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}