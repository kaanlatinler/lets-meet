'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { questions } from '@/data/questions';

interface Answer {
  id: number;
  question_id: number;
  answer: string;
  timestamp: string;
}

interface GroupedAnswers {
  timestamp: string;
  answers: Answer[];
}

function AnswersDisplay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [groupedAnswers, setGroupedAnswers] = useState<GroupedAnswers[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const validToken = "showanswers";

    if (!token || token !== validToken) {
      router.push('/unauthorized');
      return;
    }

    fetchAnswers();
  }, [searchParams, router]);

  const fetchAnswers = async () => {
    try {
      const response = await fetch('/api/getAnswers');
      if (response.ok) {
        const data: Answer[] = await response.json();
        
        // Group answers by timestamp (first answer's timestamp of each set)
        const grouped = data.reduce((acc: { [key: string]: Answer[] }, answer) => {
          const date = new Date(answer.timestamp).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(answer);
          return acc;
        }, {});

        // Convert to array and sort by date (newest first)
        const groupedArray = Object.entries(grouped).map(([timestamp, answers]) => ({
          timestamp,
          answers: answers.sort((a, b) => a.question_id - b.question_id)
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setGroupedAnswers(groupedArray);
      }
    } catch (error) {
      console.error('Failed to fetch answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionText = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.text : 'Bilinmeyen Soru';
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const currentAnswerSet = groupedAnswers[currentPage];

  return (
    <main className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-600">
          Cevaplar 💝
        </h1>

        {groupedAnswers.length > 0 ? (
          <>
            <div className="text-center mb-6 text-gray-600">
              {formatDate(currentAnswerSet.timestamp)}
            </div>
            
            <div className="space-y-6 mb-8">
              {currentAnswerSet.answers.map((answer) => (
                <div 
                  key={answer.id} 
                  className="bg-purple-50 rounded-lg p-4 shadow transition hover:shadow-md"
                >
                  <div className="flex flex-col space-y-2">
                    <h2 className="font-semibold text-purple-700">
                      {getQuestionText(answer.question_id)}
                    </h2>
                    <p className="text-gray-700">
                      Cevap: {answer.answer === '1' ? 'Evet' : answer.answer === '0' ? 'Hayır' : answer.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition"
              >
                ← Önceki
              </button>
              <span className="text-purple-600 font-medium">
                {currentPage + 1} / {groupedAnswers.length}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(groupedAnswers.length - 1, prev + 1))}
                disabled={currentPage === groupedAnswers.length - 1}
                className="px-4 py-2 rounded-lg bg-purple-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition"
              >
                Sonraki →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">
            Henüz hiç cevap yok.
          </div>
        )}
      </div>
    </main>
  );
}

export default function AnswersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    }>
      <AnswersDisplay />
    </Suspense>
  );
} 