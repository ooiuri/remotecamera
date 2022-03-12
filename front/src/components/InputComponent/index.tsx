import * as S from './styles'
const Main = () => {
  return (
    <S.Wrapper>
        <S.Row>
            <S.Label>IP da Câmera</S.Label>
        </S.Row>
        <S.Row>
            <S.Input list='ipCamera'/>
            <datalist id="ipCamera">
                <option>10.0.0.97</option>
            </datalist>
            <S.Button>Enviar</S.Button>
        </S.Row>
    </S.Wrapper>
  )
}

export default Main