# Universal Player Accounts — isolated feature branch

This work is **not on main** until the owner reviews/merges the pull request. It deliberately does not touch any pathology/lecture scripts, the owner GitHub publishing vault, or the existing request-to-edit workflow.

## Current implementation
- Adds **Player Account** button to the game header.
- Guest access stays available by default (the game is not login-gated).
- Email sign-up, sign-in, sign-out, confirmation, and password-reset requests use Supabase Auth.
- No professor account category: all registered players get the same ordinary player permissions.
- Existing editing/publish-request UI and password-protected owner publishing remain unmodified.
- Until Supabase is configured, the button explains that guest play works and account registration is not yet enabled.
- Existing game saves remain **browser-local**; this change does **not** claim to sync saves across devices.
- No password, service-role key, GitHub owner token, or custom administrator flag is included in frontend config.

## One-time setup (site owner)
1. Create a Supabase project at https://supabase.com/ and open Project Settings > API.
2. Copy the **Project URL** and **publishable / anon key** (never the service_role or secret key) into `player-auth-config.js`.
3. Under Supabase Authentication > URL Configuration, set the public GitHub Pages website as the Site URL and add its exact base URL as an allowed redirect URL. Password resets should be completed through a dedicated in-app reset-password form in a subsequent change; currently the email is requested but the landing page does not provide a password update form.
4. Enable email authentication and review email verification, rate limits and email delivery setup before public launch.
5. Review Supabase Auth configuration to disable any unneeded providers and enforce a reasonable password policy.
6. Test sign-up, confirmation, sign-in, logout, guest mode, and email-reset flow in two clean browsers before publishing.
7. Merge the pull request after the lecture work is settled. Do not manually copy older `index.html` across the other chat's changes: use GitHub merge conflict resolution.

## Security and data reminders
- GitHub Pages is public static hosting: frontend buttons do not create server-side access-control rules.
- A Supabase JWT alone must **not** authorize GitHub writes or grant owner privileges.
- If profiles or cloud saves are added, use Supabase Row Level Security: allow reading/writing only records owned by `auth.uid()`. Never put private lecture material or identifying clinical cases in public static files.
- Player accounts are not the same as owner publishing. Continue using the existing encrypted GitHub owner token vault.
- The existing feedback/edit-access request process remains available to all visitors.
- Account records are handled by Supabase. Provide an account deletion/privacy process before broad public launch.

## Explicitly out of scope for this first increment
- Cloud save migration/sync and per-user progress isolation.
- Server-verified edit approvals or approval dashboards.
- Password-reset completion UI.
- Automatic import of existing browser-local saves into an authenticated account.

## QA checklist
- [ ] Guest can open all rooms and does not see login enforcement.
- [ ] Sign-in button does not cover HUD controls on narrow screens.
- [ ] A new user can sign up and confirm email.
- [ ] Verified user can log in and out without resetting guest progress.
- [ ] Password reset request sends an email; completing the reset needs the follow-up reset form.
- [ ] Owner's existing Publish Now path remains functional.
- [ ] Existing Request Edit Access path still works.
- [ ] A second browser sees the account session only after signing in (progress is still local).
