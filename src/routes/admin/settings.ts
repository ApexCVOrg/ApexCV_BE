import { Router } from 'express'
import * as settingsController from '../../controllers/settingsController'

const router = Router()

// All settings
router.get('/', settingsController.getSettings)
router.put('/', settingsController.updateSettings)

// General
router.get('/general', settingsController.getGeneral)
router.put('/general', settingsController.updateGeneral)

// Account
router.get('/account', settingsController.getAccount)
router.put('/account', settingsController.updateAccount)

// User Management
router.get('/userManagement', settingsController.getUserManagement)
router.put('/userManagement', settingsController.updateUserManagement)

// Inventory/Order Rules
router.get('/inventory', settingsController.getInventory)
router.put('/inventory', settingsController.updateInventory)

// Localization
router.get('/localization', settingsController.getLocalization)
router.put('/localization', settingsController.updateLocalization)

// Notifications
router.get('/notifications', settingsController.getNotifications)
router.put('/notifications', settingsController.updateNotifications)

// Integrations
router.get('/integrations', settingsController.getIntegrations)
router.put('/integrations', settingsController.updateIntegrations)

export default router
