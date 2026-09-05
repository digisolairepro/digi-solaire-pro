import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../lib/auth";

function versDimensionnement(ligne: any) {
  return {
    id: ligne.id,
    dateCreation: ligne.date_creation,
    nomProjet: ligne.nom_projet,
    clientId: ligne.client_id,
    ville: ligne.ville,
    typeInstallation: ligne.type_installation,
    appareils: ligne.appareils,
    puissancePanneau: Number(ligne.puissance_panneau),
    autonomie: Number(ligne.autonomie),
    tensionBatterie: Number(ligne.tension_batterie),
    dod: Number(ligne.dod),
    rendementBatterie: Number(ligne.rendement_batterie),
    consommationTotale: Number(ligne.consommation_totale),
    consommationKWh: Number(ligne.consommation_kwh),
    puissancePV: Number(ligne.puissance_pv),
    nombrePanneaux: Number(ligne.nombre_panneaux),
    puissancePVInstallee: Number(ligne.puissance_pv_installee),
    puissanceMaximale: Number(ligne.puissance_maximale),
    puissanceOnduleur: Number(ligne.puissance_onduleur),
    energieAutonomie: Number(ligne.energie_autonomie),
    capaciteBatterieKWh: Number(ligne.capacite_batterie_kwh),
    capaciteBatterieAh: Number(ligne.capacite_batterie_ah),
  };
}

export async function GET() {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const resultat = await pool.query(
    "SELECT * FROM dimensionnements WHERE utilisateur_id = $1 ORDER BY date_creation DESC",
    [utilisateurId]
  );

  return NextResponse.json(resultat.rows.map(versDimensionnement));
}

export async function POST(request: NextRequest) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const d = await request.json();

  const resultat = await pool.query(
    `INSERT INTO dimensionnements (
      nom_projet, client_id, ville, type_installation, appareils,
      puissance_panneau, autonomie, tension_batterie, dod, rendement_batterie,
      consommation_totale, consommation_kwh, puissance_pv, nombre_panneaux,
      puissance_pv_installee, puissance_maximale, puissance_onduleur,
      energie_autonomie, capacite_batterie_kwh, capacite_batterie_ah, utilisateur_id
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
    RETURNING *`,
    [
      d.nomProjet,
      d.clientId,
      d.ville,
      d.typeInstallation,
      JSON.stringify(d.appareils),
      d.puissancePanneau,
      d.autonomie,
      d.tensionBatterie,
      d.dod,
      d.rendementBatterie,
      d.consommationTotale,
      d.consommationKWh,
      d.puissancePV,
      d.nombrePanneaux,
      d.puissancePVInstallee,
      d.puissanceMaximale,
      d.puissanceOnduleur,
      d.energieAutonomie,
      d.capaciteBatterieKWh,
      d.capaciteBatterieAh,
      utilisateurId,
    ]
  );

  return NextResponse.json(versDimensionnement(resultat.rows[0]));
}