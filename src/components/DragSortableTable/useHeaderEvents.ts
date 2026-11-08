import {useContext} from 'react';
import {HeaderEvents, tableContexts} from './tableContexts';

export const useHeaderEvents = (): HeaderEvents => useContext(tableContexts.Header);
