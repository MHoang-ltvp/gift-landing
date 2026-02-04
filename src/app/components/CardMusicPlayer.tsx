"use client";

import { useEffect, useRef } from "react";

interface CardMusicPlayerProps {
    musicUrl: string | undefined;
}

/** Phát nhạc nền khi xem thiệp (autoplay, loop). Một số trình duyệt chặn autoplay cho đến khi user tương tác. */
export default function CardMusicPlayer({ musicUrl }: CardMusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!musicUrl) return;
        const audio = audioRef.current;
        if (!audio) return;
        audio.load();
        audio.play().catch(() => {
            // Autoplay có thể bị chặn trên một số trình duyệt
        });
        return () => {
            audio.pause();
        };
    }, [musicUrl]);

    if (!musicUrl) return null;

    return (
        <>
            <audio ref={audioRef} src={musicUrl} loop playsInline />
        </>
    );
}
