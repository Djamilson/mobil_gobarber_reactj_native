import {formatRelative, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';
import socket from 'socket.io-client';
import Appointment from '~/components/Appointment';
import Background from '~/components/Background';
import Haeder from '~/components/Header';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import MessageCanceled from '~/components/MessageCancel';
import host from '~/config/host';
import enumAppointment from '~/enum/appointments';
import api from '~/services/api';
import {Container, List} from './styles';

function Dashboard({isFocused}) {
  const profile = useSelector(state => state.user.profile);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageCanceled, setMessageCanceled] = useState(false);
  const [dataFormat, setDataFormat] = useState();
  const [appointmentSelect, setAppointmentSelect] = useState('');

  function dateFormatted(time) {
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  async function loadAppointments(page = 1) {
    setLoading(true);
    await api
      .get(`appointments?page=${page}`)
      .then(res => {
        setLoading(false);
        setAppointments(res.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  function closeMessage() {
    setMessageCanceled(!messageCanceled);
  }

  useEffect(() => {
    function subscribeToNewFiles(id) {
      const io = socket(`http://${host.WEBHOST}:${host.PORT}`, {
        query: {id, value: 'dashboard'},
      });

      io.on('atender', dta => {
        const listTes = appointments.map(appointment => {
          if (appointment.id === dta.id) {
            const newap = {
              ...appointment,
              status: enumAppointment.atendendo,
            };

            return newap;
          }
          return appointment;
        });

        setAppointments(listTes);
      });

      io.on('finally', dta => {
        console.log('kkkk:::', dta);
        console.log('ID:::', dta.id);
        console.log('finally::', appointments);
        if (
          dta.id !== null &&
          dta.id !== undefined &&
          appointments !== undefined &&
          appointments.length > 0
        ) {
          let appSelected = {};

          const listTes = appointments
            .map(appointment => {
              if (appointment.id !== dta.id) {
                return appointment;
              }

              console.log('appointment', appointment);
              appSelected = appointment;
            })
            .filter(x => (x !== undefined ? x : ''));

          console.log('Data', appointmentSelect);

          setAppointments(listTes);

          if (dta.status === enumAppointment.cancelado) {
            setMessageCanceled(!messageCanceled);
            setAppointmentSelect(appSelected.provider.name);
            console.log('Tenho que guarda esse data: ', appointmentSelect);
            console.log(
              'appSelected.provider.name: ',
              appSelected.provider.name
            );
            setDataFormat(dateFormatted(appSelected.date));
          }
        }
      });
    }

    if (isFocused) {
      subscribeToNewFiles(profile.id);
    }
  }, [
    appointmentSelect,
    appointments,
    appointments.length,
    isFocused,
    messageCanceled,
    profile,
  ]);

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
      `Cancelar agendamento`,
      'Tem certeza que deseja cancelar esse agendamento?',
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
              <Appointment
                onCancel={() => handleChamaCancel(item.id)}
                data={item}
              />
            )}
          />
        )}

        {messageCanceled && (
          <MessageCanceled
            nameIcon="exclamation-triangle"
            closeMessage={closeMessage}
            dataFormat={dataFormat}
            appointmentSelect={appointmentSelect}
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
};

export default withNavigationFocus(Dashboard);
