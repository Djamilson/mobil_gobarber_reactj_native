import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {withNavigationFocus} from 'react-navigation';
import PropTypes from 'prop-types';

import api from '~/services/api';

import Background from '~/components/Background';
import Appointment from '~/components/Appointment';
import Message from '~/components/Message';
import Haeder from '~/components/Header';
import {Container, List} from './styles';

function Dashboard({isFocused}) {
  const [appointments, setAppointments] = useState([]);

  async function loadAppointments(page = 1) {
    const response = await api.get(`appointments?page=${page}`);

    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id) {
    const response = await api.delete(`appointments/${id}`);
    Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
    setAppointments(
      appointments.map(appointment =>
        appointment.id === id
          ? {
              ...appointment,
              canceled_at: response.data.canceled_at,
            }
          : appointment
      )
    );
  }

  function handleChamaCancel(id) {
    Alert.alert(
      `Deletar  agendamento`,
      'Tem certeza que deseja deletar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => handleCancel(id)},
      ],
      {cancelable: false}
    );
  }

  return (
    <Background>
      <Container>
        <Haeder title="Agendamentos" />
        {appointments.length !== 0 ? (
          <List
            data={appointments}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <Appointment
                onCancel={() => handleChamaCancel(item.id)}
                data={item}
              />
            )}
          />
        ) : (
          <Message nameIcon="exclamation-triangle">
            Você não tem horário agendado no momento!
          </Message>
        )}
      </Container>
    </Background>
  );
}

function TabBarIcon({tintColor}) {
  return <Icon name="event" size={20} color={tintColor} />;
}

TabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.navigationOptions = {
  tabBarLabel: 'Agendamentos',
  tabBarIcon: TabBarIcon,
};

Dashboard.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Dashboard);
