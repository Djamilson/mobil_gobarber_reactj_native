import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconGroupButton from 'react-native-vector-icons/FontAwesome';

import Background from '~/components/Background';
import api from '~/services/api';

import enumAppointments from '~/enum/appointments';
import Busca from '~/components/Busca';
import Loading from '~/components/Loading';
import Message from '~/components/Message';

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
  const [loading, setLoading] = useState(false);

  const routerAgendar = 'appointments';

  async function loadProvider() {
    setLoading(true);
    await api
      .get(`providers`)
      .then(res => {
        setLoading(false);
        setProviders(res.data);
      })
      .catch(() => {
        setLoading(false);
      });
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
      setLoading(true);
      await api
        .get(`users/${value.id}`)
        .then(res => {
          setLoading(false);
          setProviders(res.data);
          setCompanySelect(value);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      loadProvider();
      setCompanySelect({});
    }
  }

  return (
    <Background>
      <Container>
        <Busca handleSelectProvider={handleSelectProvider} />
        {companySelect.logo && companySelect.logo.url && (
          <ContainerLogo>
            <Logo
              source={{
                uri: companySelect.logo
                  ? companySelect.logo.url
                  : `https://api.adorable.io/avatar/50/${companySelect.name}.png`,
              }}
            />

            <Title>{companySelect.name}</Title>
          </ContainerLogo>
        )}
        {!loading && (
          <GroupButton
            test={companySelect.logo && companySelect.logo.url && true}>
            <ButtonPresencial
              onPress={() => selectoptionAgendar()}
              disabled={!optionAgendar}>
              {!optionAgendar && (
                <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
              )}
              <Text>Entra na Fila</Text>
            </ButtonPresencial>
            <ButtonAgendar
              onPress={() => selectoptionAgendar()}
              disabled={optionAgendar}>
              {optionAgendar && (
                <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
              )}
              <Text>Agendar</Text>
            </ButtonAgendar>
          </GroupButton>
        )}

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && providers.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Ainda não temos prestador de serviços cadastrados!
          </Message>
        ) : (
          <ProvidersList
            test={companySelect.logo && companySelect.logo.url && true}
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
        )}
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
