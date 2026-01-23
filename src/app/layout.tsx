import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gift Landing",
    description: "Website bán quà tặng + thiệp QR",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <body>{children}</body>
        </html>
    );
}
