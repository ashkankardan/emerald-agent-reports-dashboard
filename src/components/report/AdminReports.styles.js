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

export const InputRow = styled.div`
width: 100%;
margin-bottom: 15px;
height: 30px;
display: flex;
align-items: center;
`

export const Label = styled.label`
margin-right: 10px;
display: inline-block;
font-weight: bold;
`

export const SelectInput = styled.select`
/* width: 50px; */
border-radius: 5px;
outline: none;
height: 25px;
padding: 0 5px;
cursor: pointer;
`

export const ReportTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`
export const TableHead = styled.th`
  border: 1px solid purple;
  /* width: 50px; */
  text-align: left;
  padding: 8px;
  /* background-color: #f2f2f2; */
`

export const TableRow = styled.tr`
  border-bottom: 2px solid purple;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: purple;
  margin: 10px auto;
`
