import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import PropTypes from 'prop-types';

import {Container, Info, Name} from './styles';

export default function Message({email, nameIcon}) {
  return (
    <Container>
      <Icon name={nameIcon} size={30} color="#ffe119" />
      <Info>
        <Name>
          Acesse o email {email} para ter ao código de ativação da conta!
        </Name>
      </Info>
    </Container>
  );
}

Message.propTypes = {
  email: PropTypes.string.isRequired,
  nameIcon: PropTypes.string.isRequired,
};
