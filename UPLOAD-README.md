# d-Alba project — GitHub upload package

## Git LFS upload warning fix
This package excludes the local `.git` folder and removes `public/.gitattributes` so the public assets are no longer newly marked for Git LFS by that file.

Before uploading the assets to the existing GitHub repository:
1. Open the repository on GitHub and go to `public/`.
2. If `public/.gitattributes` exists in the repository, open it, choose **Delete this file**, and commit that deletion first.
3. Upload the contents of this ZIP (not the ZIP file itself) to the repository, keeping the folder structure.
4. Commit the upload.

The existing repository may still contain historical Git LFS objects. This package does not rewrite remote Git history. If GitHub continues to show the same LFS warning after deleting the attributes file, upload using Git LFS from Git Bash instead of the browser.

## Project files
- Keep `public/assets/` in its current location; the app references assets from there.
- `package.json`, `package-lock.json`, and `pnpm-lock.yaml` are retained.
- `.git` is intentionally excluded; do not upload a nested `.git` folder.
