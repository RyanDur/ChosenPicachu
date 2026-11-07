import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Tutorial, tableTutorials} from './tutorial-pages';

const tutorials = tableTutorials();

export const useShownTutorial = (): Maybe<Tutorial> => tutorials.at(useLocation().pathname);
