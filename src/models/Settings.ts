import mongoose, { Schema, Document } from 'mongoose';

export interface GeneralSettings {
  shopName: string;
  logoUrl: string;
  timezone: string;
  currency: string;
}

export interface AccountSettings {
  profile: {
    fullName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  passwordLastChanged: Date;
}

export interface UserManagementSettings {
  roles: string[];
  canInvite: boolean;
}

export interface InventoryOrderRulesSettings {
  lowStockThreshold: number;
  slaDays: number;
}

export interface LocalizationSettings {
  defaultLanguage: string;
  enabledLocales: string[];
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  rules: {
    type: string;
    enabled: boolean;
  }[];
}

export interface IntegrationSettings {
  webhooks: string[];
  apiKeys: { name: string; key: string; createdAt: Date }[];
}

export interface ISettings extends Document {
  general: GeneralSettings;
  account: AccountSettings;
  userManagement: UserManagementSettings;
  inventory: InventoryOrderRulesSettings;
  localization: LocalizationSettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  updatedAt: Date;
}

const GeneralSettingsSchema = new Schema<GeneralSettings>(
  {
    shopName: { type: String, required: true },
    logoUrl: { type: String, required: false },
    timezone: { type: String, required: true },
    currency: { type: String, required: true },
  },
  { _id: false },
);

const AccountSettingsSchema = new Schema<AccountSettings>(
  {
    profile: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      avatar: { type: String },
    },
    passwordLastChanged: { type: Date, required: true },
  },
  { _id: false },
);

const UserManagementSettingsSchema = new Schema<UserManagementSettings>(
  {
    roles: [{ type: String, required: true }],
    canInvite: { type: Boolean, default: true },
  },
  { _id: false },
);

const InventoryOrderRulesSettingsSchema = new Schema<InventoryOrderRulesSettings>(
  {
    lowStockThreshold: { type: Number, default: 10 },
    slaDays: { type: Number, default: 3 },
  },
  { _id: false },
);

const LocalizationSettingsSchema = new Schema<LocalizationSettings>(
  {
    defaultLanguage: { type: String, required: true },
    enabledLocales: [{ type: String, required: true }],
  },
  { _id: false },
);

const NotificationSettingsSchema = new Schema<NotificationSettings>(
  {
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    rules: [
      {
        type: { type: String, required: true },
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  { _id: false },
);

const IntegrationSettingsSchema = new Schema<IntegrationSettings>(
  {
    webhooks: [{ type: String }],
    apiKeys: [
      {
        name: { type: String, required: true },
        key: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false },
);

const SettingsSchema = new Schema<ISettings>({
  general: { type: GeneralSettingsSchema, required: true },
  account: { type: AccountSettingsSchema, required: true },
  userManagement: { type: UserManagementSettingsSchema, required: true },
  inventory: { type: InventoryOrderRulesSettingsSchema, required: true },
  localization: { type: LocalizationSettingsSchema, required: true },
  notifications: { type: NotificationSettingsSchema, required: true },
  integrations: { type: IntegrationSettingsSchema, required: true },
  updatedAt: { type: Date, default: Date.now },
});

SettingsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

SettingsSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
