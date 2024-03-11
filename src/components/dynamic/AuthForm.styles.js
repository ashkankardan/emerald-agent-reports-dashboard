import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100%;
`;

export const Form = styled.form`
  width: 100%;
`;

export const InputRow = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  width: 100%;
  display: inline-block;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border-radius: 5px;
  outline: none;
  height: 30px;
  padding: 0 5px;
  font-size: 16px;
`;

export const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

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
`;
