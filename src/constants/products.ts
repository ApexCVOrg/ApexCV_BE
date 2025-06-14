// product.constants.ts

// Thông báo chung
export const PRODUCT_MESSAGES = {
  CREATE_SUCCESS: "Product created successfully",
  UPDATE_SUCCESS: "Product updated successfully",
  DELETE_SUCCESS: "Product deleted successfully",
  NOT_FOUND: "Product not found",
  ERROR: "An error occurred while processing the product",
};

// Danh sách kích cỡ phổ biến
export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Màu sắc hợp lệ
export const PRODUCT_COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Gray",
  "Orange",
  "Pink",
  "Brown",
];

// Các tag phổ biến để lọc hoặc gợi ý tìm kiếm
export const PRODUCT_TAGS = [
  "New",
  "Hot",
  "Sale",
  "Limited",
  "Trending",
  "Popular",
  "Recommended",
  "Featured",
];

// Giá trị giới hạn mặc định cho đánh giá
export const PRODUCT_RATING_DEFAULTS = {
  AVERAGE: 0,
  QUANTITY: 0,
};

// Mức giới hạn mặc định nếu cần (ví dụ pagination)
export const PRODUCT_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};
