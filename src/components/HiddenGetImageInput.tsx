import { forwardRef, type ChangeEvent } from "react";

interface GetImageProps {
  onImageReady: (file: File | undefined) => void;
}

// pickImage is used instead
export const HiddenGetImageInput = forwardRef<HTMLInputElement, GetImageProps>(
  ({ onImageReady }, ref) => {

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onImageReady(event.target.files?.[0]);
    };

    return (
      <input
        type="file"
        accept="image/*"
        ref={ref}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    );
  }
);

HiddenGetImageInput.displayName = "HiddenGetImageInput";
