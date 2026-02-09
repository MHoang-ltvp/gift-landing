"use client";

import { useEffect, useRef, useState } from "react";

interface CardMusicPlayerProps {
    musicUrl: string | undefined;
}

/** Map đường dẫn cũ (tet.mp3) sang file thực tế (tet1.mp3) để thiệp cũ vẫn phát được. */
function resolveMusicSrc(url: string): string {
    if (url === "/music/tet.mp3") return "/music/tet1.mp3";
    return url;
}

/** Phát nhạc nền khi xem thiệp. Trình duyệt thường chặn autoplay → hiện nút "Phát nhạc" để user bấm rồi mới phát. */
export default function CardMusicPlayer({ musicUrl }: CardMusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const resolvedUrl = musicUrl ? resolveMusicSrc(musicUrl) : undefined;

    useEffect(() => {
        if (!resolvedUrl) return;
        setLoadError(false);
        const audio = audioRef.current;
        if (!audio) return;
        audio.load();
        audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
                // Autoplay bị chặn → không làm gì, user sẽ bấm nút "Phát nhạc"
            });
        const onError = () => setLoadError(true);
        audio.addEventListener("error", onError);
        return () => {
            audio.pause();
            audio.removeEventListener("error", onError);
        };
    }, [resolvedUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play()
                .then(() => setIsPlaying(true))
                .catch(() => setLoadError(true));
        }
    };

    if (!resolvedUrl) return null;

    return (
        <>
            <audio ref={audioRef} src={resolvedUrl} loop playsInline />
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "6px",
                }}
            >
                {loadError && (
                    <span
                        style={{
                            fontSize: "12px",
                            color: "#b91c1c",
                            maxWidth: "260px",
                            textAlign: "right",
                        }}
                    >
                        Không tải được nhạc (<code>{resolvedUrl}</code>). Kiểm tra file trong <code>public/music</code>.
                    </span>
                )}
                <button
                    type="button"
                    onClick={togglePlay}
                    style={{
                        padding: "12px 20px",
                        borderRadius: "9999px",
                        border: "none",
                        background: isPlaying ? "#7C3AED" : "#10b981",
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                    }}
                >
                    {isPlaying ? "🔇 Tắt nhạc" : "🎵 Phát nhạc"}
                </button>
            </div>
        </>
    );
}
