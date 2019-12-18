import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '~/services/api';

import Background from '~/components/Background';
import DateInput from '~/components/DateInput';
import Message from '~/components/Message';

import Loading from '~/components/Loading';

import {Container, HourList, Hour, Title} from './styles';

export default function SelectDateTime({navigation}) {
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

  function showDateTimePicker() {
    setIsDateTimePickerVisible(true);
  }

  function hideDateTimePicker() {
    setIsDateTimePickerVisible(false);
  }

  const provider = navigation.getParam('provider');
  const router = navigation.getParam('router');

  useEffect(() => {
    async function loadAvailable() {
      setLoading(true);
      await api
        .get(`providers/${provider.id}/available`, {
          params: {
            date: date.getTime(),
          },
        })
        .then(res => {
          setLoading(false);
          setHours(res.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    loadAvailable();
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
        <DateInput
          date={date}
          onChange={setDate}
          hideDateTimePicker={hideDateTimePicker}
          showDateTimePicker={showDateTimePicker}
          isDateTimePickerVisible={isDateTimePickerVisible}
        />

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && hours.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Esse prestador não tem horário no momento!
          </Message>
        ) : (
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
