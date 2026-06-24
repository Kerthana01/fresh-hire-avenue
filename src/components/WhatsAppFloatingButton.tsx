import { MessageCircle } from "lucide-react";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbCFVJ7BA1euBgf2UV34";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our WhatsApp Channel"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-white/30 bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#128C7E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6 sm:right-6 sm:px-5"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="whitespace-nowrap">Join WhatsApp Channel</span>
    </a>
  );
}