/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

import { Toaster } from "react-hot-toast";

// ==========================
// 🔔 CustomToaster Component
// ==========================

/**
 * Global toast UI configuration for consistent feedback styling.
 * Positioned at the top-center with a blurred glassy background.
 */
export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "rgba(17, 24, 39, 0.85)",             // dark glass background
          color: "#e5e7eb",                                  // Tailwind gray-200
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(2px)",                      // subtle blur
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "12px 16px",
          borderRadius: "12px",
          marginTop: "",                                     // placeholder for vertical offset
        },
        duration: 3000,
        success: {
          iconTheme: {
            primary: "#34d399",                             // green-400
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#f87171",                             // red-400
            secondary: "white",
          },
        },
      }}
    />
  );
}
