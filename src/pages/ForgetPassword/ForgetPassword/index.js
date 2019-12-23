import React, {useRef, useState, useEffect} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import Background from '~/components/Background';
import Loading from '~/components/Loading';
import api from '~/services/api';

import {
  Container,
  Title,
  Separator,
  Form,
  FormInput,
  SubmitButton,
} from './styles';

export default function ForgetPassword({navigation}) {
  const email = navigation.getParam('email');
  const token = navigation.getParam('token');

  const [loading, setLoading] = useState(false);

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
  }, []);

  async function handleSubmit() {
    setLoading(true);
    await api
      .put(`proccess_active_count/new_code_active`, {
        data: {
          email,
          password,
          confirmPassword,
          token,
        },
      })
      .then(() => {
        setLoading(false);
        Alert.alert(
          'Sucesso',
          `Novo token criando com sucesso, acesse sua conta de email para vê o código de ativação!`
        );
      })
      .catch(error => {
        setLoading(false);
        console.log('====>>>::', error);
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '401' || final === '403') {
          Alert.alert('Error', 'Não foi gerar novo token, tente novamente!');
        }
      });
  }

  return (
    <Background>
      <Container>
        <Title>Redefina a senha</Title>
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <Form>
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua nova senha"
            ref={passwordRef}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current.focus()}
            value={password}
            onChangeText={setPassword}
          />
          <Separator />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Confirmação de senha"
            ref={confirmPasswordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <SubmitButton onPress={handleSubmit}>Atualizar senha</SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}

ForgetPassword.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
