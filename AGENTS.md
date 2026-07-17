# Agent guidelines

## Writing and code style

- Write Markdown prose with one sentence per line so git diffs stay focused and readable.
- Never use inline type imports.
- Prefer file-level JSDoc `@import` declarations at the top of JavaScript files when types are needed.
- Use `npm run test:tsc` to check JavaScript types; this CSS package does not generate TypeScript declarations.

## Source and generated files

- Make stylesheet changes in `src/` and regenerate `dist/` with the package scripts instead of editing generated CSS directly.
- Treat `public/` as disposable site output and do not commit it.

## Global scripts

- Put scripts that run on every page in `globals/global-client/`.
- Add global behavior as a focused module and import it from `globals/global-client/global.client.js`.
- Do not place global behavior inline in a layout.
- Put behavior owned by one page in that page's `client.js` instead of importing it into the global client.

## Validation and review

- Run focused checks while iterating and run `npm test` before handing off a completed change.
- Validate every PR review comment before changing code because automated review suggestions can be incorrect.
- Reply to each addressed review comment with a concise description of what changed.
