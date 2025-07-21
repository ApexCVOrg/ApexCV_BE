import { z } from 'zod'

export const GeneralSettingsSchema = z.object({
  shopName: z.string().min(1),
  logoUrl: z.string().url().optional().or(z.literal('')),
  timezone: z.string().min(1),
  currency: z.string().min(1)
})

export const AccountSettingsSchema = z.object({
  profile: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    avatar: z.string().url().optional()
  }),
  passwordLastChanged: z.coerce.date()
})

export const UserManagementSettingsSchema = z.object({
  roles: z.array(z.string().min(1)),
  canInvite: z.boolean()
})

export const InventoryOrderRulesSettingsSchema = z.object({
  lowStockThreshold: z.number().int().min(0),
  slaDays: z.number().int().min(1)
})

export const LocalizationSettingsSchema = z.object({
  defaultLanguage: z.string().min(1),
  enabledLocales: z.array(z.string().min(1))
})

export const NotificationRuleSchema = z.object({
  type: z.string().min(1),
  enabled: z.boolean()
})

export const NotificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  rules: z.array(NotificationRuleSchema)
})

export const ApiKeySchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1),
  createdAt: z.coerce.date()
})

export const IntegrationSettingsSchema = z.object({
  webhooks: z.array(z.string().url()),
  apiKeys: z.array(ApiKeySchema)
})

export const SettingsSchema = z.object({
  general: GeneralSettingsSchema,
  account: AccountSettingsSchema,
  userManagement: UserManagementSettingsSchema,
  inventory: InventoryOrderRulesSettingsSchema,
  localization: LocalizationSettingsSchema,
  notifications: NotificationSettingsSchema,
  integrations: IntegrationSettingsSchema
})
