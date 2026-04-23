/**
 * Claves usadas en Gherkin → texto o regex visible en UI.
 * Ajustar regex si cambia el front.
 */
export const MESSAGES = {
  bookingConfirmed: /Booking Confirmed/i,
  bookingInvalidDates: /Booking Denied/i,

  contactSuccess: /Thank you|success|sent|submitted/i,
  invalidEmailHint: /well-formed email|valid email/i,
  invalidEmpty: /required|blank|may not be empty|between/i,

  adminInvalidCredentials: /invalid credentials|bad credentials|do not match/i,
  adminMissingCredentials: /enter username|enter password|required|both|empty|invalid credentials/i,

  roomDuplicate:
    /duplicate|already\s+exists|already\s+in\s+use|unique|taken|conflict|could\s+not|bad\s+request/i,
};