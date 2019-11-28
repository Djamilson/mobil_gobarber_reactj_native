import React from 'react';
import {useSelector} from 'react-redux';
import createRouter from './routes';

export default function App() {
  // const signed = useSelector(state => state.auth.signed, () => true);
  const signed = useSelector(state => state.auth.signed);

  // const state_ = useSelector(states => states);

  // const provider = false;
  const provider = useSelector(s =>
    s !== undefined &&
    s !== null &&
    s.user.profile !== null &&
    s.user.profile.provider === true
      ? s.user.profile.provider
      : false
  );

  // console.log('Usuário: ', state_);
  // console.log('Estou aqui:', signed);
  // console.tron.log('Estou aqui:', signed);

  const Routes = createRouter(signed, provider);

  return <Routes />;
}
