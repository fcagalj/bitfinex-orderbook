import styled from 'styled-components';

export const Container = styled.div`
  background-color: #1b262f;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
  padding: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #fff;
`;

export const TableHeader = styled.thead`
  border-top: 2px solid #cccccc;
`;
export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PrecisionButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 60px; // Adjust as needed
`;
export const Title = styled.h2`
  color: #fff;
  margin-bottom: 20px;
`;

export const SubTitle = styled.span`
  color: #657786;
`;

export const TableColumnHeader = styled.th`
  color: #657786;
`;
export const Button = styled.button`
  background-color: #1b262f;
  border: none;
  color: #fff;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;
