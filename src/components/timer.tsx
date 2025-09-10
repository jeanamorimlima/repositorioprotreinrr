
"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Wind, Bell } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimerEnd: () => void;
  onSkip: () => void;
}

export function Timer({ duration, onTimerEnd, onSkip }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimerEnd();
            return;
        }

        if (isPaused) return;

        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, isPaused, onTimerEnd]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = (timeLeft / duration) * 100;

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg space-y-4">
            <div className='flex items-center gap-2 text-primary'>
                <Wind className="h-5 w-5 animate-pulse" />
                <p className="text-sm font-semibold uppercase">Hora do Descanso</p>
            </div>
            <div className="text-6xl font-mono font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <Progress value={progress} className="w-full h-2 bg-gray-600" />
             <div className="flex w-full gap-2">
                <Button variant="outline" className="w-full bg-gray-600 text-white" onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? 'Continuar' : 'Pausar'}
                </Button>
                <Button variant="secondary" className="w-full" onClick={onSkip}>
                    Pular
                </Button>
            </div>
        </div>
    );
}
