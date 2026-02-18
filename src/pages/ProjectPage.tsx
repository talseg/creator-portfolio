import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { projectsStore } from "../stores/projecrStore";
import { observer } from "mobx-react-lite";
import { ImbededProjectPage } from "./ImbededProjectPage";
import styled from "styled-components";


const StyledSpinner = styled(CircularProgress)`
  grid-row: 1;
  grid-column: 1;
  align-self: center;
  justify-self: center;
`;


export const ProjectPage: React.FC = observer(() => {

  const { projectId } = useParams<{ projectId: string }>();
  return (
    projectsStore.allLoaded ?
    <ImbededProjectPage projectId={projectId} /> : <StyledSpinner />
  );
});