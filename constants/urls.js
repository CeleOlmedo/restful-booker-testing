const BASE = "https://automationintesting.online";

export const URLS = {
  base: `${BASE}/`,
  home: `${BASE}/`,
  rooms: `${BASE}/#rooms`,
  booking: `${BASE}/#booking`,
  contact: `${BASE}/#contact`,
  admin: `${BASE}/admin`,
};

/** URL estable del flujo de reserva (Next.js demo). */
export function reservationUrl(roomId, checkinIso, checkoutIso) {
  return `${BASE}/reservation/${roomId}?checkin=${checkinIso}&checkout=${checkoutIso}`;
}