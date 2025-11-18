import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Image } from "../../database/dbInterfaces";
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";


interface ImageTableProps {
    images: Image[];
    projectId: string;
}

export const ImageTable: React.FC<ImageTableProps> = ({ images, projectId }) => {

    const handleAddImage = () => {};

    return (

        <Table size="small" aria-label="images">
            <TableHead>
                <TableRow>
                    <TableCell>Image Index</TableCell>
                    <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <button onClick={() => handleAddImage()}>+</button>
                        </div>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {images.map((image, i) => (
                    <TableRow key={`image-${i}`}>
                        <TableCell component="th" scope="row">{image.imageIndex}</TableCell>
                        <TableCell>
                            <ImageSnapshot src={image.imageUrl} alt={`image-${i}`} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}