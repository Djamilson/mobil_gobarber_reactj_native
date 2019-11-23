import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconGroupButton from 'react-native-vector-icons/FontAwesome';

import Background from '~/components/Background';
import api from '~/services/api';

import enumAppointments from '~/enum/appointments';
import Busca from '~/components/Busca';

import {
  Container,
  ProvidersList,
  Provider,
  ContainerLogo,
  Logo,
  Avatar,
  Name,
  Title,
  Text,
  GroupButton,
  ButtonPresencial,
  ButtonAgendar,
} from './styles';

export default function SelectProvider({navigation}) {
  const [providers, setProviders] = useState([]);

  const [companySelect, setCompanySelect] = useState({});
  const [optionAgendar, setOptionAgendar] = useState(false);

  const routerAgendar = 'appointments';

  async function loadProvider() {
    const response = await api.get('providers');
    setProviders(response.data);
  }

  function selectoptionAgendar() {
    setOptionAgendar(!optionAgendar);
  }

  function handleSelectHour(provider_ent) {
    const provider = {
      ...provider_ent,
      status: enumAppointments.aguardando,
      agendar: optionAgendar,
    };

    if (!optionAgendar) {
      const newprovider = {
        ...provider_ent,
        status: enumAppointments.aguardando,
        agendar: optionAgendar,
      };

      const data = new Date();
      const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
      const time = data2.toISOString().replace(/\.\d{3}Z$/, '');

      console.log('data:', data);
      console.log('data2:', data2);
      console.log('Meu Time:', time);

      return navigation.navigate('Confirm', {
        provider: newprovider,
        time,
        router: routerAgendar,
      });
    }
    return navigation.navigate('SelectDateTime', {
      provider,
      router: routerAgendar,
    });
  }

  useEffect(() => {
    loadProvider();
  }, []);

  async function handleSelectProvider(value) {
    if (value !== null) {
      const response = await api.get(`users/${value.id}`);
      setProviders(response.data);
      setCompanySelect(value);
    } else {
      loadProvider();
      setCompanySelect({});
    }
  }

  return (
    <Background>
      <Container>
        <Busca handleSelectProvider={handleSelectProvider} />
        <GroupButton>
          <ButtonPresencial
            onPress={() => selectoptionAgendar()}
            disabled={!optionAgendar}>
            {optionAgendar ? null : (
              <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
            )}
            <Text>Entra na Fila</Text>
          </ButtonPresencial>
          <ButtonAgendar
            onPress={() => selectoptionAgendar()}
            disabled={optionAgendar}>
            {optionAgendar ? (
              <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
            ) : null}

            <Text>Agendar</Text>
          </ButtonAgendar>
        </GroupButton>

        {companySelect.logo ? (
          <ContainerLogo>
            <Logo
              source={{
                uri: companySelect.logo ? companySelect.logo.url : null,
              }}
            />
            <Title>{companySelect.name} </Title>
          </ContainerLogo>
        ) : null}

        <ProvidersList
          data={providers}
          keyExtractor={provider => String(provider.id)}
          renderItem={({item: provider}) => (
            <Provider onPress={() => handleSelectHour(provider)}>
              <Avatar
                source={{
                  uri: provider.avatar
                    ? provider.avatar.url
                    : `https://api.adorable.io/avatar/50/${provider.name}.png`,
                }}
              />
              <Name>{provider.name}</Name>
            </Provider>
          )}
        />
      </Container>
    </Background>
  );
}

SelectProvider.navigationOptions = ({navigation}) => ({
  title: 'Selecione o prestador',
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Dashboard');
      }}>
      <Icon name="chevron-left" size={30} color="#FFF" />
    </TouchableOpacity>
  ),
});

SelectProvider.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
