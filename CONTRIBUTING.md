# Contributing

## Development

Install dependencies and the Chromium test browser:

```console
npm ci
npx playwright install chromium
```

Run the complete lint, type, unit, build, and browser suite with:

```console
npm test
```

Use `npm start` for the parallel CSS and site watchers. Distribution files are generated into `dist/`; CI verifies that a clean build matches the committed artifacts.

## Releasing

Changelog generation and releasing are automated with npm scripts and GitHub Actions:

1. Open the repository's Actions tab.
2. Select the `Version and Release` workflow.
3. Choose a semantic version bump, or provide a custom version.
4. The workflow runs the full test suite, updates the changelog and version with `releasearoni`, publishes through npm trusted publishing, and creates the GitHub release.

For a local release, start from a clean worktree and run:

```console
npm version patch # or minor / major
npm publish
```

The release automation is described in more depth at [bret.io/projects/package-automation](https://bret.io/projects/package-automation/).

## Guidelines

- Keep changes focused and consistent with the existing classless design.
- Run the complete test suite before submitting changes.
- Add coverage for new behavior or compatibility contracts.
- Discuss substantial new features in an issue before investing in a large implementation.
