import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconGroupButton from 'react-native-vector-icons/FontAwesome';

import Background from '~/components/Background';

import api from '~/services/api';

import {
  Container,
  Filter,
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
  const [company, setCompany] = useState([]);
  const [companySelect, setCompanySelect] = useState({});
  const [optionAgendar, setOptionAgendar] = useState(false);

  async function loadCompany() {
    const response = await api.get(`empresas`);

    const data = response.data.map(comp => ({
      label: comp.name,
      value: comp,
      avatar: comp.avatar,
    }));

    setCompany(data);
  }

  async function loadProvider() {
    const response = await api.get('providers');
    setProviders(response.data);
  }

  function selectoptionAgendar() {
    setOptionAgendar(!optionAgendar);
  }

  function handleSelectHour(provider) {
    if (optionAgendar) {
      const data = new Date();
      const data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
      const time = data2.toISOString().replace(/\.\d{3}Z$/, '');

      return navigation.navigate('Confirm', {
        provider,
        time,
      });
    }
    return navigation.navigate('SelectDateTime', {provider});
  }

  useEffect(() => {
    loadProvider();
    loadCompany();
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
        <Filter>
          <RNPickerSelect
            placeholder={{
              label: 'Filtro a...',
              value: null,
            }}
            onValueChange={handleSelectProvider}
            style={{
              placeholder: {
                color: '#cecec3',
              },
              inputAndroidContainer: {
                overflow: 'hidden',

                fontSize: 16,

                paddingHorizontal: 20,
                paddingBottom: 12,
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 100,

                paddingVertical: 0,
                marginHorizontal: 100,
                textAlign: 'center',

                alignSelf: 'flex-start',
                borderStyle: 'solid',

                minWidth: 48,
                fontFamily: 'Monaco',
              },

              inputIOS: {
                color: '#c3c3c3',
                height: 45,
                paddingLeft: 16,
                paddingRight: 16,
              },
              inputAndroid: {
                height: 45,
                padding: 16,

                width: 310,
                borderRadius: 10,
                backgroundColor: 'white',

                color: 'cdarkblue',
                fontFamily: 'OpenSans-Regular',
                fontSize: 13,
              },
            }}
            items={company}
          />

          <Icon name="search" size={30} color="#FFF" />
        </Filter>
        <GroupButton>
          <ButtonAgendar
            onPress={() => selectoptionAgendar()}
            disabled={optionAgendar}>
            {optionAgendar ? (
              <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
            ) : null}

            <Text>Presencial</Text>
          </ButtonAgendar>
          <ButtonPresencial
            onPress={() => selectoptionAgendar()}
            disabled={!optionAgendar}>
            {optionAgendar ? null : (
              <IconGroupButton name="thumbs-o-up" size={30} color="#FFF" />
            )}
            <Text>Reservar {optionAgendar}</Text>
          </ButtonPresencial>
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
