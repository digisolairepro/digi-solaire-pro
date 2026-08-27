import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  const resultat = await pool.query(
    "SELECT id, nom, telephone, ville FROM clients ORDER BY date_creation DESC"
  );

  return NextResponse.json(resultat.rows);
}

export async function POST(request: NextRequest) {
  const corps = await request.json();
  const { nom, telephone, ville } = corps;

  const resultat = await pool.query(
    "INSERT INTO clients (nom, telephone, ville) VALUES ($1, $2, $3) RETURNING id, nom, telephone, ville",
    [nom, telephone, ville]
  );

  return NextResponse.json(resultat.rows[0]);
}