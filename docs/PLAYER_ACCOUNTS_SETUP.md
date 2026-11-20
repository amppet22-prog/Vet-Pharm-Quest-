# Universal Player Accounts — isolated feature branch

This work is **not on main** until the owner reviews/merges the pull request. It deliberately does not touch any pathology/lecture scripts, the owner GitHub publishing vault, or the existing request-to-edit workflow.

## Current implementation
- Adds **Player Account** button to the game header.
- Guest access stays available by default (the game is not login-gated).
- Email sign-up, sign-in, sign-out, confirmation, and password-reset requests use Supabase Auth.
- No professor account category: all registered players get the same ordinary player permissions.
- Existing editing/publish-request UI and password-protected owner publishing remain unmodified.
- Until Supabase is configured, the button explains that guest play works and account registration is not yet enabled.
- The existing browser save remains active. A logged-in player can explicitly upload their clinic progress to an account cloud backup, or restore a prior cloud backup. Once activated, subsequent clinic-state saves are backed up after a short debounce. The existing Save Center export/import still works.
- On cloud restore, the previous supported modules are downloaded to a timestamped recovery JSON and a browser-local recovery snapshot is created before replacement. The cloud-save panel includes an **Undo last restore** button when a local recovery snapshot is available. Legacy clinic-only cloud backups do not delete newer independent module progress. Browser-local game content edits are not sent to the cloud.
- A background update check detects a new deployed `index.html` version about every five minutes and offers **Save & Refresh**, without forcing a reload. Approved public lesson/photo changes are shared through GitHub Pages and the publishing manifests; local owner drafts are never globally published automatically.
- Game-wide progress backup now includes the main clinic, Arcade rewards/case history, Exam setup, recent matches, Bug Battle preferences, lecture selections, shared learning progress, mastery history, One Health practice history, inpatient practice, pathogen lab results and necropsy flashcard practice. Owner drafts, unpublished photos, edit records and encrypted publishing credentials remain local-only.
- Automatic cloud backup checks for saved state changes about every ten seconds while the game is open and responds sooner to major clinic/Arcade progress events. Cloud writes may still fail when offline or if the browser closes immediately after a change; local saves remain authoritative until an upload succeeds.
- No password, service-role key, GitHub owner token, or custom administrator flag is included in frontend config.

## One-time setup (site owner)
1. Create a Supabase project at https://supabase.com/ and open Project Settings > API.
2. Copy the **Project URL** and **publishable / anon key** (never the service_role or secret key) into `player-auth-config.js`.
3. Under Supabase Authentication > URL Configuration, set the public GitHub Pages website as the Site URL and add its exact base URL as an allowed redirect URL. Password reset completion is handled by the in-app new-password form when Supabase delivers a PASSWORD_RECOVERY event. Configure its allowed redirect URL correctly.
4. Enable email authentication and review email verification, rate limits and email delivery setup before public launch.
5. Review Supabase Auth configuration to disable any unneeded providers and enforce a reasonable password policy.
6. Run the SQL in `docs/PLAYER_SAVES_SUPABASE.sql` using the Supabase SQL editor. This creates the cloud-save table and per-user Row Level Security policies.
7. Test sign-up, confirmation, sign-in, logout, password-reset completion, upload, restore, a second account, and guest mode in two clean browsers before publishing.
8. Merge the pull request after the lecture work is settled. Do not manually copy older `index.html` across the other chat's changes: use GitHub merge conflict resolution.

## Security and data reminders
- GitHub Pages is public static hosting: frontend buttons do not create server-side access-control rules.
- A Supabase JWT alone must **not** authorize GitHub writes or grant owner privileges.
- If profiles or cloud saves are added, use Supabase Row Level Security: allow reading/writing only records owned by `auth.uid()`. Never put private lecture material or identifying clinical cases in public static files.
- Player accounts are not the same as owner publishing. Continue using the existing encrypted GitHub owner token vault.
- The existing feedback/edit-access request process remains available to all visitors.
- Account records are handled by Supabase. Provide an account deletion/privacy process before broad public launch.

## Explicitly out of scope for this first increment
- Complete independent account/guest save isolation on shared devices remains a later step; browser-local game keys are currently shared by all visitors using that same browser profile. The cloud sync detects other-account and newer-cloud-save scenarios and refuses automatic overwrite, but this is not a full privacy boundary on a shared computer.
- Any future new study module that uses a new localStorage key must be added explicitly to the save key manifest and tested. Large unpublished photos and owner drafts must never be included.
- Server-verified edit approvals or approval dashboards.
- Production password recovery email delivery must still be configured and verified in Supabase.
- Automatic import of existing browser-local saves into an authenticated account; the player must choose an initial upload or restore, to prevent silent replacement.

## QA checklist
- [ ] Guest can open all rooms and does not see login enforcement.
- [ ] Sign-in button does not cover HUD controls on narrow screens.
- [ ] A new user can sign up and confirm email.
- [ ] Verified user can log in and out without resetting guest progress.
- [ ] Password reset sends an email and the recovery link opens the in-app new-password form.
- [ ] Owner's existing Publish Now path remains functional.
- [ ] Existing Request Edit Access path still works.
- [ ] An account's clinic and Arcade XP, coins, completed cases, lecture selections and practice history reappear after restoring from another browser.
- [ ] A logout and different account login do not silently overwrite either player's cloud copy.
- [ ] A fresh visit to the main game or standalone Arcade does not pop the cloud panel until clicked.
- [ ] Test offline save, browser refresh, rapid progress changes, restore undo, and cloud revision conflict warning.
- [ ] Verify owner drafts, local photo data, GitHub token vault and content edits are absent from all cloud payloads.

## Before publishing broadly
- **Do not confuse cloud backup with globally published educational content.** Each player's clinic progress is private under Row Level Security. Approved lecture/content changes reach every account after the GitHub Pages deployment, and users can refresh when notified. Publishing still requires the owner's existing GitHub-authorized Publish Now flow.
- The account's password is independent of the owner's publishing key password.
- Validate SQL permissions as two different test users; neither may read or overwrite the other's cloud save.
- Validate no data loss when the browser goes offline after play: local saves work even when cloud requests fail. Cloud backup does not guarantee completion when a tab closes immediately after a save; the Save Center's downloadable backup is still recommended.
- Validate reset behavior: a reset of local game progress while auto-backup is enabled will also update the cloud copy. Warn users and add a cloud snapshot/history feature before releasing destructive resets widely.
