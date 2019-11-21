import styled from 'styled-components/native';

export const Container = styled.View`
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 7px;
  background: ${props => (props.agendar ? '#fff' : '#dbead5')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  opacity: ${props => (props.past && props.agendar ? 0.6 : 1)};
`;

export const Left = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const Info = styled.View`
  margin-left: 15px;
`;

export const InfoStatus = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
`;

export const InfoStatusChamada = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: column;
  align-content: stretch;
  justify-content: center;
  align-items: center;
`;

export const StatusLabel = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${props => (props.agendar ? '#fff' : '#999')};
`;

export const Status = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #008000;
`;

export const StatusText = styled.Text`
  font-weight: bold;
  font-size: 21px;
  color: #008000;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #333;
`;

export const Time = styled.Text`
  color: ${props => (props.agendar ? '#fff' : '#999')};
  font-size: 13px;
  margin-top: 4px;
`;