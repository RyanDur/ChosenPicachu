import * as schema from 'schemawax';
import {Concern} from '@pages/Record/moments/concerns';

export enum DevelopmentTabs {
  structure = 'structure',
  presentation = 'presentation',
  dynamicInteraction = 'dynamic-interaction'
}

export const tabConcerns: Record<DevelopmentTabs, Concern> = {
  [DevelopmentTabs.structure]: 'Structure',
  [DevelopmentTabs.presentation]: 'Presentation',
  [DevelopmentTabs.dynamicInteraction]: 'Dynamic Interaction'
};

export const developmentTabParam: schema.Decoder<DevelopmentTabs> = schema.literalUnion(...Object.values(DevelopmentTabs));
