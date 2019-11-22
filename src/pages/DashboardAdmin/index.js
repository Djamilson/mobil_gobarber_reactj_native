import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {withNavigationFocus} from 'react-navigation';
import PropTypes from 'prop-types';
import Modal from '~/components/Modal';

import TermosCondicoes from '~/components/TermosCondicoes';

import {signOut} from '~/store/modules/auth/actions';
import api from '~/services/api';

import Background from '~/components/Background';
import AppointmentAdmin from '~/components/AppointmentAdmin';

import {Container, Heder, Title, Icons, List} from './styles';
import statusAppointment from '~/enum/appointments';

function Dashboard({isFocused}) {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePrivacy, setIsModalVisiblePrivacy] = useState(false);

  function toggleModalPrivacy() {
    setIsModalVisiblePrivacy(!isModalVisiblePrivacy);
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  async function loadAppointments(page = 1) {
    const response = await api.get(`appointments/provider?page=${page}`);
    console.log('Meus dados: ', response.data);
    setAppointments(response.data);
  }

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id) {
    // const response = await api.delete(`appointments/${id}`);
    const response = await api.get(`appointment/${id}/provider`, {
      params: {
        status: statusAppointment.cancelado,
      },
    });

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

  function mudaStatus(appointment_id, status) {
    const novoStatus = appointments.map(appointment =>
      appointment.id === appointment_id
        ? {
            ...appointment,
            status,
          }
        : appointment
    );

    setAppointments(novoStatus);
  }

  async function onAtender(appointmentId) {
    const response = await api.get(`appointment/${appointmentId}/provider`, {
      params: {
        status: statusAppointment.atendendo,
      },
    });
    mudaStatus(appointmentId, response.data.status);
  }

  async function onFinally(appointmentId) {
    const response = await api.get(`appointment/${appointmentId}/finally`, {
      params: {
        status: statusAppointment.finalizado,
      },
    });

    setAppointments(response.data);
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

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
        <Heder>
          <Title>Todos agendamento de Hoje</Title>

          <Icons>
            <TouchableOpacity onPress={toggleModal}>
              <IconFontAwesome5
                name="sign-out-alt"
                size={26}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleModalPrivacy}>
              <FontAwesome
                name="gear"
                size={26}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </Icons>
        </Heder>

        <List
          data={appointments}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <AppointmentAdmin
              onCancel={() => handleChamaCancel(item.id)}
              onAtender={() => onAtender(item.id)}
              onFinally={() => onFinally(item.id)}
              data={item}
            />
          )}
        />
      </Container>
      <Modal
        toggleModal={toggleModal}
        handleLogout={handleLogout}
        isModalVisible={isModalVisible}>
        Tem certeza que deseja sair do Gobarber?
      </Modal>

      <TermosCondicoes
        toggleModal={toggleModalPrivacy}
        isModalVisible={isModalVisiblePrivacy}
      />
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
