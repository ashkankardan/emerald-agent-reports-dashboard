import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
  color: white;
  position: relative;
  margin-bottom: 20px;
  padding: 20px;
  padding-top: 10px;
  box-sizing: border-box;
`

export const ReportMainContent = styled.div`
width: 100%;
`

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead {
    /* width: calc(100% - 15px); */
    width: 100%;
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
    /* overflow-y: scroll; */
    height: calc(100vh - 350px);

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
    background: purple; // Color of the scrollbar track
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
  width: 100px;

  &:nth-child(1) { width: 180px; }

`

export const TableRow = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
`;

export const Divider = styled.div`
  width: 100%;
  /* height: 1px; */
  height: 1px;
  background-color: purple;
  margin: 10px auto;
`
