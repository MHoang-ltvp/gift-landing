import type { Metadata } from "next";
import { ToastProvider } from "./components/ToastContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const metadata: Metadata = {
    title: "Gói Ghém - Quà tặng & Phụ kiện",
    description: "Quà tặng cho mọi dịp đặc biệt - Tết, Valentine, 8/3",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="vi">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                        <link
                            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Be+Vietnam+Pro:wght@300;400;500;600&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Allura&family=Pacifico&display=swap"
                            rel="stylesheet"
                        />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body {
                            font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            color: #333;
                            line-height: 1.6;
                        }
                    `
                }} />
            </head>
            <body>
                <ErrorBoundary>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </ErrorBoundary>
            </body>
        </html>
    );
}
