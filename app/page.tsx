import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Home() {
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
              <p className="text-3xl font-bold mt-2">0</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Projets</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Dimensionnements</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-gray-500">Devis</h2>
              <p className="text-3xl font-bold mt-2">0</p>
            </div>
          </div>

          <button className="mt-10 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold">
            + Nouveau projet
          </button>
        </div>
      </main>
    </div>
  );
}