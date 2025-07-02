/**
 * This file is part of the SatTrack project, submitted for academic purposes only.
 * It is intended solely for evaluation in an educational context.
 */

// ==========================
// 🤖 AI Chat Placeholder
// ==========================

/**
 * Temporary placeholder UI for the AI Assistant.
 * In the future, this will integrate natural language queries about satellites.
 */
export function AIChatComponent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full justify-center items-center text-white p-4">
      {/* Status Message */}
      <div className="text-lg mb-2">🤖 AI Operator Coming soon</div>

      {/* Close Button */}
      <button
        className="!bg-teal-600/40 border border-teal-400 rounded p-2 mt-4"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
