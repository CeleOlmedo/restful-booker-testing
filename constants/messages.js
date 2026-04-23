/**
 * Claves usadas en Gherkin → texto o regex visible en UI.
 * Ajustar regex si cambia el front.
 */
export const MESSAGES = {
  bookingConfirmed: /Booking Confirmed/i,
  bookingInvalidDates: /valid|past|before|invalid|date|check.?in/i,
  bookingOccupiedDates: /not available|unavailable|occupied|conflict|already|booked/i,

  contactSuccess: /Thank you|success|sent|submitted/i,
  invalidEmailHint: /well-formed email|valid email/i,
  invalidEmpty: /required|blank|may not be empty|between/i,

  adminInvalidCredentials: /invalid credentials|bad credentials|do not match/i,
  adminMissingCredentials: /enter username|enter password|required|both|empty|invalid credentials/i,

  roomDuplicate:
    /duplicate|already\s+exists|already\s+in\s+use|unique|taken|conflict|could\s+not|bad\s+request/i,
};