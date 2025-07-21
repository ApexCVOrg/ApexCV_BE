import express, { Request, Response, Router } from 'express';
import { Category } from '../models/Category';
import { CATEGORY_MESSAGES } from '../constants/categories';

const router: Router = express.Router();

// Helper function to build category tree
const buildCategoryTree = (categories: any[], parentId: string | null = null): any[] => {
  return categories
    .filter((cat) => {
      if (parentId === null) {
        return !cat.parentCategory;
      }
      return cat.parentCategory && cat.parentCategory.toString() === parentId;
    })
    .map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      description: cat.description || '',
      status: cat.status,
      parentCategory: cat.parentCategory ? cat.parentCategory.toString() : null,
      children: buildCategoryTree(categories, cat._id.toString()),
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));
};

// Get all categories as flat list
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { tree } = req.query;
    const categories = await Category.find().sort({ createdAt: 1 }).lean();

    // If tree parameter is provided, return hierarchical structure
    if (tree === 'true') {
      const treeStructure = buildCategoryTree(categories);
      res.json(treeStructure);
      return;
    }

    // Default: return flat list
    const mappedCategories = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      description: cat.description || '',
      status: cat.status,
      parentCategory: cat.parentCategory
        ? {
            id: cat.parentCategory.toString(),
            name:
              categories.find((c) => c._id.toString() === cat.parentCategory?.toString())?.name ||
              'Unknown',
          }
        : null,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    res.json(mappedCategories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res
      .status(500)
      .json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || 'Unknown error' });
  }
});

// Get categories as tree structure (alternative endpoint)
router.get('/tree', async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 }).lean();
    const treeStructure = buildCategoryTree(categories);
    res.json(treeStructure);
  } catch (error: any) {
    console.error('Error fetching category tree:', error);
    res
      .status(500)
      .json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || 'Unknown error' });
  }
});

// Create category
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, parentCategory, status } = req.body;
    const category = new Category({
      name,
      description,
      parentCategory: parentCategory || null,
      status,
    });
    const saved = await category.save();
    res.status(201).json({ ...saved.toObject(), message: CATEGORY_MESSAGES.CREATE_SUCCESS });
  } catch (error: any) {
    console.error('Error creating category:', error);
    res
      .status(400)
      .json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || 'Unknown error' });
  }
});

// Update category
router.put('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, parentCategory, status } = req.body;

    // Prevent category being its own parent
    if (id === parentCategory) {
      res.status(400).json({ message: 'Category cannot be its own parent' });
      return;
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, description, parentCategory: parentCategory || null, status },
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ message: CATEGORY_MESSAGES.ERROR });
      return;
    }
    res.json({ ...updated.toObject(), message: CATEGORY_MESSAGES.UPDATE_SUCCESS });
  } catch (error: any) {
    console.error('Error updating category:', error);
    res
      .status(400)
      .json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || 'Unknown error' });
  }
});

// Delete category
router.delete('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if category has children
    const hasChildren = await Category.exists({ parentCategory: id });
    if (hasChildren) {
      res.status(400).json({ message: 'Cannot delete category with subcategories' });
      return;
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: CATEGORY_MESSAGES.ERROR });
      return;
    }
    res.json({ message: CATEGORY_MESSAGES.DELETE_SUCCESS });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res
      .status(500)
      .json({ message: CATEGORY_MESSAGES.ERROR, error: error?.message || 'Unknown error' });
  }
});

export default router;
