import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const ITFilter = styled.View`
  padding: 0 15px;
  height: 50px;
  border-radius: 4px;
  margin-top: 70px;
  margin-left: 5px;
  margin-right: 5px;
  border: solid #c3c3c3 3px;
  background: #cecece;
  justify-content: center;

  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

export const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

export const ProvidersList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  numColumns: 2,
})`
  margin-top: 60px;
  padding: 0 20px;
`;

export const Provider = styled(RectButton)`
  flex: 1;
  background: #fff;
  border-radius: 4px;
  padding: 20px;

  align-items: center;
  margin: 0 10px 20px;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const Name = styled.Text`
  margin-top: 15px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;
