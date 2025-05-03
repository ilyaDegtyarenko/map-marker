import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: [ '**/*.{ts,mts,tsx,vue}' ],
    rules: {
      'indent': [ 'error', 2, { SwitchCase: 1 } ],
      'brace-style': 'off',
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'template-curly-spacing': [ 'error', 'always' ],
      'max-statements-per-line': [ 'error', { max: 1 } ],
      'max-len': [
        'error',
        {
          code: 100,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
          ignoreTrailingComments: true,
          ignoreUrls: true,
          ignorePattern: '^\\s*[-\\w]+:\\s*|\\s*@apply\\s*'
        }
      ],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true
        }
      ],
      'vue/object-curly-spacing': [ 'error', 'always' ],
      'vue/array-bracket-spacing': [ 'error', 'always' ],
      'vue/template-curly-spacing': [ 'error', 'always' ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'any',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ]
    }
  },
  {
    files: [ '**/*.vue' ],
    rules: {
      'indent': 'off',
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 1,
          switchCase: 1
        }
      ],
      'vue/html-indent': [ 'error', 2 ]
    }
  },

  globalIgnores([
    '**/dist/**',
    '**/node_modules/**',
    '**/dist-ssr/**',
    '**/coverage/**'
  ]),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended
)
