import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  max-height: 50px;
  padding: 30px;
`;

export const Icons = styled.View`
  flex: 1;
  align-content: center;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: row;
  height: 40px;
  margin-top: -15px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  align-self: center;
`;

export const ButtonLogout = styled.TouchableOpacity`
  margin-right: 20px;
`;
