import {FC} from 'react';
import {Box, Diagram, Label} from '../../Recipe/Drawing';
import './Diagrams.css';

export const OneGuessTwoFolds: FC = () =>
  <Diagram title="One guess, two folds" height={170}
    says="Both folds stop at their own text, but the motion crosses the whole guess, so the short fold is open almost at once and shuts only after a wait.">
    <Label x={160} y={18}>max-height: the guess</Label>
    <Box x={40} y={30} width={100} height={110} kind="unseen"/>
    <Box x={40} y={30} width={100} height={30} kind="clip"/>
    <Box x={50} y={36} width={80} height={18} kind="native"/>
    <Label x={90} y={160}>short: guess mostly empty</Label>
    <Box x={180} y={30} width={100} height={110} kind="unseen"/>
    <Box x={180} y={30} width={100} height={80} kind="clip"/>
    <Box x={190} y={36} width={80} height={68} kind="native"/>
    <Label x={230} y={160}>tall: less of it empty</Label>
  </Diagram>;
