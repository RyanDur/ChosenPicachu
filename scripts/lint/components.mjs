import {empty, has, maybe, not} from '@ryandur/sand';

const functionTypes = new Set(['ArrowFunctionExpression', 'FunctionExpression', 'FunctionDeclaration']);
const wrapperTypes = new Set(['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'ParenthesizedExpression']);
const memoizers = new Set(['useCallback', 'memo']);
const definitionTypes = new Set(['Variable', 'FunctionName']);

/**
 * @param {any} node
 * @returns {any}
 */
const unwrapped = node => has(node) && wrapperTypes.has(node.type) ? unwrapped(node.expression) : node;

/**
 * @param {any} node
 * @returns {any}
 */
const functionIn = node => {
  const value = unwrapped(node);
  if (empty(value)) return undefined;
  if (functionTypes.has(value.type)) return value;
  const memoized = value.type === 'CallExpression' && value.callee.type === 'Identifier' && memoizers.has(value.callee.name);
  return memoized ? functionIn(value.arguments[0]) : undefined;
};

/**
 * @param {import('@ryandur/sand').Maybe<any>} resolved the scope variable an identifier resolves to, when it resolves
 * @returns {any}
 */
const definitionOf = resolved => {
  const [first] = resolved.mBind(({defs}) => maybe(defs)).orElse([]);
  if (empty(first) || not(definitionTypes.has(first.type))) return undefined;
  const definition = first.node;
  return definition.type === 'VariableDeclarator' ? unwrapped(definition.init) : definition;
};

/** @type {import('eslint').Rule.RuleModule} */
const renderedAsJsx = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      called: 'render {{name}} as JSX, <Name …/>, and name it in PascalCase if it isn\'t'
    }
  },
  create(context) {
    const source = context.sourceCode;
    const functionsReturningJsx = new Set();
    const callsByName = [];
    const variableOf = identifier =>
      maybe(source.getScope(identifier).references.find(each => each.identifier === identifier))
        .mBind(({resolved}) => maybe(resolved));
    /**
     * @param {any} node
     * @returns {boolean}
     */
    const isJsx = node => {
      const value = unwrapped(node);
      if (empty(value)) return false;
      if (value.type === 'JSXElement' || value.type === 'JSXFragment') return true;
      if (value.type === 'ConditionalExpression') return isJsx(value.consequent) || isJsx(value.alternate);
      if (value.type === 'LogicalExpression') return isJsx(value.right);
      if (value.type === 'Identifier') return isJsx(definitionOf(variableOf(value)));
      return false;
    };
    const enclosingFunction = node => source.getAncestors(node).findLast(ancestor => functionTypes.has(ancestor.type));
    return {
      'ArrowFunctionExpression[expression=true]': arrow => {
        if (isJsx(arrow.body)) functionsReturningJsx.add(arrow);
      },
      ReturnStatement: statement => {
        if (isJsx(statement.argument)) functionsReturningJsx.add(enclosingFunction(statement));
      },
      CallExpression: call => {
        if (call.callee.type === 'Identifier') callsByName.push({node: call, identifier: call.callee});
        const mapped = call.callee.type === 'MemberExpression' && call.callee.property.name === 'map';
        call.arguments.filter(argument => mapped && argument.type === 'Identifier')
          .forEach(argument => callsByName.push({node: argument, identifier: argument}));
      },
      'Program:exit': () => callsByName
        .filter(({identifier}) => functionsReturningJsx.has(functionIn(definitionOf(variableOf(identifier)))))
        .forEach(({node, identifier}) => context.report({node, messageId: 'called', data: {name: identifier.name}}))
    };
  }
};

const elementAttributes = new Set(['className', 'id', 'name', 'label', 'disabled', 'to', 'end', 'href', 'title', 'key', 'x', 'y']);

/**
 * @param {any} name a JSX tag's name
 * @returns {boolean}
 */
const namesAComponent = name => name.type === 'JSXMemberExpression' || (name.type === 'JSXIdentifier' && /^[A-Z]/.test(name.name));

/**
 * @param {any} name a JSX tag's name
 * @returns {boolean}
 */
const providesAContext = name =>
  name.type === 'JSXMemberExpression' ? name.property.name === 'Provider' : name.name.endsWith('Provider');

/**
 * @param {string} attribute
 * @returns {boolean}
 */
const anElementTakesIt = attribute => elementAttributes.has(attribute) || /^(aria-|data-|on[A-Z])/.test(attribute);

/** @type {import('eslint').Rule.RuleModule} */
const noForwardedProps = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      forwarded: '{{name}} is received only to be given to another component; that component reads it from the address or from its context\'s hook',
      spread: '{{name}} is spread whole onto another component; each component reads what it needs from the address or from its context\'s hook'
    }
  },
  create(context) {
    const source = context.sourceCode;
    /**
     * @param {any} declared
     * @returns {string}
     */
    const nameOf = declared => {
      const holder = declared.parent.type === 'VariableDeclarator' ? declared.parent.id : declared.id;
      return has(holder) && holder.type === 'Identifier' ? holder.name : '';
    };
    /**
     * @param {any} identifier
     * @returns {boolean}
     */
    const givenToAComponent = identifier => {
      const {parent: container} = identifier;
      if (container.type !== 'JSXExpressionContainer' || container.parent.type !== 'JSXAttribute') return false;
      const attribute = container.parent;
      const {name: tag} = attribute.parent;
      const given = source.getText(attribute.name);
      return namesAComponent(tag) && not(providesAContext(tag)) && not(anElementTakesIt(given));
    };
    /**
     * @param {any} identifier
     * @returns {boolean}
     */
    const spreadOntoAComponent = identifier =>
      identifier.parent.type === 'JSXSpreadAttribute' && namesAComponent(identifier.parent.parent.name);
    /**
     * @param {any} declared
     */
    const read = declared => {
      const [props] = declared.params;
      if (empty(props) || not(/^[A-Z]/.test(nameOf(declared)))) return;
      /**
       * @param {import('eslint').Scope.Variable} variable
       * @returns {any[]}
       */
      const reads = variable =>
        variable.references.filter(reference => reference.isRead()).map(({identifier}) => identifier);
      source.getDeclaredVariables(declared).forEach(variable => {
        const [definition] = variable.identifiers;
        const uses = reads(variable);
        if (empty(uses)) return;
        if (props.type === 'Identifier' && definition === props && uses.every(spreadOntoAComponent)) {
          context.report({node: definition, messageId: 'spread', data: {name: variable.name}});
        }
        const property = definition.parent.type === 'AssignmentPattern' ? definition.parent.parent : definition.parent;
        const destructured = props.type === 'ObjectPattern' && property.type === 'Property' && property.parent === props;
        if (destructured && uses.every(givenToAComponent)) {
          context.report({node: definition, messageId: 'forwarded', data: {name: source.getText(property.key)}});
        }
      });
    };
    return {ArrowFunctionExpression: read, FunctionExpression: read, FunctionDeclaration: read};
  }
};

export const components = {rules: {'rendered-as-jsx': renderedAsJsx, 'no-forwarded-props': noForwardedProps}};
