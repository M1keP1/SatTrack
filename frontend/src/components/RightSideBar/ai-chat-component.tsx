export function AIChatComponent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full justify-center items-center text-white p-4">
      <div className="text-lg mb-2">🤖 AI Agent Coming soon </div>
      <button
        className="!bg-teal-600/40 border border-teal-400 rounded p-2 mt-4"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}
