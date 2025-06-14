import express, { Request, Response, Router } from 'express'
import { Message } from '../models/Message'

const router: Router = express.Router()

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find().populate('conversation sender')
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tin nhắn: ' + (error as Error).message })
  }
})

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findById(req.params.id).populate('conversation sender')
    if (!message) {
      res.status(404).json({ message: 'Không tìm thấy tin nhắn' })
      return
    }
    res.json(message)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin tin nhắn: ' + (error as Error).message })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = new Message(req.body)
    const savedMessage = await message.save()
    res.status(201).json(savedMessage)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi tạo tin nhắn: ' + (error as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!message) {
      res.status(404).json({ message: 'Không tìm thấy tin nhắn' })
      return
    }
    res.json(message)
  } catch (error) {
    res.status(400).json({ message: 'Lỗi khi cập nhật tin nhắn: ' + (error as Error).message })
  }
})

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) {
      res.status(404).json({ message: 'Không tìm thấy tin nhắn' })
      return
    }
    res.json({ message: 'Đã xóa tin nhắn thành công' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa tin nhắn: ' + (error as Error).message })
  }
})

export default router
