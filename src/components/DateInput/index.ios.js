import React, {useMemo} from 'react';
import PropTypes from 'prop-types';

import DateTimePicker from 'react-native-modal-datetime-picker';

import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Container, DateButton, DateText, Picker} from './styles';

export default function DateInput({
  date,
  onChange,
  hideDateTimePicker,
  showDateTimePicker,
  isDateTimePickerVisible,
}) {
  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM 'de' yyyy", {locale: pt}),
    [date]
  );
  function handleDatePicked(dat) {
    onChange(dat);
    hideDateTimePicker();
  }

  return (
    <Container>
      <DateButton onPress={showDateTimePicker}>
        <Icon name="event" color="#FFF" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>

      <Picker>
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={handleDatePicked}
          onCancel={hideDateTimePicker}
          mode="date"
          locale={pt}
        />
      </Picker>
    </Container>
  );
}

DateInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  hideDateTimePicker: PropTypes.func.isRequired,
  showDateTimePicker: PropTypes.func.isRequired,
  isDateTimePickerVisible: PropTypes.bool.isRequired,
};
