import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Image } from "../../database/dbInterfaces";
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";
import { addImageToProject, removeProjectImageFromImages } from "../../database/FirebaseDb";
import { pickImage } from "../../utilities/pickImage";
import { logException } from "../../utilities/exceptionUtils";

interface ImageTableProps {
  images: Image[];
  projectId: string;
}

export const ImageTable: React.FC<ImageTableProps> = ({ images, projectId }) => {

  const handleAddImageClick = () => {
    pickImage(async (file) => {
      if (file) {
        try {
          await addImageToProject(projectId, file);
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
      await removeProjectImageFromImages(projectId, image.id);
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