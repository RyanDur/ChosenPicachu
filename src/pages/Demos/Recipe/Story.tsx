import {FC} from 'react';
import {StoryShell, Titled} from './StoryShell';

export const Story: FC<Titled> = told => <StoryShell {...told}/>;
