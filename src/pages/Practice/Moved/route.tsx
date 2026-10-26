import {FC} from 'react';
import {Navigate, useLocation} from 'react-router';
import {Paths} from '@pages/Paths';

const ToPractice: FC = () => {
  const {search} = useLocation();
  return <Navigate replace to={`${Paths.practice}${search}`}/>;
};

export default ToPractice;
