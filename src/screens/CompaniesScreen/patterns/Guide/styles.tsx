import styled from "styled-components";

export const StyledBox = styled.li<any>`
  display: flex;
  flex: 1;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  height: 100%;
  flex: 0 0 calc(100% - 16px);
  align-items: center;
  font-weight: 600;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px #ffffff;
  text-align: center;
  margin-bottom: 0.5em;
  font-size: 0.875rem;
  background: linear-gradient(145.25deg, transparent 4.09%, transparent 81.45%);
  position: relative;
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(145.25deg, #6affff 4.09%, #00aec9 81.45%);
    box-shadow: 0px 11px 51px #127797;
    border-radius: 14px;
    cursor: pointer;
    position: absolute;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover {
    &::after {
      opacity: 1;
    }
  }
  @media screen and (min-width: 768px) {
    flex: 0 0 calc(25% - 16px);
  }
`;
