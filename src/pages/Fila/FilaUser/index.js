import React, {useEffect, useState} from 'react';

import {TouchableOpacity, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';
import AppointmentFila from '~/components/AppointmentFila';

import {Container, Heder, List} from './styles';

export default function FilaUser({navigation}) {
  const [appointments, setAppointments] = useState([]);

  const provider = navigation.getParam('provider');
 

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePrivacy, setIsModalVisiblePrivacy] = useState(false);

  console.log('Provider :: ', provider);
  console.log('Provider :: ', provider.id);


  useEffect(() => {
    async function loadAppointments(page = 1) {
      const response = await api.get(
        `appointments/${provider.id}/fila?page=${page}`
      );
      console.log('Fila:', response.data);
      setAppointments(response.data);
    }
    loadAppointments();
  }, [provider.id]);

  function toggleModalPrivacy() {
    setIsModalVisiblePrivacy(!isModalVisiblePrivacy);
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

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
        <Heder />
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
