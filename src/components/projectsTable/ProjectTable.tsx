import { Box, Collapse, IconButton, Input, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Project, Image } from "../../database/dbInterfaces";
import { useState } from "react";
import { ImageTable } from "./ImageTable";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";
import React from "react";
import { addProjectImage, removeProjectImage } from "../../database/FirebaseDb";
import { pickImage } from "../../utilities/pickImage";
import { logException } from "../../utilities/exceptionUtils";
import { styled as muiStyle } from "@mui/material/styles";
import { useProjectTable } from "./ProjectTableContext";


interface ImageTableRowProps {
  images: Image[];
  open: boolean;
  project: Project;
}

export const ImagesTableRow: React.FC<ImageTableRowProps> = ({ images, open, project }) => {

  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Typography variant="h6" gutterBottom component="div">
              Project Images
            </Typography>
            <ImageTable images={images} project={project} />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
}

const InputStyled = muiStyle(Input)`
  font-size: 12px;
`;

interface ProjectRowProps {
  project: Project;
  imageRowOpen: boolean;
  setImageRowOpen: (open: boolean) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, imageRowOpen,
  setImageRowOpen }) => {

  const { updateProject } = useProjectTable();

  const handleAddProjectImageClick = async () => {
    pickImage(async (file) => {
      if (file) {
        try {
          const newUrl = await addProjectImage(project.id, file);
          const updated: Project = {
            ...project,
            projectImageUrl: newUrl
          };
          updateProject(updated)
        }
        catch (e) {
          logException(e);
          alert("Remove Project Image failed");
          throw e;
        }
        alert("Remove Project Image success! Please refresh");
      }
    })
  };

  const handleRemoveProjectImage = async () => {
    try {
      await removeProjectImage(project.id);
      const updated: Project = {
        ...project,
        projectImageUrl: ""
      };
      // ***********  ToDo - No need to update the DB here **********
      updateProject(updated)
    }
    catch (e) {
      logException(e);
      alert("Remove Project Image failed");
      throw e;
    }
    alert("Remove Project Image success! Please refresh");
  }

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

      <TableCell>
        <InputStyled
          multiline
          value={project.projectName}
          onChange={(e) => {
            const updated: Project = {
              ...project,
              projectName: e.target.value
            };
            updateProject(updated)
          }} />
      </TableCell>
      <TableCell>{project.projectIndex}</TableCell>
      <TableCell>
        {project.projectImageUrl ?
          <ImageSnapshot
            src={project.projectImageUrl}
            alt={`project-${project.projectName}`}
            showAdd={false}
            showRemove={true}
            onRemoveClick={handleRemoveProjectImage}
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
        setImageRowOpen={setShowImages} />

      {/* Expanding Project Images */}
      {project.images && <ImagesTableRow
        images={project.images}
        open={showImages}
        project={project}
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