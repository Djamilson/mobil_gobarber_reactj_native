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
export const ContainerButton = styled.View`
  padding: 2px;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-width: 100px;
  margin-left: 2px;
`;

export const CancelButton = styled.TouchableOpacity`
  padding: 0 10px;
  height: 36px;
  background: #ff0000;
  border-radius: 4px;

  flex-direction: row;
  align-items: center;
`;

export const AtendendoButton = styled.TouchableOpacity`
  padding: 0 10px;
  height: 36px;
  background: #008000;
  border-radius: 4px;

  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

export const FinalityButton = styled.TouchableOpacity`
  padding: 0 10px;
  height: 36px;
  background: #1a1d60;
  border-radius: 4px;

  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
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
  margin-right: 10px;
`;

export const Info = styled.View`
  margin-left: 0px;
`;

export const InfoStatus = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
`;

export const Status = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #008000;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #333;
  max-width: 220px;
`;

export const TextButton = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  margin-right: 5px;
`;

export const Time = styled.Text`
  color: ${props => (props.agendar ? '#fff' : '#999')};
  font-size: 13px;
  margin-top: 4px;
`;

export const InfoStatusChamada = styled.View`
  margin-left: 0px;
  flex: 1;
  flex-direction: row;
  align-content: stretch;
  justify-content: center;
  align-items: center;
`;

export const StatusLabel = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${props => (props.agendar ? '#fff' : '#999')};
`;

export const StatusLabelFila = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${props => (props.agendar ? '#fff' : '#999')};
`;

export const StatusText = styled.Text`
  font-weight: bold;
  font-size: 21px;
  color: #008000;
  margin-right: 10px;
`;
