import styled from "styled-components";

export const MainContainer = styled.div`
  width: 100vw;
  background-color: black;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  width: 655px;
  height: 440px;
  background-color: #555;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
  top: 30%;
  position: absolute;
`;

export const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const TopLeftCol = styled.div``;

export const TopRightCol = styled.div``;

export const BottomRow = styled.div`
  width: 100%;
`;

export const InputRow = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

export const Label = styled.label`
  width: 140px;
  display: inline-block;
  font-weight: bold;
`;

export const SelectInput = styled.select`
  width: calc(100% - 140px);
  border-radius: 5px;
  outline: none;
  height: 25px;
  padding: 0 5px;
  cursor: pointer;
`;

export const CheckboxInput = styled.input`
  border-radius: 5px;
  outline: none;
  padding: 0 5px;
  cursor: pointer;
`;

export const Input = styled.input`
  width: calc(100% - 140px);
  border-radius: 5px;
  outline: none;
  height: 25px;
  padding: 0 5px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  margin: 5px 0;

  border-radius: 5px;
  outline: none;
  height: 60px;
  padding: 10px;
`;

export const BtnContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

export const Btn = styled.button`
  width: 120px;
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

export const CloseIcon = styled.div`
  color: red;
  font-weight: bold;
  display: flex;
  cursor: pointer;
  justify-content: right;
  margin-bottom: 20px;
`;
