"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export type Client = {
  id: string;
  nom: string;
  telephone: string;
  ville: string;
};

export default function ClientsPage() {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [ville, setVille] = useState("");

  const [formulaireOuvert, setFormulaireOuvert] = useState(false);

  const [clients, setClients] = useState<Client[]>([]);
  const [clientsCharges, setClientsCharges] = useState(false);
  const [clientEnModification, setClientEnModification] = useState<string | null>(null);

  const chargerClients = async () => {
    const reponse = await fetch("/api/clients");
    const donnees = await reponse.json();

    setClients(donnees);
    setClientsCharges(true);
  };

  useEffect(() => {
    chargerClients();
  }, []);

  const enregistrerClient = async () => {
    if (clientEnModification !== null) {
      await fetch(`/api/clients/${clientEnModification}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, ville }),
      });

      setClientEnModification(null);
    } else {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, telephone, ville }),
      });
    }

    setNom("");
    setTelephone("");
    setVille("");
    setFormulaireOuvert(false);

    await chargerClients();
  };

  const modifierClient = (id: string) => {
    const client = clients.find((c) => c.id === id);

    if (!client) {
      return;
    }

    setNom(client.nom);
    setTelephone(client.telephone);
    setVille(client.ville);

    setClientEnModification(id);
    setFormulaireOuvert(true);
  };

  const supprimerClient = async (id: string) => {
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    await chargerClients();
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <div className="p-10">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Clients
            </h1>

            <button
              onClick={() => setFormulaireOuvert(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              + Nouveau client
            </button>
          </div>

          {formulaireOuvert && (
            <div className="bg-white rounded-xl shadow p-6 mb-8">

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {clientEnModification !== null
                  ? "Modifier le client"
                  : "Nouveau client"}
              </h2>

              <div className="space-y-4">

                <div>
                  <label className="block font-medium mb-2">
                    Nom complet
                  </label>

                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Ex : Fatou Diop"
                  />
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
                    Ville
                  </label>

                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full border rounded-lg p-3"
                    placeholder="Ex : Dakar"
                  />
                </div>

              </div>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() => {
                    setFormulaireOuvert(false);
                    setClientEnModification(null);
                    setNom("");
                    setTelephone("");
                    setVille("");
                  }}
                  className="border px-6 py-3 rounded-lg"
                >
                  Annuler
                </button>

                <button
                  onClick={enregistrerClient}
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
                  <th className="text-left p-4">Nom</th>
                  <th className="text-left p-4">Téléphone</th>
                  <th className="text-left p-4">Ville</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {!clientsCharges ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={4}>
                      Chargement des clients...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={4}>
                      Aucun client enregistré.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="border-t">
                      <td className="p-4">
                        {client.nom}
                      </td>

                      <td className="p-4">
                        {client.telephone}
                      </td>

                      <td className="p-4">
                        {client.ville}
                      </td>

                      <td className="p-4 flex gap-4">
                        <button
                          onClick={() => modifierClient(client.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </button>

                        <button
                          onClick={() => supprimerClient(client.id)}
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