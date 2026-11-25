const everyElement = [
  'accessKey', 'autoCapitalize', 'autoFocus', 'className', 'contentEditable', 'dir', 'draggable', 'enterKeyHint',
  'hidden', 'id', 'inert', 'inputMode', 'is', 'itemProp', 'itemScope', 'itemType', 'key', 'lang', 'nonce', 'part',
  'popover', 'ref', 'role', 'slot', 'spellCheck', 'style', 'tabIndex', 'title', 'translate'
];

const controlsAndForms = [
  'accept', 'action', 'autoComplete', 'checked', 'cols', 'command', 'commandFor', 'defaultChecked', 'defaultValue',
  'dirName', 'disabled', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget',
  'high', 'htmlFor', 'label', 'list', 'low', 'max', 'maxLength', 'method', 'min', 'minLength', 'multiple', 'name',
  'noValidate', 'open', 'optimum', 'pattern', 'placeholder', 'popoverTarget', 'popoverTargetAction', 'readOnly',
  'required', 'reversed', 'rows', 'selected', 'size', 'step', 'type', 'value', 'wrap'
];

const linksAndMedia = [
  'allow', 'alt', 'async', 'autoPlay', 'cite', 'colSpan', 'content', 'controls', 'coords', 'crossOrigin', 'dateTime',
  'decoding', 'defer', 'download', 'end', 'fetchPriority', 'headers', 'height', 'href', 'hrefLang', 'integrity',
  'kind', 'loading', 'loop', 'media', 'muted', 'ping', 'playsInline', 'poster', 'preload', 'referrerPolicy', 'rel',
  'rowSpan', 'sandbox', 'scope', 'shape', 'sizes', 'span', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'target',
  'to', 'useMap', 'width'
];

const drawings = [
  'clipPath', 'clipRule', 'cx', 'cy', 'd', 'dominantBaseline', 'dx', 'dy', 'fill', 'fillOpacity', 'fillRule',
  'filter', 'fontFamily', 'fontSize', 'fontWeight', 'fx', 'fy', 'gradientUnits', 'letterSpacing', 'markerEnd',
  'markerHeight', 'markerMid', 'markerStart', 'markerWidth', 'mask', 'offset', 'opacity', 'orient', 'pathLength',
  'points', 'preserveAspectRatio', 'r', 'refX', 'refY', 'rx', 'ry', 'stopColor', 'stopOpacity', 'stroke',
  'strokeDasharray', 'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'strokeOpacity',
  'strokeWidth', 'textAnchor', 'textLength', 'transform', 'vectorEffect', 'viewBox', 'x', 'x1', 'x2', 'y', 'y1', 'y2'
];

const names = new Set([...everyElement, ...controlsAndForms, ...linksAndMedia, ...drawings, 'children']);

export const elementAttributes = {
  /**
   * @param {string} attribute
   * @returns {boolean}
   */
  takes: attribute => names.has(attribute) || /^(aria-|data-|on[A-Z])/.test(attribute)
};
