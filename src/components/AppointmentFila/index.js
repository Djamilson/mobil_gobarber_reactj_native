import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import enumAppointment from '~/enum/appointments';

import {
  Container,
  Left,
  Avatar,
  Info,
  InfoStatus,
  StatusLabel,
  StatusText,
  Status,
  Name,
} from './styles';

export default function AppointmentFila({data, onCancel}) {
  return (
    <Container past={data.past} agendar={Boolean(data.agendar)}>
      <Left>
        <Avatar
          source={{
            uri: data.provider.avatar
              ? data.provider.avatar.url
              : `https://api.adorable.io/avatar/50/${data.provider.name}.png`,
          }}
        />
        <Info>
          <StatusLabel>Atendimento com o:</StatusLabel>
          <InfoStatus>
            <Name>{data.provider.name}</Name>
          </InfoStatus>

          <InfoStatus>
            <StatusLabel>Status:</StatusLabel>
            <Status>{data.status}</Status>
          </InfoStatus>
          {data.status === enumAppointment.atendendo ? (
            <InfoStatus>
              <StatusText>Está sendo atendido</StatusText>
            </InfoStatus>
          ) : (
            <>
              <StatusLabel>Você é o:</StatusLabel>
              <StatusText>{data.index}º da fila</StatusText>
            </>
          )}
        </Info>
      </Left>
      {data.cancelable && !data.canceled_at && (
        <TouchableOpacity onPress={onCancel}>
          <Icon name="event-busy" size={20} color="#f64c75" />
        </TouchableOpacity>
      )}
    </Container>
  );
}

AppointmentFila.propTypes = {
  data: PropTypes.shape({
    index: PropTypes.number,
    provider: PropTypes.object,
    cancelable: PropTypes.bool,
    date: PropTypes.string,
    status: PropTypes.string,
    agendar: PropTypes.bool,
    past: PropTypes.bool,
    canceled_at: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};
