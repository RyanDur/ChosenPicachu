import {FC, PropsWithChildren} from 'react';

export const Main: FC<PropsWithChildren> = ({children}) => <main className="app-main field in-view">{children}</main>;
