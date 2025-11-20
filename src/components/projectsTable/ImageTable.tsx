import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import type { Image } from "../../database/dbInterfaces";
import ImageSnapshot from "../imageSnapshot/ImageSnapshot";
import { useRef } from "react";
import { addImageToProject } from "../../database/FirebaseDb";

interface ImageTableProps {
    images: Image[];
    projectId: string;
}

export const ImageTable: React.FC<ImageTableProps> = ({ images, projectId }) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleAddImage = () => { 

        console.log("handleAddImage: causing a click in the ", )
        // cause a click in the hidden input
        // this will trigger the handleFileChange and get the file
        fileInputRef.current?.click();

    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        
        addImageToProject(projectId, file);
        // Create a temporary URL for the selected image
        //const url = URL.createObjectURL(file);
        //setImageUrl(url);
    };



    {/* Hidden input */ }



    return (
        <>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <Table size="small" aria-label="images">
                <TableHead>
                    <TableRow>
                        <TableCell>DB Index</TableCell>
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
                            <TableCell component="th" scope="row">{i}</TableCell>
                            <TableCell component="th" scope="row">{image.imageIndex}</TableCell>
                            <TableCell>
                                <ImageSnapshot src={image.imageUrl} alt={`image-${i}`} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}