import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;
export const Heder = styled.View`
  align-self: center;
  align-content: space-between;
  align-items: center;
  flex-direction: row;
  max-height: 50px;
`;

export const Icons = styled.View`
  flex: 1;
  align-content: center;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  margin-top: 30px;
  margin-left: 20px;
  max-width: 90px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-top: 25px;
  padding-right: 50px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})``;
