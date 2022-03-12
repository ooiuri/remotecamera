import styled from 'styled-components'

export const Wrapper = styled.main`
  color: #fff;
  width: 100%;
  height: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`

export const Input = styled.input`
  background: #FFFFFF;
  border-radius: 8px;
  padding: 8px;
`

export const Label = styled.label`
  font-size: 14px;
  margin: 4px;
`

export const Button = styled.button`
  background: #6874E8;
  border-radius: 8px;
  padding: 0 16px;
  color: #FFFFFF;
  font-weight: bold;
  cursor: pointer;
  &:hover{
    filter: brightness(0.8);
  }
`