import styled from "styled-components";

export const MainContainer = styled.div`
width: 100%;
height: calc(100vh - 110px);
background-color: purple;
padding: 20px;
box-sizing: border-box;
`

export const MainContent = styled.div`
width: 90%;
max-width: 700px;
min-width: 300px;
height: 100%;
margin: auto;
background-color: gray;
display: flex;
flex-direction: column;
/* justify-content: center; */
align-items: center;
`

export const SectionContainer = styled.div`
padding: 20px;
`

export const Btn = styled.button`
width: 250px;
height: 35px;
font-size: 20px;
font-weight: bold;
background-color: black;
color: gray;
cursor: pointer;
transition: all 0.3s;

&.disabled {
  cursor: not-allowed;
  background-color: red;
  color: black;
}

&:hover {
  background-color: purple;
  color: black;
}

&:active {
  background-color: gray;
}
`
