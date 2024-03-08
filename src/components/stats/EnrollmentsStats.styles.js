import styled, { keyframes } from "styled-components";

export const TableRow = styled.tr`
  display: table;
  width: 100%;
  table-layout: fixed;
  border-bottom: 2px solid purple;

  &.lead {
    background-color: #3D3D3D;
  }
`;

export const TableData = styled.td`
  border: 1px solid purple;
  text-align: left;
  padding: 8px;
  line-height: 1.5;
  width: 100px;
  font-weight: bold;

  &:nth-child(1) { width: 180px; }

  &:nth-last-child(1) {
    button {
      width: 100%;
    }
  }
`;

export const Btn = styled.div`
  width: 100%;
  height: 50px;
  border: 1px solid purple;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-size: 14px;

  &:hover {
    color: purple;
    border-color: purple;
  }
`

const fadeInOutAnimation = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

export const LogoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

export const Logo = styled.img`
  border-radius: 50%;
  height: 40px;
  margin: auto;
  animation: ${fadeInOutAnimation} 3s ease-in infinite;
`
