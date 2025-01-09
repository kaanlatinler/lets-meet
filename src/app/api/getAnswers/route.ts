import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM answers ORDER BY timestamp DESC'
      );
      
      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Failed to fetch answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
} 