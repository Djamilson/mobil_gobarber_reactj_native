import React, {useEffect, useState, useMemo} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import socket from 'socket.io-client';

import AppointmentAdmin from '~/components/AppointmentAdmin';
import Background from '~/components/Background';
import Haeder from '~/components/Header';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import host from '~/config/host';
import statusAppointment from '~/enum/appointments';
import api from '~/services/api';

import {Container, List} from './styles';

function Dashboard({isFocused, navigation}) {
  const [appointments, setAppointments] = useState([]);
  const [appointmentsOld, setAppointmentsOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useSelector(state => state.user.profile);

  async function loadAppointments(page = 1) {
    setLoading(true);
    await api
      .get(`appointments/provider?page=${page}`)
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function removerAppoint(idAppointment) {
    setAppointments(
      appointments
        .filter(appointment => appointment.id !== idAppointment)
        .map((ap, index) => {
          return {...ap, index};
        })
    );
  }

  const {id} = profile;

  const io = useMemo(
    () =>
      socket(`http://${host.WEBHOST}:${host.PORT}`, {
        query: {id, value: 'dashboard_admin'},
      }),
    [id]
  );

  useEffect(() => {
    function subscribeToNewFiles() {
      io.on('appointment', dta => {
        setAppointments(dta);
      });

      io.on('cancel', idAppointment => {
        const {id: id_} = idAppointment;
        removerAppoint(Number(id_));
      });
    }

    if (isFocused) {
      subscribeToNewFiles();
    }
  }, [io, isFocused, removerAppoint]);

  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

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

  async function handleCancel(idAppointment, idProvider) {
    setAppointmentsOld(appointments);
    removerAppoint(idAppointment);

    await api
      .get(`appointment/${idAppointment}/finally`, {
        params: {
          status: statusAppointment.cancelado,
          idProvider,
        },
      })
      .then(() => {
        Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
      })
      .catch(() => {
        setAppointments(appointmentsOld);
        Alert.alert(
          'Atenção',
          'Não foi possível fazer o cancelamento, tente novamente!'
        );
      });
  }

  async function onAtender(idAppointment, index) {
    if (index !== 0) {
      Alert.alert(
        'Atenção!',
        'Não pode atender esse cliente no momento, você deve finalizar o atendimento anterior!'
      );
      return;
    }

    mudaStatus(idAppointment, statusAppointment.atendendo);
    await api
      .get(`appointment/${idAppointment}/provider`, {
        params: {
          status: statusAppointment.atendendo,
        },
      })
      .catch(() => {
        mudaStatus(idAppointment, statusAppointment.aguardando);
        Alert.alert(
          'Atenção !',
          'Não foi possível fazer o atendimento, tente novamente!'
        );
      });
  }

  async function onFinally(idAppointment) {
    const fin = appointments
      .filter(appoint => {
        if (appoint.id !== idAppointment) {
          return appoint;
        }
      })
      .map(p => {
        const objCopy = {...p};

        objCopy.index -= 1;
        return objCopy;
      });
    setAppointments(fin);

    await api
      .get(`appointment/${idAppointment}/finally`, {
        params: {
          status: statusAppointment.finalizado,
        },
      })
      .catch(() => {
        //  setLoading(false);
        mudaStatus(idAppointment, statusAppointment.atendendo);
        Alert.alert(
          'Atenção !',
          'Não foi possível finalizar o atendimento, tente novamente!'
        );
      });
  }

  function handleChamaCancel(idAppointment, idProvider) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que deseja cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Sim', onPress: () => handleCancel(idAppointment, idProvider)},
      ],
      {cancelable: false}
    );
  }

  return (
    <Background>
      <Container>
        <Haeder title="Todos agendamento de Hoje" navigation={navigation} />
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Você não tem horário agendado no momento!
          </Message>
        ) : (
          <List
            data={appointments}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <AppointmentAdmin
                onAtender={() => onAtender(item.id, item.index)}
                onFinally={() => onFinally(item.id)}
                onCancel={() =>
                  handleChamaCancel(item.id, item.user.id, item.status)
                }
                data={item}
              />
            )}
          />
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigationFocus(Dashboard);
