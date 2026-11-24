import {empty, has, maybe, not} from '@ryandur/sand';
import {anElementTakes} from './element-attributes.mjs';

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
 * @param {any} node
 * @returns {any} the outermost cast or parenthesis around it
 */
const wrapped = node => wrapperTypes.has(node.parent.type) ? wrapped(node.parent) : node;

/**
 * @param {any} declared a function
 * @returns {string} the name it is declared under, through memo and forwardRef
 */
const declaredAs = declared => {
  const {parent} = declared;
  if (parent.type === 'CallExpression' && parent.callee !== declared) return declaredAs(parent);
  const holder = parent.type === 'VariableDeclarator' ? parent.id : parent.type === 'Property' ? parent.key : declared.id;
  return has(holder) && holder.type === 'Identifier' ? holder.name : '';
};

/**
 * @param {any} read a read of the rest, spread as an attribute
 * @returns {any} the JSX element it is spread onto
 */
const elementSpreadOnto = read => wrapped(read).parent.parent.parent;

const branchTypes = new Set(['ConditionalExpression', 'LogicalExpression', ...wrapperTypes]);

/**
 * @param {any} element a JSX element
 * @param {any} declared a function
 * @returns {boolean} whether the function returns that element as its root, in any branch
 */
/**
 * @param {any} node
 * @returns {any} the nearest function around the node
 */
const functionAround = node => functionTypes.has(node.parent.type) ? node.parent : functionAround(node.parent);

const returnedBy = (element, declared) => {
  const {parent} = element;
  if (parent === declared && declared.body === element) return true;
  if (parent.type === 'ReturnStatement') return functionAround(parent) === declared;
  return branchTypes.has(parent.type) && returnedBy(parent, declared);
};

/** @type {import('eslint').Rule.RuleModule} */
const noForwardedProps = {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      forwarded: '{{name}} is received only to be given to another component; that component reads it from the address or from its context\'s hook',
      spread: '{{name}} is spread onto another component; each component reads what it needs from the address or from its context\'s hook',
      rest: 'the rest of the props, {{name}}, is spread onto a component inside; only a control that wraps one control spreads the rest onto the control it returns'
    }
  },
  create(context) {
    const source = context.sourceCode;
    /**
     * @param {any} read an identifier or a member of the props
     * @returns {boolean}
     */
    const givenToAComponent = read => {
      const {parent: container} = wrapped(read);
      if (container.type !== 'JSXExpressionContainer' || container.parent.type !== 'JSXAttribute') return false;
      const attribute = container.parent;
      const {name: tag} = attribute.parent;
      return namesAComponent(tag) && not(providesAContext(tag)) && not(anElementTakes(source.getText(attribute.name)));
    };
    /**
     * @param {any} read
     * @returns {boolean}
     */
    const spreadOntoAComponent = read => {
      const {parent: spread} = wrapped(read);
      return spread.type === 'JSXSpreadAttribute' && namesAComponent(spread.parent.name)
        && not(providesAContext(spread.parent.name));
    };
    /**
     * @param {import('eslint').Scope.Variable} variable
     * @returns {any[]}
     */
    const readsOf = variable =>
      variable.references.filter(reference => reference.isRead()).map(({identifier}) => identifier);
    /**
     * @param {any} node
     * @param {string} messageId
     * @param {string} name
     */
    const refuse = (node, messageId, name) => context.report({node, messageId, data: {name}});
    /**
     * @param {any} props the whole props, taken as one name
     * @param {any[]} reads
     */
    const readWhole = (props, reads) => {
      if (reads.every(spreadOntoAComponent)) refuse(props, 'spread', props.name);
      const members = reads.map(read => read.parent)
        .filter(member => member.type === 'MemberExpression' && not(member.computed) && member.property.type === 'Identifier');
      new Set(members.map(member => member.property.name)).forEach(name => {
        const ofThatName = members.filter(member => member.property.name === name);
        if (ofThatName.every(givenToAComponent)) refuse(ofThatName[0], 'forwarded', name);
      });
    };
    /**
     * @param {any} declared
     */
    const read = declared => {
      const [props] = declared.params;
      if (empty(props) || not(/^[A-Z]/.test(declaredAs(declared)))) return;
      source.getDeclaredVariables(declared).forEach(variable => {
        const [definition] = variable.identifiers;
        const reads = readsOf(variable);
        if (empty(reads)) return;
        if (definition === props) return readWhole(props, reads);
        if (props.type !== 'ObjectPattern') return;
        const {parent} = definition;
        const property = parent.type === 'AssignmentPattern' ? parent.parent : parent;
        if (property.type === 'RestElement' && property.parent === props
          && reads.some(each => spreadOntoAComponent(each) && not(returnedBy(elementSpreadOnto(each), declared)))) {
          return refuse(definition, 'rest', definition.name);
        }
        if (property.type === 'Property' && property.parent === props && reads.every(givenToAComponent)) {
          refuse(definition, 'forwarded', source.getText(property.key));
        }
      });
    };
    return {ArrowFunctionExpression: read, FunctionExpression: read, FunctionDeclaration: read};
  }
};

export const components = {rules: {'rendered-as-jsx': renderedAsJsx, 'no-forwarded-props': noForwardedProps}};
