import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateSettings(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getGeneral = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const general = await settingsService.getGeneral();
    res.json(general);
  } catch (err) {
    next(err);
  }
};

export const updateGeneral = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateGeneral(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await settingsService.getAccount();
    res.json(account);
  } catch (err) {
    next(err);
  }
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateAccount(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getUserManagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userManagement = await settingsService.getUserManagement();
    res.json(userManagement);
  } catch (err) {
    next(err);
  }
};

export const updateUserManagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateUserManagement(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const inventory = await settingsService.getInventory();
    res.json(inventory);
  } catch (err) {
    next(err);
  }
};

export const updateInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateInventory(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getLocalization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const localization = await settingsService.getLocalization();
    res.json(localization);
  } catch (err) {
    next(err);
  }
};

export const updateLocalization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateLocalization(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await settingsService.getNotifications();
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

export const updateNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateNotifications(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getIntegrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const integrations = await settingsService.getIntegrations();
    res.json(integrations);
  } catch (err) {
    next(err);
  }
};

export const updateIntegrations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await settingsService.updateIntegrations(req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
