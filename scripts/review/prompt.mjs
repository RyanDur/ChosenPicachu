const doors = ['Structure', 'Presentation', 'DynamicInteraction', 'TeeUp'].map(door => `src/pages/Home/${door}.tsx`);

const scopes = {
    full: () => 'Review the whole of src/ and e2e/: every page, component, sheet and spec.',
    changes: ({before, after}) =>
        `Review what this push changed: run \`git diff ${before} ${after}\` for the change and read each touched file whole for its context.`
};

export const promptFor = ({scope, before, after}) => {
    const describeScope = scopes[scope];
    if (describeScope === undefined) {
        throw new Error(`no review scope named "${scope}"; the scopes are ${Object.keys(scopes).join(' and ')}`);
    }
    return [
        'This site states its own principles on its home page, and the code is meant to hold them up.',
        `Read these files first; they are the rubric, in the author's words: ${doors.join(', ')}.`,
        'Each door says what things are, how they show, or how they respond, then how the author organizes it, and ends with the test of the organization. Hold the code to those words and to nothing outside them.',
        describeScope({before, after}),
        'Report only what you can point at: a file and a line, the door it answers to, and the principle in the page\'s own words. A violation breaks a stated principle outright. A concern bends one. A note is worth the author\'s eye but breaks nothing.',
        'Do not report style preferences the page does not state, and do not repeat one finding across many lines; name the pattern once with its first occurrence.'
    ].join('\n\n');
};

if (import.meta.url === `file://${process.argv[1]}`) {
    process.stdout.write(promptFor({
        scope: process.env.REVIEW_SCOPE ?? 'full',
        before: process.env.REVIEW_BEFORE,
        after: process.env.REVIEW_AFTER
    }));
}
