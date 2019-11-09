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
  margin-left: 40px;
  max-height: 200px;

  border-radius: 10px;
  box-shadow: 0 0 10px #ccc;
  background-color: #fff;
  width: 80%;
  padding: 15px;
`;

export const Title = styled.Text`
  font-size: 20px;
  text-align: left;
  color: red;
  font-weight: bold;
`;

export const Children = styled.Text`
  font-size: 17px;
  margin-top: 20px;
`;

export const Footer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-top: 30px;
  padding: 10px;
`;

export const YasButton = styled(TouchableOpacity)`
  height: 43px;
  background: #e74c3c;
  border-radius: 7px;

  align-items: center;
  justify-content: center;

  margin-top: 10px;
  width: 110px;
  margin-bottom: 10px;
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
