import ManagerAuditLog from '../models/ManagerAuditLog';
import { Request } from 'express';

interface LogOptions {
  action: string;
  target: string;
  detail: string;
  managerId: string; // Bắt buộc truyền vào để đảm bảo đúng manager
}

export async function logManagerAction(req: Request, { action, target, detail, managerId }: LogOptions) {
  try {
    const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    console.log('[ManagerAuditLog] Attempt:', { managerId, action, target, detail, ip, userAgent });
    if (!managerId) {
      console.warn('[ManagerAuditLog] Không có managerId, không lưu log!');
      return;
    }
    await ManagerAuditLog.create({
      managerId,
      action,
      target,
      detail,
      ip,
      userAgent,
    });
    console.log('[ManagerAuditLog] Lưu thành công!');
  } catch (err) {
    // Không throw lỗi để không ảnh hưởng flow chính
    console.error('Manager audit log error:', err);
  }
} 