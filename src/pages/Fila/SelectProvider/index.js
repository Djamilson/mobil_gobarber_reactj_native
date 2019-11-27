import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Background from '~/components/Background';
import Message from '~/components/Message';
import Loading from '~/components/Loading';

import api from '~/services/api';

import {
  Container,
  ProvidersList,
  Provider,
  ContainerLogo,
  Logo,
  Avatar,
  Name,
  Title,
} from './styles';
import Busca from '~/components/Busca';

export default function SelectProvider({navigation}) {
  const [providers, setProviders] = useState([]);
  const [company, setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState({});
  const [loading, setLoading] = useState(false);

  async function loadCompany() {
    setLoading(true);
    await api
      .get(`empresas`)
      .then(res => {
        setLoading(false);

        const data = res.data.map(comp => ({
          label: comp.name,
          value: comp,
          avatar: comp.avatar,
        }));

        setCompany(data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

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

  function handleNavSelectList(provider) {
    return navigation.navigate('FilaUser', {provider});
  }

  useEffect(() => {
    loadProvider();
    loadCompany();
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

        {loading && <Loading loading={loading}>Carregando ...</Loading>}
        {!loading && providers.length < 1 ? (
          <Message nameIcon="exclamation-triangle">
            Você não tem horário agendado no momento!
          </Message>
        ) : (
          <ProvidersList
            data={providers}
            keyExtractor={provider => String(provider.id)}
            renderItem={({item: provider}) => (
              <Provider onPress={() => handleNavSelectList(provider)}>
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
