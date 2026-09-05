import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";
import { getUtilisateurIdConnecte } from "../../../../lib/auth";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  const resultat = await pool.query(
    "SELECT * FROM dimensionnements WHERE id = $1 AND utilisateur_id = $2",
    [id, utilisateurId]
  );

  if (resultat.rows.length === 0) {
    return NextResponse.json({ erreur: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json(versDimensionnement(resultat.rows[0]));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;
  const d = await request.json();

  const resultat = await pool.query(
    `UPDATE dimensionnements SET
      date_creation = now(),
      nom_projet = $1, client_id = $2, ville = $3, type_installation = $4, appareils = $5,
      puissance_panneau = $6, autonomie = $7, tension_batterie = $8, dod = $9, rendement_batterie = $10,
      consommation_totale = $11, consommation_kwh = $12, puissance_pv = $13, nombre_panneaux = $14,
      puissance_pv_installee = $15, puissance_maximale = $16, puissance_onduleur = $17,
      energie_autonomie = $18, capacite_batterie_kwh = $19, capacite_batterie_ah = $20
    WHERE id = $21 AND utilisateur_id = $22
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
      id,
      utilisateurId,
    ]
  );

  return NextResponse.json(versDimensionnement(resultat.rows[0]));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const utilisateurId = await getUtilisateurIdConnecte();

  if (!utilisateurId) {
    return NextResponse.json({ erreur: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  await pool.query(
    "DELETE FROM dimensionnements WHERE id = $1 AND utilisateur_id = $2",
    [id, utilisateurId]
  );

  return NextResponse.json({ succes: true });
}