import { formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import socket from 'socket.io-client';
import AppointmentFila from '~/components/AppointmentFila';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import MessageCanceled from '~/components/MessageCancel';
import host from '~/config/host';
import enumAppointment from '~/enum/appointments';
import api from '~/services/api';
import { Container, Heder, List } from './styles';

export default function FilaUser({navigation}) {
  const provider = navigation.getParam('provider');

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const profile = useSelector(state => state.user.profile);

  const [messageCanceled, setMessageCanceled] = useState(false);
  const [dataFormat, setDataFormat] = useState();
  const [appointmentSelect, setAppointmentSelect] = useState('');

  function dateFormatted(time) {
    return formatRelative(parseISO(time), new Date(), {
      locale: pt,
    });
  }

  function closeMessage() {
    setMessageCanceled(!messageCanceled);
  }

  function setSelecioneProvaider(item) {
    setAppointmentSelect(item.provider.name);
    setDataFormat(dateFormatted(item.data));
  }

  useEffect(() => {
    function subscribeToNewFiles(id) {
      const io = socket(`http://${host.WEBHOST}:${host.PORT}`, {
        query: {id, value: 'fila'},
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
        console.log('Pela a barba do profeta:', dta.listAppointments);
        const {
          listAppointments,
          status: statusNovo,
          appointmentSelect: appoint,
          user_id,
        } = dta;

        if (
          appoint.status === enumAppointment.cancelado &&
          user_id === profile.id
        ) {
          setMessageCanceled(!messageCanceled);
          console.log('Tenho que guarda esse data: ', appoint);
          setAppointments(listAppointments);
          //setDataFormat(dateFormatted(appoint.date));
        }
      });
    }

    subscribeToNewFiles(profile.id);
  }, [
    appointmentSelect,
    appointments,
    appointments.length,
    messageCanceled,
    profile.id,
  ]);

  useEffect(() => {
    async function loadAppointments(page = 1) {
      setLoading(true);
      await api
        .get(`appointments/${provider.id}/fila?page=${page}`)
        .then(res => {
          setLoading(false);
          console.log('Estou aqui res.data', res.data);
          console.log('ççççç aqui res.data', res.data);

          setAppointments(res.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    loadAppointments();
  }, [provider.id]);

  async function handleCancel(id) {
    setLoading(true);
    await api
      .delete(`appointments/${id}`)
      .then(res => {
        setLoading(false);
        Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
        setAppointments(
          appointments.map(appointment =>
            appointment.id === id
              ? {
                  ...appointment,
                  canceled_at: res.data.canceled_at,
                }
              : appointment
          )
        );
      })
      .catch(() => {
        setLoading(false);
        Alert.alert(
          'Atenção',
          'Não foi possível fazer o cancelamento no momento, tente novamente!'
        );
      });
  }

  function handleChamaCancel(id, item) {
    Alert.alert(
      `Cancelar agendamento`,
      'Tem certeza que cancelar esse agendamento?',
      [
        {
          text: 'Não',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: () => {
            setSelecioneProvaider(item);
            handleCancel(id);
          },
        },
      ],
      {cancelable: false}
    );
  }

  return (
    <Background>
      <Container>
        <Heder />
        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && appointments.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Não tem usuário na fila no momento!
          </Message>
        ) : (
          <List
            data={appointments}
            keyExtractor={item => String(item.id)}
            renderItem={({item}) => (
              <AppointmentFila
                onCancel={() => handleChamaCancel(item.id, item)}
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

FilaUser.navigationOptions = ({navigation}) => ({
  title: 'Fila de clientes presentes',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={30} color="#FFF" />
    </TouchableOpacity>
  ),
});

FilaUser.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
