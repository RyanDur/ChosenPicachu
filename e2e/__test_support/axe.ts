import type AxeBuilder from '@axe-core/playwright';

type Results = Awaited<ReturnType<AxeBuilder['analyze']>>;
type Violation = Results['violations'][number];

export type Finding = {
  readonly id: Violation['id'];
  readonly impact: Violation['impact'];
  readonly nodes: number;
  readonly sample?: string;
};

export const violationsOf = ({violations}: Results): Finding[] => violations.map(violation => ({
  id: violation.id,
  impact: violation.impact,
  nodes: violation.nodes.length,
  sample: violation.nodes[0]?.html.slice(0, 120)
}));
