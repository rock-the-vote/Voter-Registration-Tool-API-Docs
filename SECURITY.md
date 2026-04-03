## Security

We are actively addressing several security advisories related to project dependencies (kramdown, activesupport, and others).

Immediate mitigations in progress:

- Dependabot is enabled to open automated PRs for gem updates (.github/dependabot.yml).
- Short-term hotfixes were applied to the published `gh-pages` site to restore availability and readability.

Planned next steps:

- Evaluate upgrading Middleman and related gems so transitive dependencies (kramdown/activesupport) can be updated to patched releases.
- Test and deploy a full rebuild with updated dependencies.

If you discover a high severity issue, please email the maintainers.
