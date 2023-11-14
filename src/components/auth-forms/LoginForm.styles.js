import styled from 'styled-components'

export const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  color: white;
`

export const MainContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const InputRow = styled.div`
  margin-bottom: 10px;
`

export const Label = styled.label`
  width: 140px;
  display: inline-block;
  font-weight: bold;
  padding-left: 2px;
  margin-bottom: 5px;
`

export const Input = styled.input`
  width: 100%;
  border-radius: 5px;
  outline: none;
  height: 30px;
  padding: 0 5px;
  color: purple;
  border-color: purple;
`

export const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 15px;
`

export const Btn = styled.button`
  width: 100%;
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
    background-color: black;
  }
`

export const Logo = styled.img`
  width: 300px;
  margin-bottom: 50px;
`
