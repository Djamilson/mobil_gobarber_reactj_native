import React, {useMemo} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import {formatRelative, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Background from '~/components/Background';
import api from '~/services/api';

import {Container, Avatar, Name, Time, SubmitButton} from './styles';

export default function Confirm({navigation}) {
  const {id, status, agendar, name, avatar} = navigation.getParam('provider');

  const time = navigation.getParam('time');
  const router = navigation.getParam('router');

  const dateFormatted = useMemo(
    () =>
      formatRelative(parseISO(time), new Date(), {
        locale: pt,
      }),
    [time]
  );

  async function handleAddAppointment() {
    await api
      .post(router, {
        provider_id: id,
        date: time,
        status,
        agendar,
      })
      .catch(() => {
        Alert.alert(
          'Atenção',
          'Não foi possível adicionar o item no momento, tente novamente!'
        );
      });

    navigation.navigate('Dashboard');
  }

  return (
    <Background>
      <Container>
        <Avatar
          source={{
            uri: avatar
              ? avatar.url
              : `https://api.adorable.io/avatar/50/${name}.png`,
          }}
        />
        <Name>{name}</Name>
        <Time>{dateFormatted}</Time>
        <SubmitButton loading={false} onPress={handleAddAppointment}>
          Confirmar Agendamento
        </SubmitButton>
      </Container>
    </Background>
  );
}

Confirm.navigationOptions = ({navigation}) => ({
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

Confirm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
