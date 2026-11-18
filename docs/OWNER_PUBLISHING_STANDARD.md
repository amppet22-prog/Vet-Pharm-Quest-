# Permanent owner-editing and publishing rule — Vet Pharm Quest

**Owner directive (2026-11-18): Any content the owner can edit in-game, especially all study and pathology photos, must also offer a clearly labeled owner-controlled Publish Now action. Do not ship new browser-local-only photo editors.**

## Standard user journey
1. **Edit / Add** — allow image file upload or appropriately licensed direct HTTPS image URL, a useful caption, source, and license/permission credit.
2. **Save Draft** — retains in-browser edits, works offline when possible, and clearly labels the draft as local.
3. **Preview** — lets the owner see the correct lesion, species, gross/histology role, and source.
4. **Publish Now** — uses the **existing encrypted GitHub owner-key vault** and the owner's password to unlock a valid GitHub fine-grained token. A password alone cannot authenticate to GitHub.
5. **Cross-device display** — write images to GitHub and an approved manifest, then show approved images to all game visitors and across browsers/devices after refresh.
6. **Edit later / replace** — owner can replace incorrect or mislabeled photos without losing the prior approved manifest entry on failed upload.

## Security and academic integrity
- Never put a password, GitHub token, or client-side password hash into a public repository, script, or JSON.
- Publishing is GitHub-authorized; require owner confirmation, validate upload format, and check source/rights/credit.
- Do not automatically publish images copied from lecture PowerPoints or copyrighted textbook figures without the necessary permissions. A slide reference/link alone is not a hosted photo.
- Differentiate **clinical photo**, **gross specimen**, **histology/H&E**, and **illustration**. Attribute species, tissue, lesion, and stain whenever known. Avoid using a misleading photo of a different condition.
- Always distinguish draft/local image from published/cross-device image; never call a locally saved photo “published.”
- Reuse `window.VPQ_OWNER_KEY_VAULT`; do not create insecure parallel credential stores.
- For each new editor or atlas, review both owner edit controls **and** publishing functionality before declaring work finished.

## Implemented for necropsy/pathology
- `necropsy-owner-publish.js` — owner publisher and protected GitHub API writes.
- `necropsy-owner-published.json` — published manifests for `cases`, `specimens`, and `lectures`.
- `necropsy-differential-lab.js` — all differential cases show owner-published photo and Edit / Publish.
- `necropsy-exam7-studio.js` — all specimen cards show owner-approved photo and Publish Now.
- `pathology-inline-photos.js` + `necropsy-handbook.js` — every lecture topic image slot supports Publish Now.
- Existing browser-local drafts can be uploaded by the publisher without forcing a separate file selection.

## Definition of done
The **Publish Now** button is usable; GitHub owner token validation works; the original browser-local draft is supported; public manifest and image paths update; returning to the lesson works; and a second browser can view the approved photo. Test the complete authenticated workflow in a live browser before claiming final end-to-end verification.

## Multi-photo and text-only corrections (2026-11-18)
- Entries can now keep a **gallery of published photographs** (gross, histology, clinical, illustration), with up to 30 photos per pathology case/lecture image slot/specimen entry. The editor accepts multiple files in one publishing action, with separate image-type labels and optional individual captions.
- Published photographs are retained by default when publishing **text-only corrections**, and remain untouched when adding more images. Only explicit **Remove** selections or **Replace all** can remove published photos from the visible manifest.
- The public manifest supports both legacy single `photo` and newer `photos[]` entries for backward compatibility; current published photos are preserved through format migration.
- Text fields are independently editable and publishable for necropsy specimen cards and differential cases, including gross lesions, histology, clinical history, morphologic diagnosis and pathogenesis where the respective entry supports them.
- Existing local image drafts remain in the editor; selecting an existing draft for upload is optional, not required to publish text.
- Check end-to-end GitHub password-unlock publishing, multi-photo upload, image removal, and cross-device text/image display in a live browser before marking the workflow fully verified.
