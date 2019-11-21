import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Heder = styled.View`
  flex: 1;
  align-self: center;
  align-content: space-between;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  max-height: 50px;
  padding: 35px;
`;

export const Icons = styled.View`
  flex: 1;
  align-content: center;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  margin-left: 30px;
  max-width: 90px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
  margin-right: 20px;
`;

export const List = styled.FlatList.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {padding: 30},
})``;
