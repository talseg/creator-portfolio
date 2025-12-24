import styled from "styled-components"

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  overflow-x: auto;
  overflow-y: hidden;

  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  -webkit-overflow-scrolling: touch;
  gap: 30px;
  background-color: red;
`

const Column = styled.div`
  flex: 0 0 80vw;   /* ← THIS is the key line */
  margin-left: 10vw;
  margin-right: 10vw;
  height: 700px;

  background-color: blue;
  color: white;

  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;

  scroll-snap-align: center;
  border-radius: 2%;
`;

const ColumnContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;


export const MobilePage: React.FC = () => {

  return (
    <Wrapper>
      <Column>
        {/* <ColumnContentWrapper> */}
          column 1
        {/* </ColumnContentWrapper> */}
      </Column>

      <Column>
        {/* <ColumnContentWrapper> */}
          column 2
        {/* </ColumnContentWrapper> */}
      </Column>

      <Column>
        {/* <ColumnContentWrapper> */}
          column 3
        {/* </ColumnContentWrapper> */}
      </Column>

    </Wrapper>
  )
}