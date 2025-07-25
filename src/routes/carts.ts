/* eslint-disable */
import express, { Request, Response, Router } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { authenticateToken } from '../middlewares/auth';

const router: Router = express.Router();

// Rate limiting for cart requests
const requestCache = new Map<string, { timestamp: number; promise: Promise<any> }>();
const CACHE_DURATION = 2000; // 2 seconds cache

// Cleanup old cache entries every 5 seconds
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
}, 5000);

// Lấy giỏ hàng của user hiện tại
router.get('/user', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('GET /carts/user - Request received');
    const userId = (req as any).user.id;
    console.log('User ID:', userId);
    
    // Check if we have a recent request for this user
    const cacheKey = `cart_${userId}`;
    const cachedRequest = requestCache.get(cacheKey);
    
    if (cachedRequest && Date.now() - cachedRequest.timestamp < CACHE_DURATION) {
      console.log('Returning cached cart response for user:', userId);
      const result = await cachedRequest.promise;
      res.json(result);
      return;
    }
    
    // Add timeout protection - increased to 30 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 30000); // 30 second timeout
    });
    
    // Add query optimization with better caching
    const cartPromise = Cart.findOne({ user: userId })
      .populate({
        path: 'cartItems.product',
        select: 'name price images sizes brand categories'
      })
      .lean(); // Use lean() for better performance
    
    // Create new promise for this request
    const newPromise = Promise.race([cartPromise, timeoutPromise]) as Promise<any>;
    
    // Cache this request
    requestCache.set(cacheKey, {
      timestamp: Date.now(),
      promise: newPromise
    });
    
    let cart = await newPromise;
    console.log('Cart found:', cart ? 'Yes' : 'No');

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = new Cart({ user: userId, cartItems: [] });
      await cart.save();
      cart = cart.toObject();
    }
    
    // Map lại cartItems để trả về stock từng biến thể
    const cartItems = cart.cartItems.map((item: any) => {
      let stock = null;
      // Ensure product is populated and has sizes
      if (
        item.product &&
        typeof item.product === 'object' &&
        'sizes' in item.product &&
        Array.isArray(item.product.sizes) &&
        item.size
      ) {
        const matched = item.product.sizes.find(
          (s: any) => s.size === item.size && (!item.color || s.color === item.color),
        );
        stock = matched ? matched.stock : null;
      }
      return { ...item, stock };
    });
    
    const result = { ...cart, cartItems };
    
    // Cache the result for 5 seconds to reduce database calls
    setTimeout(() => {
      requestCache.delete(cacheKey);
    }, 5000);
    
    res.json(result);
  } catch (error) {
    console.error('Cart API Error:', error);
    
    // Clean up cache on error
    const userId = (req as any).user.id;
    const cacheKey = `cart_${userId}`;
    requestCache.delete(cacheKey);
    
    if (error instanceof Error && error.message === 'Request timeout') {
      res.status(408).json({ message: 'Request timeout - server is busy, please try again' });
    } else {
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng: ' + (error as Error).message });
    }
  }
});

// Thêm sản phẩm vào giỏ hàng
router.post('/add', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { productId, quantity = 1, size, color } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Sản phẩm không tồn tại' });
      return;
    }

    // Kiểm tra stock nếu có size
    if (size) {
      const sizeStock = product.sizes.find((s) => s.size === size);
      if (!sizeStock || sizeStock.stock < quantity) {
        res.status(400).json({ message: 'Sản phẩm không đủ số lượng trong kho' });
        return;
      }
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = new Cart({ user: userId, cartItems: [] });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.size === size && item.color === color,
    );

    if (existingItemIndex > -1) {
      // Cập nhật số lượng nếu đã có
      cart.cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Thêm sản phẩm mới
      cart.cartItems.push({
        product: productId,
        quantity,
        size,
        color,
      });
    }

    cart.updatedAt = new Date();
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi thêm vào giỏ hàng: ' + (error as Error).message });
  }
});

// Cập nhật số lượng, size, color sản phẩm trong giỏ hàng
router.put(
  '/update/:itemId',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;
      const { quantity, size, color } = req.body;

      if (quantity !== undefined && quantity <= 0) {
        res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
        return;
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        return;
      }

      const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === itemId);
      if (itemIndex === -1) {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        return;
      }

      // Kiểm tra stock nếu có size
      const product = await Product.findById(cart.cartItems[itemIndex].product);
      if (product && (size || cart.cartItems[itemIndex].size)) {
        const checkSize = size || cart.cartItems[itemIndex].size;
        const sizeStock = product.sizes.find((s) => s.size === checkSize);
        const checkQuantity =
          quantity !== undefined ? quantity : cart.cartItems[itemIndex].quantity;
        if (sizeStock && sizeStock.stock < checkQuantity) {
          res.status(400).json({ message: 'Sản phẩm không đủ số lượng trong kho' });
          return;
        }
      }

      // Cập nhật các trường
      if (quantity !== undefined) cart.cartItems[itemIndex].quantity = quantity;
      if (size !== undefined) cart.cartItems[itemIndex].size = size;
      if (color !== undefined) cart.cartItems[itemIndex].color = color;
      cart.updatedAt = new Date();
      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
      res.json(updatedCart);
    } catch (error) {
      res.status(400).json({ message: 'Lỗi khi cập nhật giỏ hàng: ' + (error as Error).message });
    }
  },
);

// Xóa sản phẩm khỏi giỏ hàng
router.delete(
  '/remove/:itemId',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        return;
      }

      cart.cartItems.pull({ _id: itemId });
      cart.updatedAt = new Date();
      await cart.save();

      const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
      res.json(updatedCart);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng: ' + (error as Error).message });
    }
  },
);

// Xóa toàn bộ giỏ hàng
router.delete('/clear', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.cartItems.splice(0, cart.cartItems.length);
      cart.updatedAt = new Date();
      await cart.save();
    }

    res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng: ' + (error as Error).message });
  }
});

// API cũ để tương thích
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const carts = await Cart.find().populate('user cartItems.product');
    res.json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy danh sách giỏ hàng: ' + (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findById(req.params.id).populate('user cartItems.product');
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
      return;
    }
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy thông tin giỏ hàng: ' + (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = new Cart(req.body);
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo giỏ hàng: ' + (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
      return;
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật giỏ hàng: ' + (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findByIdAndDelete(req.params.id);
    if (!cart) {
      res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
      return;
    }
    res.json({ message: 'Đã xóa giỏ hàng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng: ' + (error as Error).message });
  }
});

export default router;
