import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import enumAppointment from '~/enum/appointments';
import {
  Container,
  Left,
  Avatar,
  Info,
  InfoStatus,
  Status,
  InfoStatusChamada,
  StatusLabel,
  StatusText,
  Time,
  Name,
  ContainerButton,
  AtendendoButton,
  FinalityButton,
  TextButton,
  CancelButton,
  StatusLabelFila,
} from './styles';

export default function AppointmentAdmin({
  data,
  onAtender,
  onFinally,
  onCancel,
}) {
  const dateParsed = useMemo(() => {
    console.log('kkkk::>> ', data);
    return formatRelative(parseISO(data.data), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }, [data]);

  return (
    <Container past={data.past} agendar={Boolean(data.agendar)}>
      <Left>
        <Avatar
          source={{
            uri: data.user.avatar
              ? data.user.avatar.url
              : `https://api.adorable.io/avatar/50/${data.user.name}.png`,
          }}
        />
        <Info>
          <InfoStatus>
            <StatusLabel>Cliente: </StatusLabel>
            <Name>{data.user.name}</Name>
          </InfoStatus>
          {data.status === enumAppointment.atendendo ? null : (
            <InfoStatus>
              <StatusLabel>Status:</StatusLabel>
              <Status>{data.status}</Status>
            </InfoStatus>
          )}

          <StatusLabel>Ordem de chamada:</StatusLabel>
          {data.status === enumAppointment.atendendo ? (
            <InfoStatusChamada>
              <StatusText>{enumAppointment.atendendo}</StatusText>
            </InfoStatusChamada>
          ) : null}

          {data.index === 0 && data.status !== enumAppointment.atendendo ? (
            <InfoStatusChamada>
              <StatusText>Próximo</StatusText>
            </InfoStatusChamada>
          ) : null}

          {data.index !== 0 && data.status !== enumAppointment.atendendo ? (
            <InfoStatusChamada>
              <StatusText>{data.index}º</StatusText>
              <StatusLabelFila>da fila</StatusLabelFila>
            </InfoStatusChamada>
          ) : null}

          <Time>Agendado {dateParsed}</Time>
        </Info>
      </Left>
      {data.cancelable && !data.canceled_at && (
        <TouchableOpacity onPress={onCancel}>
          <Icon name="event-busy" size={20} color="#f64c75" />
        </TouchableOpacity>
      )}
      <ContainerButton>
        {data.status === enumAppointment.atendendo ? (
          <FinalityButton onPress={onFinally}>
            <TextButton>Finalizar</TextButton>
            <Icon name="done-all" size={20} color="#fff" />
          </FinalityButton>
        ) : (
          <AtendendoButton onPress={onAtender}>
            <TextButton>Atender</TextButton>
            <Icon name="check" size={20} color="#fff" />
          </AtendendoButton>
        )}
        <CancelButton onPress={onCancel}>
          <TextButton>Cancelar</TextButton>
          <Icon name="close" size={20} color="#fff" />
        </CancelButton>
      </ContainerButton>
    </Container>
  );
}

AppointmentAdmin.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.object,
    cancelable: PropTypes.bool,
    data: PropTypes.string,
    index: PropTypes.number,
    status: PropTypes.string,
    agendar: PropTypes.bool,
    past: PropTypes.bool,
    canceled_at: PropTypes.string,
  }).isRequired,
  onAtender: PropTypes.func.isRequired,
  onFinally: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};