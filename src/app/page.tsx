'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { questions } from '@/data/questions';
import type { Answer, InputQuestion } from '@/types';

function QuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [position, setPosition] = useState<{ x: number | null, y: number | null }>({ 
    x: null, 
    y: null 
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const validToken = "secret2";

    if (!token || token !== validToken) {
      router.push('/unauthorized');
      return;
    }

    const centerX = (window.innerWidth - 96) / 2;
    const centerY = window.innerHeight / 2 + 20;
    
    setPosition({ 
      x: centerX,
      y: centerY
    });
  }, [searchParams, router]);

  const moveButton = () => {
    const buttonWidth = 96;
    const buttonHeight = 40;
    const padding = 20;

    const maxWidth = window.innerWidth - buttonWidth - padding;
    const maxHeight = window.innerHeight - buttonHeight - padding;
    
    const newX = Math.max(padding, Math.min(Math.random() * maxWidth, maxWidth));
    const newY = Math.max(padding, Math.min(Math.random() * maxHeight, maxHeight));
    
    setPosition({ x: newX, y: newY });
  };

  const handleAnswer = async (answer: string | boolean) => {
    if (answer === '') return; // Don't proceed if input is empty

    const newAnswer: Answer = {
      questionId: questions[currentQuestionIndex].id,
      answer,
      timestamp: new Date().toISOString()
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setInputValue(''); // Clear input after submission

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      try {
        const response = await fetch('/api/saveAnswers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newAnswers),
        });

        if (response.ok) {
          router.push('/thank-you');
        }
      } catch (error) {
        console.error('Failed to save answers:', error);
        alert('Bir şeyler yanlış gitti. Lütfen tekrar deneyin.');
      }
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="min-h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 p-4">
      <div className="text-center w-full max-w-xs mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 animate-bounce">
          {currentQuestion.text}
        </h1>
        
        <div className="flex flex-col items-center gap-4">
          {currentQuestion.type === 'button' ? (
            <>
              <button 
                onClick={() => handleAnswer(true)}
                className="w-24 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                {currentQuestion.options.yes}
              </button>
              
              {position.x !== null && position.y !== null && (
                <button
                  style={{
                    position: 'fixed',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transition: 'all 0.3s ease',
                    width: '96px',
                  }}
                  onMouseEnter={moveButton}
                  onTouchStart={moveButton}
                  className="bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg"
                >
                  {currentQuestion.options.no}
                </button>
              )}
            </>
          ) : (
            <div className="w-full space-y-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={(currentQuestion as InputQuestion).placeholder}
                className="w-full px-4 py-2 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/70 focus:outline-none focus:border-pink-300"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && inputValue.trim()) {
                    handleAnswer(inputValue.trim());
                  }
                }}
              />
              <button
                onClick={() => inputValue.trim() && handleAnswer(inputValue.trim())}
                className="w-full bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg"
              >
                Devam Et →
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 text-white">
          {currentQuestionIndex + 1} / {questions.length}
        </div>
      </div>
    </main>
  );
}

// Wrap the main component with Suspense
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    }>
      <QuestionPage />
    </Suspense>
  );
}
