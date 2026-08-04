export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-yellow-600">
          ☀ Digi Solaire Pro
        </h1>

        <p className="text-gray-500 text-sm">
          Plateforme professionnelle de dimensionnement solaire
        </p>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-2xl">🔔</span>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
            F
          </div>

          <div>
            <p className="font-semibold">Fatima</p>
            <p className="text-sm text-gray-500">
              Administrateur
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}