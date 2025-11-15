import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { Image } from "../../database/dbInterfaces";

export interface ImageTableProps {
    images: Image[];
    setImages: (projects: Image[]) => void;
}

export const ImageTable: React.FC<ImageTableProps> = ({images}) => {
    return (
        <>
            <h2>
                Image Table
            </h2>
            <TableContainer component={Paper} sx={{ maxWidth: 550 }}>
                <Table sx={{ maxWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Image Index</TableCell>
                            <TableCell>Image Photo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            images.map((image) => (
                                <TableRow key={image.imageIndex}>
                                    <TableCell>{image.imageIndex}</TableCell>
                                    <TableCell>{image.imageUrl}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}