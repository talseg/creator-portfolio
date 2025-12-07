import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Image, Project } from "../../database/dbInterfaces";
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";
import { addImageToProjectImages, removeProjectImageFromImages } from "../../database/FirebaseDb";
import { pickImage } from "../../utilities/pickImage";
import { logException } from "../../utilities/exceptionUtils";
import { useProjectTable } from "./ProjectTableContext";

interface ImageTableProps {
  images: Image[];
  project: Project;
}

export const ImageTable: React.FC<ImageTableProps> = ({ images, project }) => {

  const { updateProject } = useProjectTable();

  const handleAddImageClick = () => {
    pickImage(async (file) => {
      if (file) {
        try {
          const newImage = await addImageToProjectImages(project.id, file);
          const newImages = project.images ? [...project.images, newImage] : [ newImage];
          
          // ***********  ToDo - No need to update the DB here **********
          updateProject({
            ...project,
            images: newImages
          });
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

  const handleRemoveImage = async (image: Image) => {
    try {
      await removeProjectImageFromImages(project.id, image.id);
      const newImages: Image[] | undefined = project.images?.filter((img) => img.id !== image.id);
      if (!newImages) return;
      updateProject(
        {
          ...project,
          images: newImages
        }
      )
    }
    catch (e) {
      logException(e);
      alert("remove Image failed");
      throw e;
    }
    alert("Remove Project Image from images success! Please refresh");
  }

  return (
    <Table size="small" aria-label="images">
      <TableHead>
        <TableRow>
          <TableCell>DB Index</TableCell>
          <TableCell>Image Index</TableCell>
          <TableCell>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button onClick={() => handleAddImageClick()}>+</button>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {images.map((image, i) => (
          <TableRow key={`image-${i}`}>
            <TableCell component="th" scope="row">{i}</TableCell>
            <TableCell component="th" scope="row">{image.imageIndex}</TableCell>
            <TableCell>
              <ImageSnapshot
                src={image.imageUrl}
                alt={`image-${i}`}
                showRemove={true}
                onRemoveClick={() => handleRemoveImage(image)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}