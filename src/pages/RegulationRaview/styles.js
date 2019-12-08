import styled from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';

export const Container = styled.SafeAreaView`
  flex: 1;
`;
export const Content = styled.ScrollView.attrs({
  contentContainerStyle: {padding: 30, paddingBottom: 120},
  showsVerticalScrollIndicator: false,
})``;

export const Regulation = styled.Text`
  font-size: 18px;
  color: #fff;
  line-height: 26px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30px;
  letter-spacing: 2.8px;
  text-transform: uppercase;
`;

export const ApproveButton = styled(RectButton)`
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;

  background-color: #27ddc5;
  border-radius: 5px;
  height: 54px;
  align-items: center;
  justify-content: center;
`;

export const ApproveButtonText = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  letter-spacing: 2.8px;
`;
