import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.SafeAreaView`
  flex: 1;
`;
export const Filter = styled.View`
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

export const ProvidersList = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  numColumns: 2,
})`
  margin-top: 40px;
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
export const ContainerLogo = styled.View`
  flex: 1;
  border-radius: 4px;
  padding: 0 10px 20px 0;

  align-items: center;
  margin: 0 10px 40px;
`;

export const Logo = styled.Image`
  width: 65px;
  height: 65px;
  border-radius: 35px;
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

export const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #c3c3c3;
  text-align: center;
`;

export const GroupButton = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ButtonPresencial = styled.TouchableOpacity`
  flex-direction: row;

  background: #c37dc6;
  margin-left: 20px;
  border-radius: 5px;
  height: 46px;
  align-items: center;
  justify-content: center;
  min-width: 155px;
`;

export const ButtonAgendar = styled.TouchableOpacity`
  flex-direction: row;

  background: #27ddc5;
  border-radius: 5px;
  height: 46px;
  min-width: 155px;
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  margin-left: 10px;
`;
