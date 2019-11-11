import React from 'react';
import PropTypes from 'prop-types';

import ModalReact from 'react-native-modal';

import {Dimensions} from 'react-native';
import HTML from 'react-native-render-html';

import {Container, Footer, NoButton, Termo, Title, Item, Text} from './styles';

const htmlContent = `
    <h3>Privacidade e Termos</h3>
    <h4>Para criar uma Conta do GoBarber, você precisa concordar com os Termos
    de Serviços abaixo.</h4>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">
    Além disso, quando você cria uma conta, nós processamos suas informações
    conforme descrito na nossa Política de Privacidade, incluindo estes
    pontos-chave:</p>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">
    Os dados que processamos quando você usa o GoBarber Quando você configura uma
    Conta do GoBarber, nós armazenamos as informações fornecidas, como seu
    nome e endereço de e-mail.</p>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">
    Quando você usa o serviço do GoBarber para ação como fazer um agendamento
    de horário nós armazenamos as informações que você cria.</p>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">
    Também processamos os tipos de informação descritos acima quando você usa o
    app ou site que usam serviço do GoBarber.</p>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">
    Por que os processamos Processamos esses dados para os
    fins descritos na nossa política, incluindo o seguinte:</p>

    <p style="textAlign: justify; color: teal; fontWeight: 800;">Melhorar a qualidade dos nossos serviços e desenvolver novos;
    Melhorar a segurança, protegendo contra fraudes e abusos. </p>

    <h4>Você poderá revogar seu consentimento no futuro sempre que quiser.</h4>
`;

export default function TermosCondicoes({toggleModal, isModalVisible}) {
  return (
    isModalVisible && (
      <Container>
        <ModalReact isVisible={isModalVisible} animationType="slide">
          <Item>
            <Title>Termos e condições!</Title>

            <Termo>
              <HTML
                html={htmlContent}
                imagesMaxWidth={Dimensions.get('window').width}
              />
            </Termo>

            <Footer>
              <NoButton loading onPress={toggleModal}>
                <Text>Fechar</Text>
              </NoButton>
            </Footer>
          </Item>
        </ModalReact>
      </Container>
    )
  );
}

TermosCondicoes.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isModalVisible: PropTypes.bool.isRequired,
};
