/* eslint-disable */
import express, { Request, Response, Router } from 'express'
import { Review } from '../models/Review'
import { authenticateToken, isAdmin } from '../middlewares/auth'
import { Order } from '../models/Order'
import { sendReviewDeletedEmail } from '../services/email.service'

const router: Router = express.Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = {};
    if (req.query.product) filter.product = req.query.product;
    if (req.query.user) filter.user = req.query.user;
    const reviews = await Review.find(filter).populate('user product');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá: ' + (error as Error).message })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id).populate('user product')
    if (!review) {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' })
      return
    }
    res.json(review)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin đánh giá: ' + (error as Error).message })
  }
})

router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user._id
    const { product: productId, rating, comment } = req.body
    // Kiểm tra user đã mua sản phẩm này chưa
    const hasBought = await Order.exists({
      user: userId,
      'orderItems.product': productId,
      orderStatus: { $in: ['paid', 'shipped', 'delivered'] },
    })
    if (!hasBought) {
      res.status(403).json({ message: 'Bạn chỉ có thể đánh giá sản phẩm đã mua.' })
      return
    }
    // Kiểm tra đã review chưa (mỗi user chỉ review 1 lần cho 1 sản phẩm)
    const existed = await Review.findOne({ user: userId, product: productId })
    if (existed) {
      res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này.' })
      return
    }
    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    })
    const savedReview = await review.save()
    res.status(201).json(savedReview)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo đánh giá: ' + (error as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!review) {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' })
      return
    }
    res.json(review)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật đánh giá: ' + (error as Error).message })
  }
})

router.delete('/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    // Lấy đầy đủ thông tin review trước khi xóa
    const review = await Review.findById(req.params.id).populate('user product')
    if (!review) {
      res.status(404).json({ message: 'Không tìm thấy đánh giá' })
      return
    }
    // Lưu thông tin cần thiết trước khi xóa
    const userEmail = (review.user && typeof review.user === 'object' && typeof (review.user as any).email === 'string')
      ? (review.user as any).email
      : null;
    const productName = (review.product && typeof review.product === 'object' && typeof (review.product as any).name === 'string')
      ? (review.product as any).name
      : null;
    let reviewContent = typeof review.comment === 'string' ? review.comment : '';
    if (!reviewContent || !reviewContent.trim()) {
      reviewContent = '(Không có nội dung đánh giá)';
    }
    // Xóa review
    await Review.findByIdAndDelete(req.params.id);
    // Gửi email nếu đủ thông tin
    console.log('[Review Delete Email] userEmail:', userEmail, '| productName:', productName, '| reviewContent:', reviewContent);
    if (userEmail && productName) {
      try {
        await sendReviewDeletedEmail(userEmail, productName, reviewContent);
      } catch (mailErr) {
        console.error('Không gửi được email thông báo xóa đánh giá:', mailErr);
      }
    }
    res.json({ message: 'Đã xóa đánh giá thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đánh giá: ' + (error as Error).message })
  }
})

// Lấy rating trung bình của 1 sản phẩm
router.get('/average/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.productId
    const result = await Review.aggregate([
      { $match: { product: new (require('mongoose')).Types.ObjectId(productId) } },
      { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    if (result.length === 0) {
      res.json({ average: 0, count: 0 })
      return
    }
    res.json({ average: result[0].average, count: result[0].count })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy rating trung bình: ' + (error as Error).message })
  }
})

// Lấy tất cả reviews của 1 sản phẩm
router.get('/product/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'fullName avatar');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá: ' + (error as Error).message });
  }
});

export default router