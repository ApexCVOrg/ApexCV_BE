// Category status constants
export const CATEGORY_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

// Category field names
export const CATEGORY_FIELDS = [
  "name",
  "description",
  "parentCategory",
  "status",
  "createdAt",
  "updatedAt",
];

// Category messages
export const CATEGORY_MESSAGES = {
  CREATE_SUCCESS: "Category created successfully!",
  UPDATE_SUCCESS: "Category updated successfully!",
  DELETE_SUCCESS: "Category deleted successfully!",
  ERROR: "An error occurred with category.",
};
