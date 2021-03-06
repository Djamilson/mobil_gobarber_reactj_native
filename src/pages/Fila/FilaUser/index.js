import React, {useEffect, useState, useMemo} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import {formatRelative, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import AppointmentFila from '~/components/AppointmentFila';
import Background from '~/components/Background';
import Loading from '~/components/Loading';
import Message from '~/components/Message';
import MessageCanceled from '~/components/MessageCancel';
import host from '~/config/host';
import enumAppointment from '~/enum/appointments';
import api from '~/services/api';

import {Container, Heder, List} from './styles';

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

  const {id} = profile;

  const io = useMemo(
    () =>
      socket(`http://${host.WEBHOST}:${host.PORT}`, {
        query: {id, value: 'fila'},
      }),
    [id]
  );

  useEffect(() => {
    function subscribeToNewFiles() {
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
        const {listAppointments, appointmentSelect: appoint, user_id} = dta;

        if (dta.status === enumAppointment.cancelado && user_id === id) {
          setAppointmentSelect(appoint.provider.name);
          setMessageCanceled(true);
          setDataFormat(dateFormatted(appoint.date));
        }
        setAppointments(listAppointments);
      });

      io.on('cancel', novaLista => {
        setAppointments(novaLista);
      });
    }

    subscribeToNewFiles();
  }, [
    appointmentSelect,
    appointments,
    appointments.length,
    id,
    io,
    messageCanceled,
  ]);

  useEffect(() => {
    async function loadAppointments(page = 1) {
      setLoading(true);
      await api
        .get(`appointments/${provider.id}/fila?page=${page}`)
        .then(res => {
          setLoading(false);
          setAppointments(res.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    loadAppointments();
  }, [provider.id]);

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

  async function handleCancel(idAppointmente, oldStatus) {
    // setLoading(true);
    Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');

    mudaStatus(idAppointmente, enumAppointment.cancelado);

    await api.delete(`appointments/${idAppointmente}`).catch(() => {
      mudaStatus(idAppointmente, oldStatus);
      Alert.alert(
        'Atenção',
        'Não foi possível fazer o cancelamento no momento, tente novamente!'
      );
    });
  }

  function handleChamaCancel(idAppointmente, item) {
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
            handleCancel(idAppointmente, item.status);
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

        {messageCanceled && dataFormat !== undefined && (
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
