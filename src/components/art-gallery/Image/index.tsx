import {FC, PropsWithChildren, useState} from 'react';
import {Link} from 'react-router-dom';
import {join} from '@libraries/class-names';
import {Loading} from '@components/art-gallery/Loading';
import {useSearchParamsObject} from '@libraries/search-params';
import {toQueryString} from '@libraries/url-support';
import {Art} from '@components/art-gallery/museums/types/response';
import {Paths} from '@libraries/routing/Paths';
import './Image.css';

interface ImageProps {
  piece: Partial<Art>;
  className?: string;
  linkEnabled?: boolean;
}

export const Image: FC<ImageProps> = (
  {
    piece,
    className,
    linkEnabled = true
  }) => {
  const [completed, isComplete] = useState(false);
  const [errored, isError] = useState(false);
  const {tab} = useSearchParamsObject<{ tab: string }>();
  const gotoTopOfPage = () => window.scrollTo(0, 0);
  const ConditionalLink: FC<PropsWithChildren & { enabled: boolean, area: string }> =
    ({children, enabled, area}) => enabled ?
      <Link onClick={gotoTopOfPage} to={`${Paths.artGallery}/${piece.id}${toQueryString({tab: area})}`}
            className="scrim">{children}</Link> : <>{children}</>;

    return (errored || !piece.image) ?
        <img alt="oops"
             className="error"
             src="https://img.icons8.com/ios/100/000000/no-image.png"
             data-testid="error"/> :
        (<>
            <ConditionalLink enabled={linkEnabled} area={tab}>
                <img className={join('image', 'off-screen', className)}
                     onError={() => {
                         isComplete(true);
                         isError(true);
                     }}
                     onLoad={event => {
                         isComplete(true);
                         isError(false);
                         event.currentTarget.classList.remove('off-screen');
                     }}
                     width={100}
                     alt={piece.altText} title={piece.title}
                     data-testid={`piece-${piece.id}`}
                     src={piece.image}/>
            </ConditionalLink>
            {completed || <Loading/>}
        </>);
};
