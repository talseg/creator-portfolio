import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Project, Image } from "../../database/dbInterfaces";
import { useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from "react";

interface ImageTableProps {
    images: Image[];
}

export const ImageTable: React.FC<ImageTableProps> = ({ images }) =>
    <Table size="small" aria-label="images">
        <TableHead>
            <TableRow>
                <TableCell>Image Index</TableCell>
                <TableCell>Image Url</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {images.map((image, i) => (
                <TableRow key={`image-${i}`}>
                    <TableCell component="th" scope="row">{image.imageIndex}</TableCell>
                    <TableCell>{image.imageUrl}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>

interface ImageTableRowProps {
    images: Image[];
    open: boolean;
}

export const ImagesTableRow: React.FC<ImageTableRowProps> = ({ images, open }) => {

    return (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>

                        <Typography variant="h6" gutterBottom component="div">
                            Project Images
                        </Typography>

                        {/* <ImageTable images={images} /> */}

                        <Table size="small" aria-label="images">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image Index</TableCell>
                                    <TableCell>Image Url</TableCell>
                                </TableRow>
                            </TableHead>
                            {
                                images &&
                                <TableBody>
                                    {images.map((image, i) => (
                                        <TableRow key={`image-${i}`}>
                                            <TableCell component="th" scope="row">
                                                {image.imageIndex}
                                            </TableCell>
                                            <TableCell>{image.imageUrl}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            }
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}


interface ProjectRowProps {
    project: Project;
    imageRowOpen: boolean;
    setImageRowOpen: (open: boolean) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, imageRowOpen, setImageRowOpen }) => {
    return (
        <TableRow key={project.id}>

            {/** Images Expander button */}
            <TableCell>
                <IconButton aria-label="expand row" size="small"
                    onClick={() =>
                        setImageRowOpen(!imageRowOpen)
                    }>
                    {imageRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>

            <TableCell>{project.projectName}</TableCell>
            <TableCell>{project.projectIndex}</TableCell>
        </TableRow>
    );
}

interface RowProps {
    project: Project;
}

const Row: React.FC<RowProps> = ({ project }) => {
    const [showImages, setShowImages] = useState(false);

    return (
        <React.Fragment>

            <ProjectRow project={project} imageRowOpen={showImages} setImageRowOpen={setShowImages} />

            {/* Expanding Project Images */}
            {project.images && <ImagesTableRow images={project.images} key={0} open={showImages} />}

        </React.Fragment>
    );
}

export interface ProjectTableProps {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
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
                            {/** Expander Placeholder */}
                            <TableCell />
                            <TableCell>Project Name</TableCell>
                            <TableCell>Project Index</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            projects.map((project, index) => (
                                <Row project={project} key={`row-project-${index}`} />
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}