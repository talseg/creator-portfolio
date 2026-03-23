import { categories, type CategoryType } from "../database/dbInterfaces";

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