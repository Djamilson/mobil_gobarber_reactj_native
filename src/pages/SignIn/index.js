import React, {useRef, useState, useEffect} from 'react';
import {Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import api from '~/services/api';
import {signInRequest} from '~/store/modules/auth/actions';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
  ResetPasswordLink,
  ResetPasswordLinkText,
} from './styles';

export default function SignIn({navigation}) {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);

  const passwordRef = useRef();

  const [loadingg, setLoadingg] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@gobarberAtivo').then(gobarberAtivo => {
      console.log('AsyncStorege: gobarberAtivo', gobarberAtivo);

      if (!gobarberAtivo) {
        AsyncStorage.getItem('@emailgobarber').then(async emailgobarber => {
          console.log('AsyncStorege: Loggg ', emailgobarber);

          if (emailgobarber) {
            setLoadingg(true);
            await api
              .get(`mobile/user/${emailgobarber}`)
              .then(res => {
                setLoadingg(false);
                console.log('Login Meu token:::: ', res.data);
                const {is_verified} = res.data;
                if (!is_verified) {
                  navigation.navigate('SignUpActive', {
                    email: emailgobarber,
                  });
                }
              })
              .catch(error => {
                setLoadingg(false);

                console.log('Login error:: ', error);
              });
          }
        });
      }
    });
  }, [navigation]);

  function navPageActiveCount() {
    navigation.navigate('SignUpActive', {
      email,
    });
  }

  function handleSubmit() {
    dispatch(signInRequest(email, password, navPageActiveCount));
  }

  return (
    <Background>
      <Container>
        {loadingg && <Loading loading={loadingg}>Carregando ...</Loading>}
        <Image source={logo} />
        <Form>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha secreta"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />
          <SubmitButton loading={loading} onPress={handleSubmit}>
            Acessar
          </SubmitButton>
        </Form>
        <SignLink onPress={() => navigation.navigate('SignUp')}>
          <SignLinkText>Criar conta</SignLinkText>
        </SignLink>
        <ResetPasswordLink
          onPress={() => navigation.navigate('ForgetFormEmail')}>
          <ResetPasswordLinkText>Esqueceu a senha? </ResetPasswordLinkText>
        </ResetPasswordLink>
      </Container>
    </Background>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
