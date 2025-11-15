import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Project } from "../../database/dbInterfaces";
import { useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from "react";


export interface ProjectTableProps {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
}

interface RowProps {
    project: Project;
}

const Row: React.FC<RowProps> = ({ project }) => {
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow key={project.projectIndex}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.projectIndex}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>Image Data</Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>

    );

}




export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
    return (
        <>
            <h2>
                Project Table
            </h2>
            <TableContainer component={Paper} sx={{ maxWidth: 550 }}>
                <Table sx={{ maxWidth: 650 }} aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />   {/* Expander */}
                            <TableCell>Project Name</TableCell>
                            <TableCell>Project Index</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            projects.map((proj, i) => (
                                <Row project={proj} key={`project-${i}`} />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}