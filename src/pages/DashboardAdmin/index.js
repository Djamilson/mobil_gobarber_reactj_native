import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {withNavigationFocus} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import socket from 'socket.io-client';
import AppointmentAdmin from '~/components/AppointmentAdmin';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import Modal from '~/components/Modal';
import TermosCondicoes from '~/components/TermosCondicoes';
import host from '~/config/host';
import statusAppointment from '~/enum/appointments';
import api from '~/services/api';
import {signOut} from '~/store/modules/auth/actions';
import {Container, Heder, Icons, List, Title} from './styles';

function Dashboard({isFocused}) {
  const dispatch = useDispatch();
  const [appointments, setAppointments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePrivacy, setIsModalVisiblePrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = useSelector(state => state.user.profile);

  function toggleModalPrivacy() {
    setIsModalVisiblePrivacy(!isModalVisiblePrivacy);
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  async function loadAppointments(page = 1) {
    setLoading(true);
    await api
      .get(`appointments/provider?page=${page}`)
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
        console.log('MMMM:', res.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    function subscribeToNewFiles(id) {
      const io = socket(`http://${host.WEBHOST}:${host.PORT}`, {
        query: {id, value: 'dashboard'},
      });

      io.on('appointment', dta => {
        console.log('data::: ', dta);
        setAppointments(dta);
      });
    }

    if (isFocused) {
      subscribeToNewFiles(profile.id);
    }
  }, [appointments, isFocused, profile]);

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  async function handleCancel(id, idProvider) {
    setLoading(true);
    await api
      .get(`appointment/${id}/finally`, {
        params: {
          status: statusAppointment.cancelado,
          idProvider,
        },
      })
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
        Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      })
      .catch(() => {
        setLoading(false);

        Alert.alert(
          'Atenção',
          'Não foi possível fazer o cancelamento, tente novamente!'
        );
      });
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

  async function onAtender(appointmentId, index) {
    if (index !== 0) {
      Alert.alert(
        'Atenção !',
        'Não pode atender esse cliente no momento, você deve finalizar o atendimento anterior!'
      );
      return;
    }

    setLoading(true);
    await api
      .get(`appointment/${appointmentId}/provider`, {
        params: {
          status: statusAppointment.atendendo,
        },
      })
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
        mudaStatus(appointmentId, res.data.status);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  async function onFinally(appointmentId) {
    setLoading(true);
    await api
      .get(`appointment/${appointmentId}/finally`, {
        params: {
          status: statusAppointment.finalizado,
        },
      })
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function handleChamaCancel(id, idProvider) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que deseja cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => handleCancel(id, idProvider)},
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
        {loading && <Loading loading={loading}>Carregando ...</Loading>}

        {appointments.length !== 0 ? (
          <List
            data={appointments}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <AppointmentAdmin
                onAtender={() => onAtender(item.id, item.index)}
                onFinally={() => onFinally(item.id)}
                onCancel={() => handleChamaCancel(item.id, item.user.id)}
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
