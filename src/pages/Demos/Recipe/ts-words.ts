const keywords = [
  'const', 'let', 'return', 'if', 'else', 'new', 'function', 'undefined', 'true', 'false', 'null',
  'export', 'import', 'from', 'type', 'readonly', 'extends', 'typeof', 'in', 'of', 'as', 'void',
  'switch', 'case', 'default', 'throw', 'try', 'catch', 'finally', 'await', 'async', 'while', 'for', 'declare'
];

export const tsWords = {
  keywords,
  beforeAValue: [
    'return', 'case', 'as', 'satisfies', 'extends', 'from', 'import', 'export', 'default', 'throw', 'in', 'of', 'typeof',
    'void', 'await', 'yield', 'else', 'module', 'is', 'keyof'
  ]
};
