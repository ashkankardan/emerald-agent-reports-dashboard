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
