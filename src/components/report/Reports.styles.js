import styled from 'styled-components'

export const MainContainer = styled.div`
  width: 100%;
  color: white;
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
  padding-top: 10px;
  box-sizing: border-box;
`;

export const ReportMainContent = styled.div`
width: 100%;
`

export const SectionNavContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  margin-bottom: 15px;
`

export const Btn = styled.div`
  width: 80px;
  height: 30px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    color: purple;
    border-color: purple;
  }
`



export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead {
    width: calc(100% - 15px);
    display: table;
    table-layout: fixed;

    th:last-child::after {
      content: '';
      display: block;
      width: 15px; // Approximate scrollbar width
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }

  tbody {
    display: block;
    width: 100%;
    overflow-y: scroll;
    height: calc(100vh - 285px);


// Scrollbar track
&::-webkit-scrollbar {
    width: 15px; // Width of the scrollbar
  }

  // Scrollbar handle
  &::-webkit-scrollbar-thumb {
    background: purple; // Color of the scrollbar thumb
  }

  // Scrollbar track
  &::-webkit-scrollbar-track {
    background: gray; // Color of the scrollbar track
  }

  }

  th, td {
    border: 1px solid purple;
    text-align: left;
    padding: 8px;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;


export const TableHead = styled.th`
  border: 1px solid purple;
  text-align: left;
  padding: 8px;

  &:nth-child(1) { width: 60px; }
  &:nth-child(2) { width: 120px; }
  &:nth-child(3) { width: 120px; }
  &:nth-child(4) { width: 100px; }
  &:nth-child(5) { width: 90px; }
  &:nth-child(7) { width: 87px; }
  &:nth-child(8) { width: 100px; }

  &:nth-last-child(1) { width: 100px; }
`

export const TableRow = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: purple;
  margin: 10px auto;
`
