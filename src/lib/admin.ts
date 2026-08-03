// Exact-match allowlist, not a substring check — a substring check like
// email.includes('admin@') would let anyone self-grant admin by choosing
// a matching email at signup. Client-side only gates the UI; the same
// allowlist is mirrored in the RLS policies (admin_rls_fix.sql) since
// that's the layer that actually protects the data.
export const ADMIN_EMAILS = ['admin@dreambridge.jp', 'gengen718008+admin@gmail.com'];

export const isAdminEmail = (email?: string | null): boolean =>
  !!email && ADMIN_EMAILS.includes(email);
