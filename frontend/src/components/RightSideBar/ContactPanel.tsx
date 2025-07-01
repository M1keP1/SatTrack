import { SlidePanel } from "@/components/RightSideBar/slidepanel";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

type ContactPanelProps = {
  onClose: () => void;
  onOpenEffect?: () => void;
};

export default function ContactPanel({ onClose, onOpenEffect }: ContactPanelProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Student",
    subject: "Request Subdomain",
    message: "",
  });

  useEffect(() => {
    onOpenEffect?.();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("https://formspree.io/f/xyzjoalq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast("📬 Message signaled successfully!");
      onClose();
    } else {
      toast("❌ Failed to send message.");
    }
  } catch (error) {
    toast.error("❌ Network error.");
  }
};

  return (
    <SlidePanel isOpen={true} onClose={onClose} title="📬 Contact Me" position="center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm text-white font-mono [text-shadow:none]"
      >
        <div className="space-y-1">
          <span className="text-xs">Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-black/30 border border-teal-500/30 rounded px-3 py-1"
            required
          />
        </div>

        <div className="space-y-1">
          <span className="text-xs">Email</span>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-black/30 border border-teal-500/30 rounded px-3 py-1"
            required
          />
        </div>

        <div className="space-y-1">
          <span className="text-xs">Category</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-black/30 border border-teal-500/30 rounded px-3 py-1"
          >
            <option>Student</option>
            <option>Commercial</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <span className="text-xs">Reason</span>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-black/30 border border-teal-500/30 rounded px-3 py-1"
          >
            <option>Request Subdomain</option>
            <option>Use as Widget</option>
            <option>Hire Me 🥰</option>
            <option>Feedback / Bug</option>
            <option>Other</option>
          </select>
        </div>

        <div className="space-y-1">
          <span className="text-xs">Message</span>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full bg-black/30 border border-teal-500/30 rounded px-3 py-2 resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full !bg-teal-600/30 hover:bg-teal-600/50 transition-colors border border-teal-400/30 rounded py-2 font-bold"
        >
          Submit 🚀
        </button>
      </form>
    </SlidePanel>
  );
}
