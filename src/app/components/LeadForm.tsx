"use client";

import { useState } from "react";

export default function LeadForm() {
    const [loading, setLoading] = useState(false);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);

                try {
                    const fd = new FormData(e.currentTarget);
                    const body = Object.fromEntries(fd.entries());

                    const res = await fetch("/api/leads", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });

                    if (res.ok) {
                        alert("Đã gửi thông tin!");
                        e.currentTarget.reset();
                    } else {
                        const data = await res.json().catch(() => ({}));
                        alert(data.error || "Gửi thất bại");
                    }
                } finally {
                    setLoading(false);
                }
            }}
            style={{ marginTop: 16 }}
        >
            <input name="name" placeholder="Tên" style={{ padding: 8, width: 240 }} />
            <input name="phone" placeholder="SĐT" style={{ padding: 8, width: 240, marginLeft: 8 }} />
            <input name="email" placeholder="Email" style={{ padding: 8, width: 240, marginLeft: 8 }} />

            <div style={{ marginTop: 8 }}>
                <select name="occasion" style={{ padding: 8 }}>
                    <option value="tet">Tết</option>
                    <option value="valentine">Valentine</option>
                    <option value="8-3">8/3</option>
                </select>
            </div>

            <button disabled={loading} style={{ padding: "8px 12px", marginTop: 8 }}>
                {loading ? "Đang gửi..." : "Để lại thông tin"}
            </button>
        </form>
    );
}
