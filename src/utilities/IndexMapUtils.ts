import { categories, type CategoryType } from "../database/dbInterfaces";
import type { ScrollAreaType } from "./useImageScrolling";

export const categoryToIndex = {
  designer: categories.indexOf("designer"),
  artist: categories.indexOf("artist"),
  illustrator: categories.indexOf("illustrator"),
} satisfies Record<CategoryType, number>;

function validateCategoryMapping() {
  const uniqueIndices = new Set(Object.values(categoryToIndex));
  if (uniqueIndices.size !== categories.length) {
    throw new Error("categoryToIndex contains duplicate indices");
  }
}

validateCategoryMapping();

export const numberToScrollArea = (index: number): ScrollAreaType => {
  if (index < 0 || index >= categories.length) {
    throw new Error(`Invalid scroll area index: ${index}`);
  }
  return index as ScrollAreaType;
};

