import React, {useRef, useState} from 'react';
import {Image, Alert} from 'react-native';

import PropTypes from 'prop-types';

import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';

export default function ResetPassword({navigation}) {
  const emailRef = useRef();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    await api
      .post(`recuperarpassword/${email}`)
      .then(() => {
        setLoading(false);
        navigation.navigate('SignIn');
        Alert.alert(
          'Sucesso',
          `Foi enviado instruções de recuperação de senha, para o email ${email}, acesse para criar nova senha!`
        );
      })
      .catch(error => {
        setLoading(false);
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '401' || final === '403') {
          Alert.alert(
            'Error',
            'Não foi possível encontra um usuário, crie sua conta!'
          );
        }
      });
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={email}
            onChangeText={setEmail}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Envair
          </SubmitButton>
        </Form>
        <SignLink onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

ResetPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
