import AuditLog from '../models/AuditLog';
import { Request } from 'express';

interface LogOptions {
  action: string;
  target: string;
  detail: string;
  adminId: string; // Bắt buộc truyền vào để đảm bảo đúng admin
}

export async function logAdminAction(req: Request, { action, target, detail, adminId }: LogOptions) {
  try {
    const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    console.log('[AuditLog] Attempt:', { adminId, action, target, detail, ip, userAgent });
    if (!adminId) {
      console.warn('[AuditLog] Không có adminId, không lưu log!');
      return;
    }
    await AuditLog.create({
      adminId,
      action,
      target,
      detail,
      ip,
      userAgent,
    });
    console.log('[AuditLog] Lưu thành công!');
  } catch (err) {
    // Không throw lỗi để không ảnh hưởng flow chính
    console.error('Audit log error:', err);
  }
} 