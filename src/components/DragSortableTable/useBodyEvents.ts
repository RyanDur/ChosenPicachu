import {useContext} from 'react';
import {BodyEvents, tableContexts} from './tableContexts';

export const useBodyEvents = (): BodyEvents => useContext(tableContexts.Body);
