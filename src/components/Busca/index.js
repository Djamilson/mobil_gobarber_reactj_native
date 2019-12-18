import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';

import Loading from '~/components/Loading';
import Message from '~/components/Message';
import api from '~/services/api';

import {Container, Content} from './styles';

export default function Busca({handleSelectProvider}) {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState([]);

  useEffect(() => {
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
    loadCompany();
  }, [handleSelectProvider]);

  return (
    <Container>
      {loading && <Loading loading={loading}>Carregando ...</Loading>}
      {!loading && company.length < 1 ? (
        <Message nameIcon="exclamation-triangle">
          Desculpe! No momento não temos empresas cadastrada!
        </Message>
      ) : (
        <Content>
          <RNPickerSelect
            placeholder={{
              label: 'Busca Salão...',
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
                padding: 10,
                marginRight: 5,
                marginLeft: 10,
                width: 308,
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
        </Content>
      )}
    </Container>
  );
}

Busca.propTypes = {
  handleSelectProvider: PropTypes.func.isRequired,
};
