import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FirebaseDb } from "../database/FirebaseDb";
import { getExceptionString, logException } from "../utilities/exceptionUtils";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 32px;
  text-align: center;
`;

export const Project: React.FC = () => {

    const { projectId } = useParams<{ projectId: string }>();
    const [projectName, setProjectName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!projectId) return;
        (async () => {
            try {
                const project = await FirebaseDb.fetchProjectById(projectId);
                setProjectName(project.projectName);
            } catch (err) {
                logException(err);
                setError(getExceptionString(err));
            }
        })();
    }, [projectId]);

    if (!projectId) return <Wrapper>❌ can not load project {projectId}</Wrapper>;

    if (error) return <Wrapper>❌ {error}</Wrapper>;
    if (!projectName) return <Wrapper>⏳ Loading…</Wrapper>;
    return <Wrapper><h1>{projectName}</h1></Wrapper>;

}