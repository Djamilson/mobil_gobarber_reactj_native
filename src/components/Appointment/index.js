import React, {useMemo} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  Container,
  Left,
  Avatar,
  Info,
  InfoStatus,
  StatusLabel,
  Status,
  Time,
  Name,
} from './styles';

export default function Appointment({data, onCancel}) {
  const dateParsed = useMemo(() => {
    return formatRelative(parseISO(data.date), new Date(), {
      locale: pt,
      addSuffix: true,
    });
  }, [data.date]);

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
          <Name>{data.provider.name}</Name>
          <InfoStatus>
            <StatusLabel>Status</StatusLabel>
            <Status> {data.status}</Status>
          </InfoStatus>
          <Time>{dateParsed}</Time>
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

Appointment.propTypes = {
  data: PropTypes.shape({
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
