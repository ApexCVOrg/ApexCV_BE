// src/firebase.ts
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config()

if (!admin.apps.length) {
  const serviceAccountPath = path.resolve(__dirname, './nidas-s-chat-box-firebase-adminsdk-fbsvc-c726f209a0.json')

  const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, 'utf8')
  )

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  })
}

export const db = admin.firestore()
export default admin
