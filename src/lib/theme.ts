// Design System - Màu đỏ nhạt làm chủ đạo
export const theme = {
    colors: {
        // Primary colors - Theo src/html
        primary: "#DC2626", // Đỏ chính (#DC2626)
        primaryLight: "#EF4444", // Đỏ sáng (#EF4444)
        primaryLighter: "#ff8a8a", // Đỏ nhạt
        primaryDark: "#B91C1C", // Đỏ đậm hơn
        primaryDarker: "#991B1B", // Đỏ rất đậm
        
        // Background colors
        bgPrimary: "#fff5f5", // Nền đỏ nhạt rất nhạt
        bgSecondary: "#ffe5e5", // Nền đỏ nhạt nhạt
        bgTertiary: "#ffcccc", // Nền đỏ nhạt
        bgWhite: "#ffffff",
        bgGray: "#f9f9f9",
        
        // Text colors
        textPrimary: "#333333",
        textSecondary: "#666666",
        textTertiary: "#999999",
        textWhite: "#ffffff",
        
        // Border colors
        borderLight: "#ffe0e0",
        borderMedium: "#ffcccc",
        borderDark: "#ffb4b4",
        
        // Status colors
        success: "#4caf50",
        error: "#f44336",
        warning: "#ff9800",
    },
    
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        xxxl: "60px",
    },
    
    borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
    },
    
    shadows: {
        sm: "0 2px 4px rgba(220, 38, 38, 0.1)",
        md: "0 4px 12px rgba(220, 38, 38, 0.15)",
        lg: "0 8px 24px rgba(220, 38, 38, 0.2)",
        xl: "0 12px 32px rgba(220, 38, 38, 0.3)",
    },
    
    typography: {
        fontFamily: {
            display: "'Playfair Display', serif",
            body: "'Be Vietnam Pro', sans-serif",
        },
        fontSize: {
            xs: "12px",
            sm: "14px",
            md: "16px",
            lg: "18px",
            xl: "20px",
            "2xl": "24px",
            "3xl": "28px",
            "4xl": "32px",
            "5xl": "36px",
            "6xl": "48px",
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
        },
    },
    
    transitions: {
        fast: "0.15s ease",
        normal: "0.2s ease",
        slow: "0.3s ease",
    },
};

