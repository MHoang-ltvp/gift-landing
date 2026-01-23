"use client";

interface AdminCardProps {
    href: string;
    title: string;
    description: string;
    color: string;
}

export default function AdminCard({ href, title, description, color }: AdminCardProps) {
    return (
        <a
            href={href}
            className="admin-card"
            style={{
                padding: 24,
                border: `2px solid ${color}`,
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
                display: "block",
                backgroundColor: "#fff",
                transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <h2 style={{ margin: "0 0 8px 0", color }}>
                {title}
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
                {description}
            </p>
        </a>
    );
}

