import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {useSelector, useDispatch} from 'react-redux';
import {acceptionRegulation} from '~/store/modules/auth/actions';

import Background from '~/components/Background';
import Regulation from '~/components/Regulation';

import {ApproveButton, ApproveButtonText} from './styles';

export default function RegulationRaview({navigation}) {
  const dispatch = useDispatch();

  const [privacy] = useState(useSelector(state => state.user.profile.privacy));
  const [token] = useState(useSelector(state => state.auth.token));

  function handleAcceptRegulation() {
    const newPrivacy = !privacy;
    const {navigate} = navigation;
    dispatch(acceptionRegulation({token, newPrivacy, navigate}));
    // navigation.navigate('App');
  }

  return (
    <Background>
      <Regulation handleAcceptRegulation={handleAcceptRegulation}>
        Aceito os termos
      </Regulation>
      <ApproveButton onPress={handleAcceptRegulation}>
        <ApproveButtonText>Aceito os termos</ApproveButtonText>
      </ApproveButton>
    </Background>
  );
}

RegulationRaview.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
