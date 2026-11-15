import {FC, PropsWithChildren} from 'react';

export const CenteredMain: FC<PropsWithChildren> = ({children}) => <main className="app-main field">{children}</main>;
