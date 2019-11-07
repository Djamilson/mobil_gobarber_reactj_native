import React, {forwardRef, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import RNPickerSelect from 'react-native-picker-select';

import api from '~/services/api';

import {ITFilter} from './styles';

function Filter({style, icon, onChange}) {
  const [company, setCompany] = useState([]);

  async function loadAvailable() {
    console.log('====>>>');

    const response = await api.get(`empresas`);
    console.log('====>>>', response.data);
    const data = response.data.map(comp => ({
      label: comp.name,
      value: comp.id,
    }));

    console.log('====>>>', data);
    setCompany(data);
  }

  useEffect(() => {
    loadAvailable();
  }, []);

  async function handleSelectProvider(value) {
    console.log('Rum:', value);

    const response = await api.get(`users/${value}`);
    console.log('====>>>', response.data);
     onChange(response.data);
  }

  return (
    <ITFilter styles={style}>
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
    </ITFilter>
  );
}

Filter.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
};

Filter.defaultProps = {icon: null, style: {}};

export default Filter;
