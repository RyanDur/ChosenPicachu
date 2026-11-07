import {useLocation} from 'react-router';
import {Maybe} from '@ryandur/sand';
import {Tutorial, tableTutorials} from './tutorial-pages';

export const useShownTutorial = (): Maybe<Tutorial> => tableTutorials.at(useLocation().pathname);
