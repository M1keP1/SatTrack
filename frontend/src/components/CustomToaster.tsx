// components/CustomToaster.tsx
import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "rgba(17, 24, 39, 0.85)", // dark translucent
          color: "#e5e7eb",                     // tailwind gray-200
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(2px)",
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "12px",
        },
        duration: 3000,
        success: {
          iconTheme: {
            primary: "#34d399", // green
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#f87171", // red
            secondary: "white",
          },
        },
      }}
    />
  );
}
