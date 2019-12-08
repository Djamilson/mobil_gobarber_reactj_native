import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';

import {acceptionRegulation, signOut} from '~/store/modules/auth/actions';

import {
  Container,
  Content,
  Title,
  Regulation,
  ApproveButton,
  ApproveButtonText,
} from './styles';

export default function SelectProvider({navigation}) {
  const dispatch = useDispatch();

  function handleAcceptRegulation() {
    dispatch(acceptionRegulation());
    navigation.navigate('App');
  }

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
        <Content>
          <Title>Privacidade e Termos</Title>
          <Regulation>
            Para criar uma Conta do GoBarber, você precisa concordar com os
            Termos de Serviços abaixo.
            {'\n\n'}
            Além disso, quando você cria uma conta, nós processamos suas
            informações conforme descrito na nossa Política de Privacidade,
            incluindo estes pontos-chave:
            {'\n\n'}
            Os dados que processamos quando você usa o GoBarber Quando você
            configura uma Conta do GoBarber, nós armazenamos as informações
            fornecidas, como seu nome e endereço de e-mail.
            {'\n\n'}
            Quando você usa o serviço do GoBarber para ação como fazer um
            agendamento de horário nós armazenamos as informações que você cria.
            Também processamos os tipos de informação descritos acima quando
            você usa o app ou site que usam serviço do GoBarber.
            {'\n\n'}Por que os processamos Processamos esses dados para os fins
            descritos na nossa política, incluindo o seguinte:
            {'\n\n'}
            Melhorar a qualidade dos nossos serviços e desenvolver novos;
            Melhorar a segurança, protegendo contra fraudes e abusos. Você
            poderá revogar seu consentimento no futuro sempre que quiser.
          </Regulation>
        </Content>
        <ApproveButton onPress={handleAcceptRegulation}>
          <ApproveButtonText>Aceitar</ApproveButtonText>
        </ApproveButton>
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({navigation}) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}>
      <Icon name="chevron-left" size={30} color="#FFF" />
    </TouchableOpacity>
  ),
});

SelectProvider.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
