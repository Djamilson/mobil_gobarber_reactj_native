import styled from 'styled-components/native';

export const Container = styled.View`
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 20px;
  border-radius: 4px;
  background: #fff;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

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
