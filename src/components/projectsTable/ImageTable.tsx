import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Image } from "../../database/dbInterfaces";


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