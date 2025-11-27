
import styled from "styled-components";
import OrSegalSvg from "../assets/orSegal.svg?react";
import myImage from "../images/MainPicture.jpg";


const WrapperStyled = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
`;



const TitleText = styled.div`
  font-family: EditorSans;
  font-size: 0.9375rem;
  font-style: italic;
  font-weight: bold;
  letter-spacing: 0.02813rem;
`;



const VerticalLine = styled.div`
  width: 1px;
  background: black;
  height: 100%;
`;


const SimpleDot = styled.div`
  width: 0.4rem;
  height: 0.4rem;
  background: black;
  border-radius: 50%;
  z-index: 10;
  top: 4.45rem;
  position: sticky;
  /* margin-bottom: -0.3rem; */
  margin-top: -100px;
  margin-right: -0.15rem;
`;

const LogoLinkWrapper = styled.a`
  align-self: center;
  margin-top: 10px;
`;

const HeaderTextBox = styled.div<{ $color?: string }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;


const LogoBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const MainGridStyled = styled.div`
  display: grid;
  font-size: 20px;
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 4.625rem auto;
  justify-items: center;
`;

const HeaderRow = styled.div`
  grid-column: 1 / -1;
  grid-row: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr auto;
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  height: 100%;
`;

const HeaderBox = styled.div`
  display: flex;
  background: #6205db53;
  width: 100%;
  height: 100%;
  background: white;
`

const HorizontalLongLine = styled.div`
  width: 100%;
  background: black;
  height: 1px;
  grid-column: 1 / -1;
`;

const MiddleSection = styled.div`
  width: 100%;
  height: 30rem;
  grid-column: 1 / -1;
  background: #dd5b5bb8;
`;

const MainImage = styled.img`
  /* width: 100%;
  height: 200px; */
  object-fit: cover;
  grid-column: 1 / -1;
  justify-content: center;
`;

export const StartPage1: React.FC = () => {


 

  return (
    <WrapperStyled>

      <MainGridStyled>

        <HeaderRow>

          <HeaderBox>
            <LogoBox>
              <LogoLinkWrapper href="https://www.orsegal.net"><OrSegalSvg /></LogoLinkWrapper>
            </LogoBox>
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox style={{ background: "#FFFDB4" }}>
              <TitleText>Designer</TitleText>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox>
              <TitleText>Artist</TitleText>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HeaderBox>
            <HeaderTextBox>
              <TitleText>Illustrator</TitleText>
            </HeaderTextBox>
            <VerticalLine />
          </HeaderBox>

          <HorizontalLongLine></HorizontalLongLine>

        </HeaderRow>

        <MiddleSection>
          <MainImage src={myImage}></MainImage>
        </MiddleSection>


        {/* Grid Header Start */}


        {/* <HeaderBox>
          <LogoBox>
            <LogoLinkWrapper href="https://www.orsegal.net"><OrSegalSvg /></LogoLinkWrapper>
          </LogoBox>
        </HeaderBox> */}





        {/* <HeaderBox>
          <HeaderTextBox>
            <TitleText>Illustrator</TitleText>
          </HeaderTextBox>
          <VerticalLine />
        </HeaderBox> */}

        {/* <SimpleDot style={{ gridColumn: 2, justifySelf: "flex-end" }} /> */}

        {/* <SimpleDot style={{ gridColumn: 3, justifySelf: "flex-end" }} /> */}

        {/* <HorizontalLongLine></HorizontalLongLine> */}


        {/* <div style={{
          display: "flex", width: "100%", height: "100px", backgroundColor: "#cbcbcb",
          gridColumnStart: 1, gridColumnEnd: 5, marginTop: -3, gridRow: 3

        }} /> */}

        {/* <div style={{
          display: "flex", height: "500px", width: "100%", backgroundColor: "#5eb5cd",
          gridColumn: 2, marginTop: -3, gridRow: 4,
          border: "7px solid #ff2a00"

        }} /> */}

        {/* Grid Header End */}

        {/* <div style={{
          display: "flex", height: "800px", width: "100%", backgroundColor: "#cbcbcb",
          gridColumn: 2, marginTop: -3, gridRow: 3

        }} />


        {/* <div style={{
          display: "flex", height: "800px", width: "100%", backgroundColor: "#cbcbcb",
          gridColumn: 2, marginTop: -3, gridRow: 3

        }} />

        <div style={{
          display: "flex", height: "800px", width: "100%", backgroundColor: "#cbcbcb",
          gridColumn: 2, marginTop: -3, gridRow: 3

        }} /> */}

        {/* <div style={{
          display: "flex", height: "900px", width: "100%", backgroundColor: "#c0e3c8",
          gridColumn: 3, marginTop: -3, gridRow: 3

        }} />
        <div style={{
          display: "flex", height: "1200px", width: "100%", backgroundColor: "#d7c8c8",
          gridColumn: 4, marginTop: -3

        }} /> */}

      </MainGridStyled>

    </WrapperStyled>
  )
}