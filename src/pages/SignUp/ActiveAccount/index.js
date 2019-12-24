import React, {useRef, useEffect, useState} from 'react';
import {Image, Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import AsyncStorage from '@react-native-community/async-storage';

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

export default function ActiveAccount({navigation}) {
  const email = navigation.getParam('email');
  const code_active_Ref = useRef();
  const [code_active, setCode_active] = useState('');

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  function handlerSignIn() {
    navigation.navigate('SignIn');
  }

  useEffect(() => {
    async function loadToken() {
      setLoading(true);
      await api
        .get(`mobile/active_count/${email}`)
        .then(res => {
          setLoading(false);
          console.log('Token::', res.data);
          setToken(res.data.token);
        })
        .catch(error => {
          setLoading(false);

          const str = error.toString();
          const final = str.replace(/\D/g, '');

          if (final === '401') {
            navigation.navigate('SignIn');
            Alert.alert(
              'Atenção!',
              'Esse email já esta ativo, acesse sua conta!'
            );
          }
        });
    }
    loadToken();
  }, [email, navigation]);

  const deleteEmailStorage = async () => {
    await AsyncStorage.removeItem('@emailgobarber');
  };

  const saveStorage = async () => {
    await AsyncStorage.setItem('@gobarberAtivo', 'true');
  };

  async function newCodeActive() {
    setLoading(true);
    await api
      .put(`proccess_active_count/new_code_active`, {
        data: {
          email,
        },
      })
      .then(res => {
        setLoading(false);
        setToken(res.data);
        console.log('New Código:', res.data);
        Alert.alert(
          'Sucesso',
          `Novo código criando com sucesso, acesse seu email para vê o código de ativação!`
        );
      })
      .catch(error => {
        setLoading(false);
        const str = error.toString();
        const final = str.replace(/\D/g, '');

        if (final === '401' || final === '403') {
          Alert.alert('Error', 'Gerar um novo código, tente novamente!');
        }
      });
  }

  async function handleActiveCount() {
    setLoading(true);
    await api
      .put(`proccess_active_count`, {
        data: {
          email,
          code_active,
        },
      })
      .then(() => {
        setLoading(false);
        handlerSignIn();
        Alert.alert('Sucesso', `Conta ativada com sucesso!`);
        deleteEmailStorage();
        saveStorage();
      })
      .catch(error => {
        setLoading(false);
        setCode_active('');
        const str = error.toString();
        const final = str.replace(/\D/g, '');
        console.log('===> ', error);
        if (final === '400') {
          Alert.alert(
            'Error',
            'Código de ativação incorreto, crie um novo código ou tente novamente!'
          );
        }

        if (final === '402') {
          Alert.alert(
            'Error',
            'Código de ativação incorreto, tente novamente!'
          );
        }

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
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        <Message nameIcon="exclamation-triangle" email={email} />

        <Image source={logo} />
        <Name>Ativando sua conta</Name>
        <Form>
          <FormInput
            icon="lock-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Código de ativação"
            ref={code_active_Ref}
            returnKeyType="send"
            onSubmitEditing={handleActiveCount}
            value={code_active}
            onChangeText={setCode_active}
          />

          <SubmitButton loading={false} onPress={handleActiveCount}>
            Ativar Conta
          </SubmitButton>
        </Form>
        <SignLink onPress={newCodeActive}>
          <SignLinkText>Novo código de ativação</SignLinkText>
        </SignLink>

        <SignLink onPress={handlerSignIn}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>
      </Container>
    </Background>
  );
}

ActiveAccount.navigationOptions = ({navigation}) => ({
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

ActiveAccount.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
