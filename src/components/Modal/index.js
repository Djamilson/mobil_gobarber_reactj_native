import React from 'react';
import PropTypes from 'prop-types';

import ModalReact from 'react-native-modal';
import {
  Container,
  Footer,
  NoButton,
  YasButton,
  Title,
  Item,
  Children,
  Text,
} from './styles';

export default function Modal({
  children,
  toggleModal,
  handleLogout,
  isModalVisible,
}) {
  return (
    isModalVisible && (
      <Container>
        <ModalReact isVisible={isModalVisible} animationType="slide">
          <Item>
            <Title>Atenção!</Title>

            <Children>{children}</Children>

            <Footer>
              <NoButton loading onPress={toggleModal}>
                <Text>Não</Text>
              </NoButton>
              <YasButton onPress={handleLogout}>
                <Text>Sim</Text>
              </YasButton>
            </Footer>
          </Item>
        </ModalReact>
      </Container>
    )
  );
}

Modal.propTypes = {
  children: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
};
