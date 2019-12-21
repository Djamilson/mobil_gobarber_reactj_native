import {Alert} from 'react-native';

import {all, call, put, takeLatest} from 'redux-saga/effects';

import api from '~/services/api';

import {signInFaileru, signUpSuccess} from '../user/actions';
import {signFailure, signInSuccess} from './actions';

export function* signIn({payload}) {
  try {
    const {email, password} = payload;

    const response = yield call(api.post, 'sessions', {
      email,
      password,
    });

    const {token, user} = response.data;

    /* if (user.provider) {
      Alert.alert(
        'Erro no login',
        'Usuário é prestador de serviço, acessa a opção web!'
      );

      yield put(signFailure());
      return;
    } */

    api.defaults.headers.Authorization = ` Bearer ${token}`;
    // const {last_login_at} = user;
    yield put(signInSuccess(token, user));

    /*
    if (!last_login_at) {
    yield put(signInSuccess(token, user));

      return NavigationService.navigate('RegulationReview');
    } */

    // return NavigationService.navigate('rota')
    // history.push('/dashboard');
  } catch (error) {
    const str = error.toString();
    const final = str.replace(/\D/g, '');

    if (final === '400') {
      Alert.alert(
        'Erro no login',
        'Não foi possível encontra um usuário, crie sua conta!'
      );
      yield put(signFailure());
      return;
    }

    // Make sure the user has been verified
    if (final === '401') {
      Alert.alert(
        'Erro no login',
        'Seu email ainda não foi validado, acesse sua conta de email e confirme a validação do acesso!'
      );
      yield put(signFailure());
      return;
    }

    // Make sure the user has been verified
    if (final === '402') {
      Alert.alert(
        'Erro no login',
        'No momento esse usuário está desativado, entre em contato com o administrador!'
      );
      yield put(signFailure());
      return;
    }
    if (final === '403') {
      Alert.alert('Erro no login', 'Usuário não encontrado!');
      yield put(signFailure());
      return;
    }
    if (final === '404') {
      Alert.alert(
        'Erro no login',
        'Usúario ou senha incorreta, verifique seus dados!'
      );
      yield put(signFailure());
      return;
    }

    if (final === '429') {
      Alert.alert(
        'Erro no login',
        'Não foi possível conectar ao servidor, tente mais tarde!'
      );
      yield put(signFailure());
      return;
    }

    if (str === 'Error: Network Error') {
      Alert.alert('Erro no login', 'Você não está conectado à internet!');

      yield put(signFailure());
      return;
    }

    Alert.alert('Erro no login', 'Não foi possível conectar, tente novamente!');
    yield put(signFailure());
  }
}

export function* signUp({payload}) {
  try {
    const {name, email, password, privacy, resetForm} = payload;

    yield call(api.post, 'usersmobil', {
      name,
      email,
      password,
      privacy,
    });

    resetForm();

    Alert.alert(
      'Sucesso',
      `Cadastro efetuado, acesse o email ${email} para a tivar sua conta!`
    );
    yield put(signUpSuccess());
  } catch (error) {
    const str = error.toString();
    const final = str.replace(/\D/g, '');

    if (final === '400') {
      Alert.alert('Error', 'Campos inválidos!');

      yield put(signInFaileru());
      return;
    }

    if (final === '401') {
      Alert.alert('Error', 'Usuário já cadastrado!');

      yield put(signInFaileru());
      return;
    }

    if (final === '402') {
      Alert.alert('Error', 'Não foi possível encontrar o grupo para associar.');

      yield put(signInFaileru());
      return;
    }

    if (final === '403') {
      Alert.alert(
        'Error',
        'Código da empresa está incorreto, tente novamente!'
      );

      yield put(signInFaileru());
      return;
    }

    yield put(signInFaileru());
  }
}

export function* acceptRegulationUp({payload}) {
  try {
    const {token, newPrivacy, navigate} = payload.token;

    const resp = yield call(api.get, 'accept_regulation', {
      params: {
        newPrivacy,
      },
    });

    yield put(signInSuccess(token, resp.data));

    if (newPrivacy) {
      Alert.alert('Sucesso', 'Termos aceitos com sucesso!');
      navigate('App');
      return;
    }

    Alert.alert('Sucesso', 'Os termos não foram aceitos!');
    navigate('RegulationReview');
  } catch (error) {
    // console.log('ERRRRRo::', error);
    Alert.alert(
      'Error',
      'Não foi possível aceitar os termos, tente novamente!'
    );

    yield put(signInFaileru());
  }
}

export function setToken({payload}) {
  if (!payload) return;
  const {token} = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = ` Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
  takeLatest('@auth/ACCEPT_REGULATION', acceptRegulationUp),
  takeLatest('@user/SIGN_UP_SUCCESS', signUp),
]);
