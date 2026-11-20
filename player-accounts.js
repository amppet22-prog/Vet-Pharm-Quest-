/* Universal, optional player accounts for Vet Pharm Quest.
 * All registered users have identical game permissions.
 * This file NEVER grants owner editing/publishing rights or alters the GitHub key vault.
 * Guest play remains available. Cloud backup is offered separately and only after login.
 */
(function () {
  "use strict";
  const cfg = window.VPQ_AUTH_CONFIG || {};
  const enabled = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.supabaseUrl || "") &&
    typeof cfg.supabaseAnonKey === "string" && cfg.supabaseAnonKey.length > 20 &&
    !!window.supabase?.createClient;
  let client = null, session = null, busy = false, recoveryMode = false;
  if (enabled) {
    client = window.supabase.createClient(cfg.supabaseUrl.replace(/\/$/, ""), cfg.supabaseAnonKey, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });
  }

  const css = document.createElement("style");
  css.textContent = `
    #vpqAccountBtn{white-space:nowrap}
    .vpq-account-backdrop{position:fixed;inset:0;z-index:100000;background:#1c2e4e9e;display:flex;align-items:center;justify-content:center;padding:15px}
    .vpq-account-panel{width:min(450px,100%);max-height:92vh;overflow:auto;background:#fff;border:3px solid #d6dcf5;border-radius:21px;padding:23px;box-shadow:0 15px 65px #1c2e4e55;color:#334b6b}
    .vpq-account-panel h2{margin:0;font-size:22px;color:#53629d}
    .vpq-account-panel p{font-size:13px;line-height:1.5}
    .vpq-account-panel label{display:block;margin:11px 0 4px;font-size:12px;font-weight:800}
    .vpq-account-panel input{width:100%;box-sizing:border-box;padding:11px;border:2px solid #cad8e9;border-radius:10px;font:inherit}
    .vpq-account-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}
    .vpq-account-actions button{flex:1}
    .vpq-account-panel .vpq-account-primary{background:#6162b1;color:white;border-color:#6162b1}
    .vpq-account-message{font-size:12px;margin:12px 0;padding:9px;border-radius:9px;background:#f1f5ff;white-space:pre-wrap}
    .vpq-account-message[hidden]{display:none}
    .vpq-account-panel button:disabled{opacity:.55;cursor:wait}
    .vpq-account-panel [hidden]{display:none!important}
  `;
  document.head.appendChild(css);

  const header = document.querySelector(".hud") || document.querySelector("header");
  if (!header) return;
  const btn = document.createElement("button");
  btn.id = "vpqAccountBtn";
  btn.type = "button";
  btn.className = "mini";
  btn.textContent = "👤 Sign In / Guest";
  btn.setAttribute("aria-label", "Open player account options");
  header.appendChild(btn);
  function updateButton() {
    const name = session?.user?.email?.split("@")[0];
    btn.textContent = name ? "👤 " + name.slice(0, 18) : "👤 Sign In / Guest";
    btn.title = session?.user?.email || "Play as guest or sign in";
  }
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,
    char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  function openModal() {
    if (document.getElementById("vpqAccountOverlay")) return;
    const overlay = document.createElement("div");
    overlay.className = "vpq-account-backdrop";
    overlay.id = "vpqAccountOverlay";
    overlay.innerHTML = `
      <section class="vpq-account-panel" role="dialog" aria-modal="true" aria-labelledby="vpqAccountTitle">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <h2 id="vpqAccountTitle">🐾 Player Account</h2>
          <button type="button" id="vpqAccountClose" aria-label="Close account dialog">✕</button>
        </div>
        <p id="vpqAccountIntro"></p>
        <form id="vpqAccountForm">
          <label for="vpqAccountEmail">Email address</label>
          <input id="vpqAccountEmail" type="email" autocomplete="email" required placeholder="you@example.edu">
          <label for="vpqAccountPassword">Password</label>
          <input id="vpqAccountPassword" type="password" autocomplete="current-password" minlength="12" required>
          <div class="vpq-account-actions">
            <button id="vpqAccountLogin" class="vpq-account-primary" type="submit">Sign In</button>
            <button id="vpqAccountSignup" type="button">Create Account</button>
          </div>
        </form>
        <form id="vpqAccountRecoveryForm" hidden><label for="vpqAccountNewPassword">New password</label><input id="vpqAccountNewPassword" type="password" autocomplete="new-password" minlength="12" required><label for="vpqAccountConfirmPassword">Confirm new password</label><input id="vpqAccountConfirmPassword" type="password" autocomplete="new-password" minlength="12" required><button class="vpq-account-primary" type="submit">Update Password</button></form>
        <div id="vpqAccountSignedIn" hidden>
          <p>Signed in as <strong id="vpqAccountAddress"></strong></p>
          <button id="vpqAccountLogout" type="button">Sign Out</button>
        </div>
        <div class="vpq-account-actions">
          <button id="vpqAccountReset" type="button">Forgot Password?</button>
          <button id="vpqAccountGuest" type="button">Continue as Guest</button>
        </div>
        <div id="vpqAccountMessage" class="vpq-account-message" role="status" aria-live="polite" hidden></div>
        <p style="font-size:11px;color:#6d7995">Guest progress remains saved on this browser. Signed-in players can opt into Cloud Save separately. Signing in never automatically replaces local progress. Edit/publish requests and owner publishing are unchanged.</p>
      </section>`;
    document.body.appendChild(overlay);
    const el = id => overlay.querySelector("#" + id);
    el("vpqAccountEmail").value = window.VPQ_PLAYER_ACCOUNT_LAST_EMAIL || "";
    const message = (txt, error = false) => {
      el("vpqAccountMessage").hidden = !txt;
      el("vpqAccountMessage").textContent = txt || "";
      el("vpqAccountMessage").style.background = error ? "#fff0f0" : "#f1f5ff";
    };
    const show = () => {
      const signedIn = !!session?.user;
      el("vpqAccountForm").hidden = signedIn || !enabled || recoveryMode;
      el("vpqAccountRecoveryForm").hidden = !enabled || !recoveryMode;
      el("vpqAccountSignedIn").hidden = !signedIn || recoveryMode;
      el("vpqAccountReset").hidden = signedIn || !enabled || recoveryMode;
      el("vpqAccountAddress").textContent = signedIn ? session.user.email : "";
      el("vpqAccountIntro").textContent = !enabled
        ? "Guest mode is available. Secure account registration will be enabled when the site owner configures the authentication service."
        : recoveryMode ? "Enter a new password for this account. Your game saves and owner publishing credentials will not be changed." : signedIn ? "Your player account is active. All accounts have the same game permissions." :
        "Create a free account or continue as a guest. Everyone can request edit access through the existing game controls.";
    };
    async function run(action) {
      if (!client || busy) return;
      const email = el("vpqAccountEmail").value.trim();
      window.VPQ_PLAYER_ACCOUNT_LAST_EMAIL = email;
      const password = el("vpqAccountPassword").value;
      if (!el("vpqAccountEmail").reportValidity()) return;
      if (action !== "reset" && !el("vpqAccountPassword").reportValidity()) return;
      busy = true;
      for (const b of overlay.querySelectorAll("button")) b.disabled = true;
      message("Working…");
      try {
        let result;
        if (action === "signup") {
          result = await client.auth.signUp({email, password, options:{emailRedirectTo:location.origin + location.pathname}});
        } else if (action === "reset") {
          result = await client.auth.resetPasswordForEmail(email, {redirectTo:location.origin + location.pathname});
        } else {
          result = await client.auth.signInWithPassword({email, password});
        }
        if (result.error) throw result.error;
        if (action === "signup") message(result.data?.session ? "Account created and signed in." : "Check your email for a confirmation link before signing in. If you do not see it, check spam/junk.");
        if (action === "reset") message("If this address is registered, a password-reset email will be sent.");
        if (action === "login") message("Signed in successfully.");
        if (result.data?.session) session = result.data.session;
        updateButton(); show();
      } catch (err) {
        message(err?.message || "Account request failed. Please try again.", true);
      } finally {
        busy = false;
        for (const b of overlay.querySelectorAll("button")) b.disabled = false;
      }
    }
    el("vpqAccountForm").addEventListener("submit", event => {event.preventDefault();run("login");});
    el("vpqAccountRecoveryForm").addEventListener("submit", async event => {
      event.preventDefault();
      const password = el("vpqAccountNewPassword").value;
      if (password !== el("vpqAccountConfirmPassword").value) {message("The two passwords do not match.", true);return;}
      if (!client || busy) return;
      busy = true;
      try {
        const {error} = await client.auth.updateUser({password});
        if (error) throw error;
        recoveryMode = false;show();message("Password updated. You are signed in.");
      } catch (error) {message(error?.message || "Could not update password.", true);}
      finally {busy = false;}
    });
    el("vpqAccountSignup").addEventListener("click", () => run("signup"));
    el("vpqAccountReset").addEventListener("click", () => run("reset"));
    el("vpqAccountLogout").addEventListener("click", async () => {
      if (!client || busy) return;
      busy = true;
      try { const {error} = await client.auth.signOut(); if (error) throw error; session = null; updateButton();show();message("Signed out. Guest play remains available."); }
      catch (error) {message(error?.message || "Could not sign out.",true);}
      finally {busy = false;}
    });
    const close = () => {overlay.remove();btn.focus();};
    el("vpqAccountClose").addEventListener("click",close);
    el("vpqAccountGuest").addEventListener("click",close);
    overlay.addEventListener("click", e => {if (e.target === overlay) close();});
    overlay.addEventListener("keydown", e => {if (e.key === "Escape")close();});
    show();
    el(enabled && !session?.user ? "vpqAccountEmail" : "vpqAccountClose").focus();
  }
  btn.addEventListener("click", openModal);
  if (client) {
    client.auth.getSession().then(({data,error}) => {
      if (!error) {session = data.session; updateButton();}
    }).catch(() => {});
    client.auth.onAuthStateChange((event,newSession) => {
      const previousId = session?.user?.id || null;
      session = newSession;
      if(event === "PASSWORD_RECOVERY") recoveryMode = true;
      if(event === "SIGNED_OUT") recoveryMode = false;
      updateButton();
      // Cloud save listeners do not need token refresh events.
      if(previousId !== (newSession?.user?.id || null)) {
        window.dispatchEvent(new CustomEvent("vpq-player-auth-change",{detail:{userId:newSession?.user?.id || null}}));
      }
      const modal = document.getElementById("vpqAccountOverlay");
      if (modal && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "SIGNED_OUT")) {
        modal.remove();openModal();
      } else if(event === "PASSWORD_RECOVERY") openModal();
    });
  }
  window.VPQ_PLAYER_ACCOUNT = Object.freeze({
    configured: enabled,
    getUser: () => session?.user || null,
    getClient: () => client,
    open: openModal
  });
})();
