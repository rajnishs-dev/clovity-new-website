import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier/flat';

/**
 * ESLint flat config.
 *
 * `eslint-config-next` 16 ships native flat configs (arrays of `Linter.Config`),
 * so they are spread directly - no `FlatCompat` shim, which is what the old
 * eslintrc-based setup needed and which breaks against this version.
 *
 * `prettierConfig` goes last so it can switch off any stylistic rule that would
 * otherwise fight the formatter.
 *
 * Note: Next 16 removed `next lint`. ESLint is invoked directly via
 * `npm run lint`, which is also what the `verify` script and CI use.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'next-env.d.ts',
      'public/**',
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettierConfig,

  {
    rules: {
      // Enforce next/link + next/image across the whole app - the migration's
      // two hard requirements, so a regression fails the build rather than
      // sliding through review.
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',

      // Keep the codebase honest about unused code and untyped escape hatches.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
    },
  },

  {
    /**
     * `tools/` holds the parity harness and the legacy static server - Node CLI
     * scripts, not app code. Printing a report to stdout is their entire interface,
     * so `no-console` is the wrong rule here rather than a rule being dodged; the
     * app code in `src/` is still held to it.
     */
    files: ['tools/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default config;
