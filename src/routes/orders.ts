import express, { Request, Response, Router } from 'express';
import { Order } from '../models/Order';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('user orderItems.product');
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy danh sách đơn hàng: ' + (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('user orderItems.product');
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      return;
    }
    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy thông tin đơn hàng: ' + (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo đơn hàng: ' + (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      return;
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật đơn hàng: ' + (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
      return;
    }
    res.json({ message: 'Đã xóa đơn hàng thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa đơn hàng: ' + (error as Error).message });
  }
});

export default router;
