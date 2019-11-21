import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {TouchableOpacity, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconMa from 'react-native-vector-icons/MaterialCommunityIcons';

import {withNavigationFocus} from 'react-navigation';
import PropTypes from 'prop-types';
import Modal from '~/components/Modal';

import TermosCondicoes from '~/components/TermosCondicoes';

import {signOut} from '~/store/modules/auth/actions';
import api from '~/services/api';

import Background from '~/components/Background';
import AppointmentFila from '~/components/AppointmentFila';

import {Container, Heder, Title, Icons, List} from './styles';

function Fila({isFocused}) {
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
    const response = await api.get(`appointmentsfila?page=${page}`);
    console.log('Fila:', response.data);
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

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
        <Heder>
          <Title>Fila de clientes presentes</Title>

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
            <AppointmentFila
              onCancel={() => handleChamaCancel(item.id)}
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
  return <IconMa name="hail" size={20} color={tintColor} />;
}

TabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Fila.navigationOptions = {
  tabBarLabel: 'Fila',
  tabBarIcon: TabBarIcon,
};

Fila.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

export default withNavigationFocus(Fila);
