import styled from 'styled-components'

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

export const SectionNavContainer = styled.div`
  width: 100%;
`

export const SectionNavRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  margin-bottom: 15px;
`

export const SearchIconContainer = styled.div`
  width: 25px;
  height: 25px;
  margin: 0 10px;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 15px;

  &:hover {
    color: gray;
    border-color: purple;
  }

  &.translate {
    transform: translateX(-10px);
  }
`

export const Btn = styled.div`
  width: 83px;
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
  font-size: 15px;

  &:hover {
    color: gray;
    border-color: purple;
  }
`

export const InputRow = styled.div`
  width: 100%;
  margin-bottom: 15px;
  /* height: 30px; */
  height: 30px;
  display: flex;
  align-items: center;

  &.export {
    justify-content: end;

    div {
      transform: translateX(-24px);
    }
  }
`

export const InputRowGroup = styled.div`
display: flex;
column-gap: 10px;
`

export const Label = styled.label`
  margin-right: 10px;
  display: inline-block;
  font-weight: bold;
`

export const SelectInput = styled.select`
  border-radius: 5px;
  outline: none;
  height: 25px;
  padding: 0 5px;
  cursor: pointer;
`

export const Input = styled.input`
  width: 130px;
  height: 25px;
  border-radius: 5px;
  padding-left: 5px;
  padding-right: 5px;
  outline: none;
  border: none;

  &.searchInput {
    width: 150px;
    padding-right: 18px;
    box-sizing: border-box;
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

  &:nth-child(1) { width: 83px; }
  &:nth-child(2) { width: 100px; }
  &:nth-child(3) { width: 100px; }
  &:nth-child(4) { width: 120px; }
  &:nth-child(5) { width: 120px; }
  &:nth-child(6) { width: 100px; }
  &:nth-child(7) { width: 90px; }
  &:nth-child(8) { width: 87px; }

  &:nth-child(10) { width: 81px; }
  &:nth-child(11) { width: 100px; }
  &:nth-child(12) { width: 100px; }
  &:nth-child(13) { width: 100px; }
  &:nth-child(14) { width: 100px; }
  &:nth-child(15) { width: 100px; }

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

export const CloseIcon = styled.div`
  color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateX(-15px);
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`

export const LoaderContainer = styled.div`
padding-top: 20px;
width: 100%;
text-align: center;
`
