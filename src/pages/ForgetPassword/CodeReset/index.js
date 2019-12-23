import React, {useRef, useEffect, useState} from 'react';
import {Image, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import logo from '~/assets/logo.png';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/pages/SignUp/Message';
import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SignLink,
  SignLinkText,
  Name,
  SubmitButton,
} from './styles';

export default function CodeReset({navigation}) {
  const email = navigation.getParam('email');
  const code_active_Ref = useRef();
  const [code_active, setCode_active] = useState('');

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    async function loadToken() {
      setLoading(true);
      await api
        .get(`mobile/valida_code_forget_password/${email}`)
        .then(res => {
          setLoading(false);
          setToken(res.data);
        })
        .catch(() => {
          setLoading(false);

          Alert.alert(
            'Error CodeReset',
            'Gere um novo token, tente novamente!'
          );
          // }
        });
    }
    loadToken();
  }, [email]);

  function handlerSignIn() {
    navigation.navigate('SignIn');
  }

  async function newCodeActive() {
    setLoading(true);
    await api
      .put(`proccess_active_count/new_code_active`, {
        data: {
          email,
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
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '401' || final === '403') {
          Alert.alert('Error', 'Não foi gerar novo token, tente novamente!');
        }
      });
  }

  async function handleValidateCodeReset() {
    setLoading(true);

    if (code_active === token.code_active) {
      setLoading(false);
      navigation.navigate('ForgetNewPassword', {token});

      Alert.alert('Sucesso', `Agora redefina sua senha!`);
      return;
    }

    setLoading(false);

    Alert.alert(
      'Atenção! ',
      `Código de validação incorreto, tente novamente, ou crie novo código!`
    );
  }

  return (
    <Background>
      <Container>
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <Message nameIcon="exclamation-triangle" email={email} />
        <Image source={logo} />
        <Name>Valida o código de redefinição de senha</Name>
        <Form>
          <FormInput
            icon="lock-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Código de redefinição de senha"
            ref={code_active_Ref}
            returnKeyType="send"
            onSubmitEditing={handleValidateCodeReset}
            value={code_active}
            onChangeText={setCode_active}
          />

          <SubmitButton loading={false} onPress={handleValidateCodeReset}>
            Validar código
          </SubmitButton>
        </Form>
        <SignLink onPress={newCodeActive}>
          <SignLinkText>Novo código de redefinição de senha</SignLinkText>
        </SignLink>

        <SignLink onPress={handlerSignIn}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

CodeReset.navigationOptions = ({navigation}) => ({
  title: 'Confirmar Agendamento',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={30} color="#FFF" />
    </TouchableOpacity>
  ),
});

CodeReset.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
