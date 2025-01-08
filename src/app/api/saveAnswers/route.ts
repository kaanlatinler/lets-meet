import { NextResponse } from 'next/server';
import type { Answer } from '@/types';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const answers: Answer[] = await request.json();
    
    const connection = await pool.getConnection();
    
    try {
      // Save each answer to the database
      for (const answer of answers) {
        await connection.execute(
          'INSERT INTO answers (question_id, answer, timestamp) VALUES (?, ?, ?)',
          [answer.questionId, answer.answer ? 1 : 0, answer.timestamp]
        );
      }
      
      return NextResponse.json({ success: true });
    } finally {
      connection.release(); // Always release the connection
    }
  } catch (error) {
    console.error('Failed to save answers:', error);
    return NextResponse.json(
      { error: 'Failed to save answers' },
      { status: 500 }
    );
  }
} 