import React from 'react';
import {useSelector} from 'react-redux';

import createRouter from './routes';

export default function App() {
  const signed = useSelector(state => state.auth.signed);

  const acceped_regulation = useSelector(s =>
    s !== undefined &&
    s !== null &&
    s.user.profile !== null &&
    s.user.profile.privacy === true
      ? s.user.profile.privacy
      : false
  );

  // const provider = false;
  const provider = useSelector(s =>
    s !== undefined &&
    s !== null &&
    s.user.profile !== null &&
    s.user.profile.provider === true
      ? s.user.profile.provider
      : false
  );

  const Routes = createRouter(signed, provider, acceped_regulation);

  return <Routes />;
}
