import WebSocket from 'ws'
import jwt from 'jsonwebtoken'
import { Server } from 'http'
import { chatService } from '../services/chatService'

interface ChatClient {
  ws: WebSocket
  userId: string
  role: string
  chatId?: string
}

interface ChatMessage {
  type: 'message' | 'join' | 'leave' | 'typing' | 'read' | 'unread_count'
  chatId: string
  userId?: string
  managerId?: string
  content?: string
  role?: 'user' | 'manager'
  timestamp?: Date
  isTyping?: boolean
  attachments?: Array<{
    filename: string
    originalName: string
    mimetype: string
    size: number
    url: string
  }>
  messageType?: 'text' | 'file' | 'image'
}

class ChatWebSocketServer {
  private wss: WebSocket.Server
  private clients: Map<string, ChatClient> = new Map()
  private chatRooms: Map<string, Set<string>> = new Map()

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server })
    this.setupWebSocket()
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      this.handleConnection(ws, request)
    })
  }

  private handleConnection(ws: WebSocket, request: { url?: string }) {
    try {
      // Extract token from query string
      const url = new URL(request.url || '', 'https://apexcv-be.onrender.com')
      const token = url.searchParams.get('token')

      if (!token) {
        ws.close(1008, 'No token provided')
        return
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string; role: string }
      const clientId = `${decoded.id}_${Date.now()}`

      const client: ChatClient = {
        ws,
        userId: decoded.id,
        role: decoded.role
      }

      this.clients.set(clientId, client)

      console.log(`Client connected: ${clientId} (${decoded.role})`)

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message: ChatMessage = JSON.parse(data.toString())
          this.handleMessage(clientId, message)
        } catch (error) {
          console.error('Error parsing message:', error)
        }
      })

      ws.on('close', () => {
        this.handleDisconnect(clientId)
      })

      ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        this.handleDisconnect(clientId)
      })
    } catch (error) {
      console.error('Connection error:', error)
      ws.close(1008, 'Invalid token')
    }
  }

  private handleMessage(clientId: string, message: ChatMessage) {
    const client = this.clients.get(clientId)
    if (!client) return

    switch (message.type) {
      case 'join':
        this.handleJoin(clientId, message.chatId)
        break
      case 'leave':
        this.handleLeave(clientId, message.chatId)
        break
      case 'message':
        this.handleChatMessage(clientId, message)
        break
      case 'typing':
        this.handleTyping(clientId, message)
        break
      case 'read':
        this.handleMarkAsRead(clientId, message.chatId)
        break
      case 'unread_count':
        this.handleUnreadCount(clientId)
        break
    }
  }

  private handleJoin(clientId: string, chatId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    client.chatId = chatId

    // Add to chat room
    if (!this.chatRooms.has(chatId)) {
      this.chatRooms.set(chatId, new Set())
    }
    this.chatRooms.get(chatId)!.add(clientId)

    console.log(`Client ${clientId} joined chat ${chatId}`)

    // Mark messages as read when joining
    this.handleMarkAsRead(clientId, chatId)

    // Notify other clients in the room
    this.broadcastToRoom(
      chatId,
      {
        type: 'join',
        chatId,
        userId: client.userId,
        role: client.role
      },
      clientId
    )
  }

  private handleLeave(clientId: string, chatId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Remove from chat room
    const room = this.chatRooms.get(chatId)
    if (room) {
      room.delete(clientId)
      if (room.size === 0) {
        this.chatRooms.delete(chatId)
      }
    }

    client.chatId = undefined

    console.log(`Client ${clientId} left chat ${chatId}`)

    // Notify other clients in the room
    this.broadcastToRoom(
      chatId,
      {
        type: 'leave',
        chatId,
        userId: client.userId,
        role: client.role
      },
      clientId
    )
  }

  private async handleChatMessage(clientId: string, message: ChatMessage) {
    const client = this.clients.get(clientId)
    if (!client || !message.content) return

    try {
      // Save message to database
      if (client.role === 'manager') {
        await chatService.sendManagerMessage(message.chatId, client.userId, message.content, message.attachments)
      } else {
        await chatService.sendUserMessage(message.chatId, message.content, 'user', false, message.attachments)
      }

      // Broadcast to room
      this.broadcastToRoom(message.chatId, {
        type: 'message',
        chatId: message.chatId,
        content: message.content,
        role: client.role as 'user' | 'manager',
        userId: client.userId,
        timestamp: new Date(),
        attachments: message.attachments,
        messageType: message.messageType
      })

      // If it's a user message, broadcast to all managers
      if (client.role === 'user') {
        this.broadcastToAllManagers({
          type: 'message',
          chatId: message.chatId,
          content: message.content,
          role: client.role as 'user' | 'manager',
          userId: client.userId,
          timestamp: new Date(),
          attachments: message.attachments,
          messageType: message.messageType
        })
      }

      // If it's a manager message, broadcast to the specific user
      if (client.role === 'manager') {
        this.broadcastToUser(message.chatId, {
          type: 'message',
          chatId: message.chatId,
          content: message.content,
          role: client.role as 'user' | 'manager',
          userId: client.userId,
          timestamp: new Date(),
          attachments: message.attachments,
          messageType: message.messageType
        })
      }

      // Update unread count for all clients in the room
      this.updateUnreadCountForRoom(message.chatId)
    } catch (error) {
      console.error('Error handling chat message:', error)
    }
  }

  private async handleMarkAsRead(clientId: string, chatId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    try {
      await chatService.markMessagesAsRead(chatId)

      // Notify other clients that messages were read
      this.broadcastToRoom(
        chatId,
        {
          type: 'read',
          chatId,
          userId: client.userId,
          role: client.role
        },
        clientId
      )

      // Update unread count for all clients in the room
      this.updateUnreadCountForRoom(chatId)
    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }

  private async handleUnreadCount(clientId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    try {
      let unreadCount: number

      if (client.role === 'manager') {
        unreadCount = await chatService.getManagerUnreadCount()
      } else {
        unreadCount = await chatService.getUnreadCount(client.userId)
      }

      // Send unread count to the specific client
      const message = {
        type: 'unread_count',
        unreadCount
      }

      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message))
      }
    } catch (error) {
      console.error('Error getting unread count:', error)
    }
  }

  private async updateUnreadCountForRoom(chatId: string) {
    const room = this.chatRooms.get(chatId)
    if (!room) return

    room.forEach((clientId) => {
      const client = this.clients.get(clientId)
      if (client && client.ws.readyState === WebSocket.OPEN) {
        this.handleUnreadCount(clientId)
      }
    })
  }

  private handleTyping(clientId: string, message: ChatMessage) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Broadcast typing indicator to room
    this.broadcastToRoom(
      message.chatId,
      {
        type: 'typing',
        chatId: message.chatId,
        userId: client.userId,
        role: client.role,
        isTyping: true
      },
      clientId
    )
  }

  private broadcastToRoom(chatId: string, message: any, excludeClientId?: string) {
    const room = this.chatRooms.get(chatId)
    if (!room) return

    const messageStr = JSON.stringify(message)

    room.forEach((clientId) => {
      if (clientId === excludeClientId) return

      const client = this.clients.get(clientId)
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr)
      }
    })
  }

  private handleDisconnect(clientId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Remove from all chat rooms
    if (client.chatId) {
      this.handleLeave(clientId, client.chatId)
    }

    this.clients.delete(clientId)
    console.log(`Client disconnected: ${clientId}`)
  }

  // Public method to broadcast system message
  public broadcastSystemMessage(chatId: string, message: string) {
    this.broadcastToRoom(chatId, {
      type: 'message',
      chatId,
      content: message,
      role: 'system',
      timestamp: new Date()
    })
  }

  // Public method to broadcast unread count update
  public broadcastUnreadCountUpdate(userId: string, role: string) {
    this.clients.forEach((client, clientId) => {
      if (client.userId === userId && client.role === role) {
        this.handleUnreadCount(clientId)
      }
    })
  }

  // Public method to broadcast to all managers
  public broadcastToAllManagers(message: ChatMessage) {
    const messageStr = JSON.stringify(message)

    this.clients.forEach((client) => {
      if (client.role === 'manager' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr)
      }
    })
  }

  // Public method to broadcast to specific user
  public broadcastToUser(chatId: string, message: ChatMessage) {
    const messageStr = JSON.stringify(message)

    this.clients.forEach((client) => {
      if (client.role === 'user' && client.chatId === chatId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(messageStr)
      }
    })
  }
}

export default ChatWebSocketServer
