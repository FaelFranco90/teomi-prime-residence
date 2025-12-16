// Centralized contact configuration
export const CONTACT_CONFIG = {
  PHONE_DISPLAY: "(12) 99680-8136",
  PHONE_E164: "+5512996808136", // International format for tel: links
  WHATSAPP_NUMBER: "5512996808136", // For wa.me links
  EMAIL: "contato@teomiimoveis.com.br",
  ADDRESS: "Avenida Independência, 70\nTaubaté - SP"
};

// Helper functions for WhatsApp links
export const getWhatsAppURL = (message?: string) => {
  const baseUrl = `https://wa.me/${CONTACT_CONFIG.WHATSAPP_NUMBER}`;
  return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
};

export const getPhoneURL = () => `tel:${CONTACT_CONFIG.PHONE_E164}`;