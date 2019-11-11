import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const Item = styled.View`
  flex: 1;
  border: 1px solid #ccc;
  margin-top: 15px;
  margin-left: 10px;

  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
  background-color: #fff;
  width: 95%;
  padding: 15px;
  max-height: 95%;

  border: solid #000 2px;
`;

export const Title = styled.Text`
  font-size: 20px;
  text-align: left;
  color: red;
  font-weight: bold;
`;

export const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin-top: 30px;
  padding: 10px;
  max-height: 43px;
`;

export const NoButton = styled(TouchableOpacity)`
  height: 43px;
  background: #3b9eff;
  border-radius: 7px;

  align-items: center;
  justify-content: center;

  margin-top: 10px;
  width: 110px;
  margin-bottom: 10px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const Termo = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 10},
})`
  flex: 1;
  margin-top: 10px;
  max-height: 95%;
`;
