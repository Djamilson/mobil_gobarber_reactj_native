import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';
import DateInput from '~/components/DateInput';

import {Container, HourList, Hour, Title, Message, Info, Name} from './styles';

export default function SelectDateTime({navigation}) {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);

  const provider = navigation.getParam('provider');
  const router = navigation.getParam('router');
  console.log('Provider :: ', provider);
  console.log('Provider :: ', provider.id);
  console.log('router :: ', router);

  useEffect(() => {
    async function loadAvailable() {
      const response = await api.get(`providers/${provider.id}/available`, {
        params: {
          date: date.getTime(),
        },
      });
      setHours(response.data);
    }
    loadAvailable();
    // [date, hours, provider.id]
  }, [date, provider.id]);

  function handleSelectHour(time) {
    navigation.navigate('Confirm', {
      provider,
      time,
      router,
    });
  }

  return (
    <Background>
      <Container>
        <DateInput date={date} onChange={setDate} />
        {hours.length !== 0 ? (
          <HourList
            data={hours}
            keyExtractor={item => item.time.id}
            renderItem={({item}) => (
              <Hour
                onPress={() => handleSelectHour(item.value)}
                enabled={item.available}>
                <Title> {item.time.horario}</Title>
              </Hour>
            )}
          />
        ) : (
          <Message>
            <Info>
              <Name> Usuário não tem horário cadastrado!</Name>
            </Info>
          </Message>
        )}
      </Container>
    </Background>
  );
}

SelectDateTime.navigationOptions = ({navigation}) => ({
  title: 'Selecione o horário',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={30} color="#FFF" />
    </TouchableOpacity>
  ),
});

SelectDateTime.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
