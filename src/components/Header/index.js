import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';

import PropTypes from 'prop-types';

import Modal from '~/components/Modal';
import TermosCondicoes from '~/components/TermosCondicoes';
import {signOut} from '~/store/modules/auth/actions';

import {Container, Title, Icons, ButtonLogout} from './styles';

export default function Header({title, navigation}) {
  const dispatch = useDispatch();
  const [isApproveButton] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisiblePrivacy, setIsModalVisiblePrivacy] = useState(false);
  const [privacy] = useState(useSelector(state => state.user.profile.privacy));

  function toggleModalPrivacy() {
    setIsModalVisiblePrivacy(!isModalVisiblePrivacy);
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Title>{title}</Title>
      <Icons>
        <ButtonLogout onPress={toggleModal}>
          <Icon
            name="sign-out-alt"
            size={26}
            color="rgba(255, 255, 255, 0.6)"
          />
        </ButtonLogout>

        <TouchableOpacity onPress={toggleModalPrivacy}>
          <FontAwesome name="gear" size={26} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>
      </Icons>
      <Modal
        toggleModal={toggleModal}
        handleLogout={handleLogout}
        isModalVisible={isModalVisible}>
        Tem certeza que deseja sair do Gobarber?
      </Modal>

      <TermosCondicoes
        toggleModal={toggleModalPrivacy}
        isModalVisible={isModalVisiblePrivacy}
        navigation={navigation}
        privacy={privacy}
        isApproveButton={isApproveButton}
      />
    </Container>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
