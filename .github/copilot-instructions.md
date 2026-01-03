# GitHub Copilot Instructions

## Code Style and Linting

All generated code must respect the project's ESLint configuration. Before suggesting code:

- Review the `.eslintrc` or `eslint.config.js` file in the project root
- Ensure all code follows the configured rules and standards
- Fix any linting errors before completion

## General Guidelines

- Write clean, readable, and maintainable code
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing code style in the project
- Prefer modern JavaScript/TypeScript features when appropriate

## JavaScript/TypeScript Standards

- Use `const` by default, `let` when needed, avoid `var`
- Use arrow functions for callbacks
- Add proper type annotations in TypeScript files
- Follow the configured indentation and spacing rules
- Import only necessary types and functions from packages (e.g., `import { useState } from "react"` instead of `import React from "react"`; omit React import entirely when not explicitly used)

## Testing

- Consider edge cases when writing functions
- Suggest unit tests when writing new utilities or components

## Performance

- Avoid unnecessary re-renders in React components
- Use memoization where appropriate
- Keep bundle size in mind when adding dependencies

---

*This file guides GitHub Copilot suggestions for this project.*