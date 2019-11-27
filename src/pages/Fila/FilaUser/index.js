import React, {useEffect, useState} from 'react';

import {TouchableOpacity, Alert} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Loading from '~/components/Loading';
import Message from '~/components/Message';

import api from '~/services/api';

import Background from '~/components/Background';
import AppointmentFila from '~/components/AppointmentFila';

import {Container, Heder, List} from './styles';

export default function FilaUser({navigation}) {
  const [appointments, setAppointments] = useState([]);
  const provider = navigation.getParam('provider');
  const [loading, setLoading] = useState(false);

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
                onCancel={() => handleChamaCancel(item.id)}
                data={item}
              />
            )}
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
