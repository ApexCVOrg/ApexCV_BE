module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',                // đảm bảo ESLint không tranh chấp với Prettier
      'plugin:prettier/recommended'
    ],
    plugins: [
      '@typescript-eslint',
      'prettier',
      'sort-class-members'
    ],
    rules: {
      // Bật báo lỗi khi không đúng format Prettier
      'prettier/prettier': ['error'],
      // Buộc cách dòng giữa các member của class
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      // ESLint plugin để sort class members nếu muốn
      'sort-class-members/sort-class-members': ['error', {
        order: [
          '[static-properties]',
          '[static-methods]',
          'constructor',
          '[properties]',
          '[methods]'
        ],
        accessorPairPositioning: 'getThenSet'
      }]
    },
    overrides: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
          // indent TypeScript theo 2 spaces
          '@typescript-eslint/indent': ['error', 2]
        }
      }
    ]
  };
  