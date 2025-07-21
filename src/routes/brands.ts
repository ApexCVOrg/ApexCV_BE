import express, { Request, Response, Router } from 'express';
import { Brand } from '../models/Brand';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy danh sách thương hiệu: ' + (error as Error).message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      return;
    }
    res.json(brand);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Lỗi khi lấy thông tin thương hiệu: ' + (error as Error).message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const brand = new Brand(req.body);
    const savedBrand = await brand.save();
    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo thương hiệu: ' + (error as Error).message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brand) {
      res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      return;
    }
    res.json(brand);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật thương hiệu: ' + (error as Error).message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
      return;
    }
    res.json({ message: 'Đã xóa thương hiệu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa thương hiệu: ' + (error as Error).message });
  }
});

export default router;
