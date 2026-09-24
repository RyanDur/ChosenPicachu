import type AxeBuilder from '@axe-core/playwright';

type Results = Awaited<ReturnType<AxeBuilder['analyze']>>;

export const violationsOf = ({violations}: Results) => violations.map(violation => ({
  id: violation.id,
  impact: violation.impact,
  nodes: violation.nodes.length,
  sample: violation.nodes[0]?.html.slice(0, 120)
}));
