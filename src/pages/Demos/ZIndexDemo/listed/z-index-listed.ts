import {PartsGroup} from '../../parts-listed';
import {zIndexParts} from '../part-pages';

export const zIndexListed: readonly PartsGroup[] = zIndexParts.groups.map(({label, parts}) => ({
  label,
  entries: parts.map(part => ({to: zIndexParts.addressOf(part), ...zIndexParts.told(part)}))
}));
