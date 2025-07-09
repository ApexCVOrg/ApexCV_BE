import { Settings, ISettings } from '../models/Settings'
import {
  SettingsSchema,
  GeneralSettingsSchema,
  AccountSettingsSchema,
  UserManagementSettingsSchema,
  InventoryOrderRulesSettingsSchema,
  LocalizationSettingsSchema,
  NotificationSettingsSchema,
  IntegrationSettingsSchema
} from '../validations/settings'
import { z } from 'zod'

class SettingsService {
  async getSettings(): Promise<ISettings | null> {
    return Settings.findOne()
  }

  async updateSettings(data: unknown): Promise<ISettings> {
    const parsed = SettingsSchema.parse(data)
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings(parsed)
    } else {
      settings.set(parsed)
    }
    await settings.save()
    return settings
  }

  async getSection<T>(section: keyof ISettings): Promise<T | null> {
    const settings = await Settings.findOne()
    return settings ? (settings[section] as T) : null
  }

  async updateSection<T>(section: keyof ISettings, data: unknown, schema: z.ZodSchema<T>): Promise<T> {
    const parsed = schema.parse(data)
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings({ [section]: parsed })
    } else {
      settings.set({ [section]: parsed })
    }
    await settings.save()
    return parsed
  }

  // Section-specific helpers
  getGeneral() { return this.getSection('general') }
  updateGeneral(data: unknown) { return this.updateSection('general', data, GeneralSettingsSchema) }

  getAccount() { return this.getSection('account') }
  updateAccount(data: unknown) { return this.updateSection('account', data, AccountSettingsSchema) }

  getUserManagement() { return this.getSection('userManagement') }
  updateUserManagement(data: unknown) { return this.updateSection('userManagement', data, UserManagementSettingsSchema) }

  getInventory() { return this.getSection('inventory') }
  updateInventory(data: unknown) { return this.updateSection('inventory', data, InventoryOrderRulesSettingsSchema) }

  getLocalization() { return this.getSection('localization') }
  updateLocalization(data: unknown) { return this.updateSection('localization', data, LocalizationSettingsSchema) }

  getNotifications() { return this.getSection('notifications') }
  updateNotifications(data: unknown) { return this.updateSection('notifications', data, NotificationSettingsSchema) }

  getIntegrations() { return this.getSection('integrations') }
  updateIntegrations(data: unknown) { return this.updateSection('integrations', data, IntegrationSettingsSchema) }
}

export const settingsService = new SettingsService() 