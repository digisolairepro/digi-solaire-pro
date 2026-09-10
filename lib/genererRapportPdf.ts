import jsPDF from "jspdf";

type InfosEntreprise = {
  nomEntreprise: string;
  telephone: string;
  adresse: string;
  nineaRccm: string;
};

type InfosClient = {
  nom: string;
  telephone: string;
  ville: string;
};

type Appareil = {
  nom: string;
  quantite: number;
  puissance: number;
  heures: number;
};

type ResultatsDimensionnement = {
  appareils: Appareil[];
  consommationTotale: number;
  consommationKWh: number;
  puissancePV: number;
  nombrePanneaux: number;
  puissancePVInstallee: number;
  puissanceOnduleur: number;
  capaciteBatterieKWh: number;
  capaciteBatterieAh: number;
};

export function genererRapportPdf(
  entreprise: InfosEntreprise,
  client: InfosClient,
  resultats: ResultatsDimensionnement
) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(entreprise.nomEntreprise || "DigiSolaire Pro", 14, y);

  y += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  if (entreprise.telephone) {
    doc.text(`Tél : ${entreprise.telephone}`, 14, y);
    y += 5;
  }

  if (entreprise.adresse) {
    doc.text(entreprise.adresse, 14, y);
    y += 5;
  }

  if (entreprise.nineaRccm) {
    doc.text(`NINEA/RCCM : ${entreprise.nineaRccm}`, 14, y);
    y += 5;
  }

  y += 8;
  doc.setDrawColor(200);
  doc.line(14, y, 196, y);
  y += 10;

  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text("Rapport de dimensionnement solaire", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Client", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.text(`${client.nom}`, 14, y);
  y += 5;

  if (client.telephone) {
    doc.text(`Tél : ${client.telephone}`, 14, y);
    y += 5;
  }

  if (client.ville) {
    doc.text(`Ville : ${client.ville}`, 14, y);
    y += 5;
  }

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Appareils", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  resultats.appareils.forEach((a) => {
    doc.text(
      `${a.nom || "Appareil"} — ${a.quantite} x ${a.puissance} W x ${a.heures} h`,
      14,
      y
    );
    y += 5;
  });

  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Résultats du dimensionnement", 14, y);
  y += 6;

  doc.setFont("helvetica", "normal");

    const formaterMilliers = (n: number) => {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const lignes: [string, string][] = [
    ["Consommation quotidienne", `${formaterMilliers(resultats.consommationTotale)} Wh`],
    ["Énergie quotidienne", `${resultats.consommationKWh.toFixed(2)} kWh`],
    ["Puissance PV nécessaire", `${resultats.puissancePV.toFixed(2)} kWc`],
    ["Nombre de panneaux", `${resultats.nombrePanneaux}`],
    ["Puissance PV installée", `${resultats.puissancePVInstallee.toFixed(2)} kWc`],
    ["Puissance onduleur", `${resultats.puissanceOnduleur.toFixed(0)} W`],
    [
      "Capacité batterie",
      `${resultats.capaciteBatterieAh.toFixed(0)} Ah (${resultats.capaciteBatterieKWh.toFixed(2)} kWh)`,
    ],
  ];

  lignes.forEach(([label, valeur]) => {
    doc.text(label, 14, y);
    doc.text(valeur, 140, y);
    y += 6;
  });

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    `Document généré le ${new Date().toLocaleDateString("fr-FR")} avec DigiSolaire Pro`,
    14,
    y
  );

  doc.save(`dimensionnement-${client.nom || "client"}.pdf`);
}