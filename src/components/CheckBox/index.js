import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import {CheckBoxInput, TInput} from './styles';

export default function CheckBox({selected, text, ...rest}) {
  console.log('Rest:', rest);
  return (
    <CheckBoxInput {...rest}>
      <Icon
        size={30}
        color="#211f30"
        name={selected ? 'check-box' : 'check-box-outline-blank'}
      />

      <TInput> {text} </TInput>
    </CheckBoxInput>
  );
}

CheckBox.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

CheckBox.default = {selected: false};
