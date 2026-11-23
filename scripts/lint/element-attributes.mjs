const everyElement = [
  'accessKey', 'autoCapitalize', 'autoFocus', 'className', 'contentEditable', 'dir', 'draggable', 'enterKeyHint',
  'hidden', 'id', 'inert', 'inputMode', 'is', 'itemProp', 'key', 'lang', 'nonce', 'part', 'popover', 'ref', 'role',
  'slot', 'spellCheck', 'style', 'tabIndex', 'title', 'translate'
];

const controlsAndForms = [
  'accept', 'action', 'autoComplete', 'checked', 'cols', 'command', 'commandFor', 'defaultChecked', 'defaultValue',
  'disabled', 'encType', 'form', 'formAction', 'high', 'htmlFor', 'label', 'list', 'low', 'max', 'maxLength', 'method',
  'min', 'minLength', 'multiple', 'name', 'noValidate', 'open', 'optimum', 'pattern', 'placeholder',
  'popoverTarget', 'popoverTargetAction', 'readOnly', 'required', 'rows', 'selected', 'size', 'step', 'type', 'value',
  'wrap'
];

const linksAndMedia = [
  'alt', 'cite', 'colSpan', 'controls', 'coords', 'crossOrigin', 'dateTime', 'decoding', 'download', 'end',
  'fetchPriority', 'headers', 'height', 'href', 'hrefLang', 'kind', 'loading', 'loop', 'media', 'muted', 'ping',
  'playsInline', 'poster', 'preload', 'referrerPolicy', 'rel', 'rowSpan', 'sandbox', 'scope', 'sizes', 'span', 'src',
  'srcSet', 'start', 'target', 'to', 'width'
];

const drawings = [
  'cx', 'cy', 'd', 'dx', 'dy', 'fill', 'fontSize', 'opacity', 'pathLength', 'points', 'preserveAspectRatio', 'r',
  'rx', 'ry', 'stroke', 'strokeDasharray', 'strokeLinecap', 'strokeWidth', 'textAnchor', 'transform', 'viewBox',
  'x', 'x1', 'x2', 'y', 'y1', 'y2'
];

const names = new Set([...everyElement, ...controlsAndForms, ...linksAndMedia, ...drawings, 'children']);

/**
 * The attributes an HTML or SVG element takes, by the names React gives them, with a link component's `to` and `end`.
 * @param {string} attribute
 * @returns {boolean}
 */
export const anElementTakes = attribute => names.has(attribute) || /^(aria-|data-|on[A-Z])/.test(attribute);
