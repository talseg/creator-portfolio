import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Project, Image } from "../../database/dbInterfaces";
import { useState } from "react";
import { ImageTable } from "./ImageTable";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";
import React from "react";
import { addProjectImage } from "../../database/FirebaseDb";
import { pickImage } from "../../utilities/pickImage";

interface ImageTableRowProps {
  images: Image[];
  open: boolean;
  projectId: string;
}

export const ImagesTableRow: React.FC<ImageTableRowProps> = ({ images, open, projectId }) => {

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              Project Images
            </Typography>
            <ImageTable images={images} projectId={projectId} />
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

const ProjectRow: React.FC<ProjectRowProps> = ({ project, imageRowOpen,
  setImageRowOpen }) => {

  const handleAddProjectImageClick = () => {
    pickImage((file) => {
      if (file) addProjectImage(project.id, file);
    })
  };

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
      <TableCell>
        {project.projectImageUrl ?
          <ImageSnapshot
            src={project.projectImageUrl}
            alt={`project-${project.projectName}`}
            showAdd={false}
            showRemove={true}
            onRemoveClick={() => { }}
          /> :
          <button onClick={() => handleAddProjectImageClick()}>+</button>
        }
      </TableCell>
    </TableRow>
  );
}

interface RowProps {
  project: Project;
}

const ProjectWithImagesRow: React.FC<RowProps> = ({ project }) => {
  const [showImages, setShowImages] = useState(false);

  return (
    <React.Fragment>

      <ProjectRow project={project}
        imageRowOpen={showImages}
        setImageRowOpen={setShowImages}/>

      {/* Expanding Project Images */}
      {project.images && <ImagesTableRow
        images={project.images}
        open={showImages}
        projectId={project.id}
      />}

    </React.Fragment>
  );
}

export interface ProjectTableProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', maxWidth: "80vw" }}>
      <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
        <Table stickyHeader aria-label="collapsible table sticky table">
          <TableHead>
            <TableRow>
              {/** Expander Placeholder */}
              <TableCell>Images</TableCell>
              <TableCell>Project Name</TableCell>
              <TableCell>Project Index</TableCell>
              <TableCell align="center">
                Image
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              projects.map((project, index) => (
                <ProjectWithImagesRow
                  project={project}
                  key={`row-project-${index}`}
                />
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}