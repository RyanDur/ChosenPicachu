import {flushSync} from 'react-dom';
import './glide.css';

export const glide = (animated: boolean) => (update: () => void): void => {
    if (animated && 'startViewTransition' in document) {
        document.startViewTransition(() => flushSync(update));
    } else {
        update();
    }
};
