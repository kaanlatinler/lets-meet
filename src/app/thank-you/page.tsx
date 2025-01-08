'use client';

import { useEffect, useState } from 'react';

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://www.instagram.com/kaanlatinler';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-blue-500 p-4">
      <div className="text-center w-full max-w-xs mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-4">
          Teşekkürler! 🎉
        </h1>
        <p className="text-xl text-white">
          Cevapların için teşekkür ederim. Yakında görüşmek üzere! 💫
        </p>
        <div className="animate-bounce text-4xl">
          ❤️
        </div>
        <p className="text-white text-lg">
          {countdown} saniye sonra Instagram&apos;a yönlendiriliyorsunuz...
        </p>
      </div>
    </main>
  );
} 