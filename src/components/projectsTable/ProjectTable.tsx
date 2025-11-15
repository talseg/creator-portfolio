import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Project } from "../../database/dbInterfaces";

export interface ProjectTableProps {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({projects}) => {
    return (
        <>
            <h2>
                Project Table
            </h2>
            <TableContainer component={Paper} sx={{ maxWidth: 550 }}>
                <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Project Index</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            projects.map((proj) => (
                                <TableRow key={proj.projectIndex}>
                                    <TableCell>{proj.projectName}</TableCell>
                                    <TableCell>{proj.projectIndex}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}