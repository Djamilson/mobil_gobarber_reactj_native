import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {TouchableOpacity, Image} from 'react-native';

import logo from '~/assets/logo.png';
import TermosCondicoes from '~/components/TermosCondicoes';

import Background from '~/components/Background';
import {signUpRequest} from '~/store/modules/auth/actions';
import CheckBox from '~/components/CheckBox';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
} from './styles';

export default function SignUp({navigation}) {
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  const loading = useSelector(state => state.user.loading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [privacy, setPrivacy] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  function handleCheckBox() {
    setPrivacy(!privacy);
  }

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    navigation.navigate('SignIn');
  }

  function handleSubmit() {
    dispatch(signUpRequest(name, email, password, privacy, () => resetForm()));
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <FormInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Sua senha secreta"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <CheckBox
            selected={privacy}
            onPress={handleCheckBox}
            text="Aceita os termos e condições?"
          />

          {privacy ? (
            <SubmitButton loading={loading} onPress={handleSubmit}>
              Criar
            </SubmitButton>
          ) : (
            <TouchableOpacity onPress={toggleModal}>
              <SignLinkText>Termos aqui!</SignLinkText>
            </TouchableOpacity>
          )}
        </Form>
        <SignLink onPress={() => navigation.navigate('SignIn')}>
          <SignLinkText>Já tenho conta</SignLinkText>
        </SignLink>

        <TermosCondicoes
          toggleModal={toggleModal}
          isModalVisible={isModalVisible}
        />
      </Container>
    </Background>
  );
}

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
