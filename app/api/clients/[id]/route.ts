import { NextRequest, NextResponse } from "next/server";
import pool from "../../../../lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const corps = await request.json();
  const { nom, telephone, ville } = corps;

  const resultat = await pool.query(
    "UPDATE clients SET nom = $1, telephone = $2, ville = $3 WHERE id = $4 RETURNING id, nom, telephone, ville",
    [nom, telephone, ville, id]
  );

  return NextResponse.json(resultat.rows[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await pool.query("DELETE FROM clients WHERE id = $1", [id]);

  return NextResponse.json({ succes: true });
}