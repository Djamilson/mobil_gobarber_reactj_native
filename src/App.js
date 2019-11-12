import React from 'react';
import {useSelector} from 'react-redux';
import createRouter from './routes';

export default function App() {
  const signed = useSelector(state => state.auth.signed);
  //console.log('Estou aqui:', signed);
  //console.tron.log('Estou aqui:', signed);

  const Routes = createRouter(signed);

  return <Routes />;
}
