import styled from "styled-components";

export const MainContainer = styled.div`
width: 100%;
`

export const MainContent = styled.div`
width: 100%;
height: 30px;
display: flex;
justify-content: space-between;
align-items: center;
padding: 10px;
padding-bottom: 7px;
color: white;
`

export const LeftCol = styled.div``

export const CenterCol = styled.div``

export const RightCol = styled.div`
display: flex;
column-gap: 10px;
cursor: pointer;
font-size: 20px;
transform: translateY(1px);
transition: all .3s ease;
color: white;

&:hover {
  color: purple;
}
`

export const Divider = styled.div`
width: 100%;
height: 1px;
background-color: purple;
margin: 10px auto;
`


export const InputRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  transform: translateY(-1.5px);

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
  font-size: 16px;
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
