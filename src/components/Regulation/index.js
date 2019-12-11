import React from 'react';
import {Container, Content, TRegulation, Title} from './styles';

export default function Regulation() {
  return (
    <Container>
      <Content>
        <Title>Privacidade e Termos</Title>
        <TRegulation>
          Para criar uma Conta do GoBarber, você precisa concordar com os Termos
          de Serviços abaixo.
          {'\n\n'}
          Além disso, quando você cria uma conta, nós processamos suas
          informações conforme descrito na nossa Política de Privacidade,
          incluindo estes pontos-chave:
          {'\n\n'}
          Os dados que processamos quando você usa o GoBarber Quando você
          configura uma Conta do GoBarber, nós armazenamos as informações
          fornecidas, como seu nome e endereço de e-mail.
          {'\n\n'}
          Quando você usa o serviço do GoBarber para ação como fazer um
          agendamento de horário nós armazenamos as informações que você cria.
          Também processamos os tipos de informação descritos acima quando você
          usa o app ou site que usam serviço do GoBarber.
          {'\n\n'}Por que os processamos Processamos esses dados para os fins
          descritos na nossa política, incluindo o seguinte:
          {'\n\n'}
          Melhorar a qualidade dos nossos serviços e desenvolver novos; Melhorar
          a segurança, protegendo contra fraudes e abusos. Você poderá revogar
          seu consentimento no futuro sempre que quiser.
        </TRegulation>
      </Content>
    </Container>
  );
}
