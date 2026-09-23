import "@testing-library/jest-dom/vitest";

// src/lib/supabase.ts creates the client at module scope, so importing anything
// that reaches it throws unless these are set. Unit tests never hit the network;
// integration/security tests build their own clients from .env.test.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= "https://placeholder.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= "placeholder-anon-key";
