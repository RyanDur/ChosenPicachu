const wearsMonospaced = 'JSXAttribute[name.name="className"][value.value=/(^|\\s)monospaced(\\s|$)/]';
const sampleInAMonospacedPre = `JSXElement[openingElement.name.name="pre"]:has(JSXOpeningElement[name.name="pre"] > ${wearsMonospaced}) > JSXElement > JSXOpeningElement`;

export const bareInlineCode = {
  selector: `JSXOpeningElement[name.name="code"]:not(${sampleInAMonospacedPre}):not(:has(${wearsMonospaced}))`,
  message: 'Code wears monospaced, so it reads as code: in a sentence the code element wears it, and in a sample the pre around it does.'
};
