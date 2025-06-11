import { Request, Response, NextFunction } from 'express';
import { Permission, RolePermissions } from '../types/filter/permissions';

// Helper function to check if user has permission
const hasPermission = (userRole: string, requiredPermission: Permission): boolean => {
  const userPermissions = RolePermissions[userRole.toLowerCase() as keyof typeof RolePermissions];
  return userPermissions ? userPermissions.includes(requiredPermission) : false;
};

export const checkPermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized - No user found' 
        });
        return;
      }

      const userRole = req.user.role.toLowerCase();
      
      if (!hasPermission(userRole, requiredPermission)) {
        res.status(403).json({ 
          success: false,
          message: 'Permission denied',
          required: requiredPermission,
          role: userRole
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error during permission check' 
      });
    }
  };
};

// Middleware to check multiple permissions (user must have all specified permissions)
export const checkPermissions = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized - No user found' 
        });
        return;
      }

      const userRole = req.user.role.toLowerCase();
      
      const hasAllPermissions = requiredPermissions.every(permission => 
        hasPermission(userRole, permission)
      );

      if (!hasAllPermissions) {
        res.status(403).json({ 
          success: false,
          message: 'Permission denied',
          required: requiredPermissions,
          role: userRole
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error during permission check' 
      });
    }
  };
};

// Middleware to check if user has any of the specified permissions
export const checkAnyPermission = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({ 
          success: false,
          message: 'Unauthorized - No user found' 
        });
        return;
      }

      const userRole = req.user.role.toLowerCase();
      
      const hasAnyPermission = requiredPermissions.some(permission => 
        hasPermission(userRole, permission)
      );

      if (!hasAnyPermission) {
        res.status(403).json({ 
          success: false,
          message: 'Permission denied',
          required: requiredPermissions,
          role: userRole
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Internal server error during permission check' 
      });
    }
  };
}; 