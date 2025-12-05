let input: HTMLInputElement | null = null;

function ensureInput(onImageReady: (file: File | undefined) => void) {
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    document.body.appendChild(input);
  }

  // Update the listener each time
  input.onchange = () => {
    const file = input!.files?.[0];
    onImageReady(file);
    input!.value = ""; // reset so selecting same file twice works
  };

  return input;
}

export function pickImage(onImageReady: (file: File | undefined) => void) {
  const inputEl = ensureInput(onImageReady);
  inputEl.click();
}