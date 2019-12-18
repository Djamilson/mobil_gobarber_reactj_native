import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';

export const Container = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  margin-top: 60px;
  margin-bottom: 85px;
  padding: 20px;
  border-radius: 4px;
  background: #fff;
  margin-left: 25px;
  margin-right: 25px;
`;

export const Info = styled.View`
  margin-left: 15px;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #c3c3c3;
  padding-right: 20px;
`;

export const CloseButton = styled(TouchableOpacity)`
  background: #3b9eff;
  border-radius: 20px;

  align-items: center;
  justify-content: center;
  max-width: 40px;
  padding: 5px;

  margin-top: -40px;
  margin-bottom: 2px;
  margin-left: 220px;
`;
