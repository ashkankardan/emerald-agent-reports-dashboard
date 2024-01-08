import styled from 'styled-components'

export const MainContainer = styled.div`
  width: 100%;
  color: white;
  width: 100%;
`

export const TableRow = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
  border-bottom: 2px solid purple;

  &.lead {
    background-color: #3D3D3D;
  }
`;

export const TableData = styled.td`
  border: 1px solid purple;
  text-align: left;
  padding: 8px;
  line-height: 1.5;

  &:nth-child(1) { width: 83px; }
  &:nth-child(2) { width: 100px; }
  &:nth-child(3) { width: 60px; }
  &:nth-child(4) { width: 120px; }
  &:nth-child(5) { width: 100px; }
  &:nth-child(6) { width: 90px; }
  &:nth-child(7) { width: 87px; }

  &:nth-child(9) { width: 81px; }
  &:nth-child(10) { width: 100px; }
  &:nth-child(11) { width: 100px; }
  &:nth-child(12) { width: 100px; }
  &:nth-child(13) { width: 100px; }
  &:nth-child(14) { width: 100px; }

  &:nth-last-child(1) {
    width: 100px;
    button {
      width: 100%;
    }
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: purple;
  margin: 10px auto;
`

export const Btn = styled.div`
  width: 100%;
  /* height: 30px; */
  height: 25px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 14px;

  &:hover {
    color: gray;
    border-color: purple;
  }
`
