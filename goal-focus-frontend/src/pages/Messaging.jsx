import React, { useState, useEffect } from 'react'
import { api } from '../utils/api'

export default function Messaging() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.getMessages()
        if (res.success) setMessages(res.data)
      } catch (err) {
        console.error('Error fetching messages:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      const messageData = {
        from: 'user1',
        to: selectedChat.id,
        text: newMessage,
        timestamp: new Date().toISOString()
      }
      const res = await api.sendMessage(messageData)
      if (res.success) {
        setMessages([...messages, res.data])
        setNewMessage('')
      }
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const chatContacts = [
    { id: 1, name: 'Sarah Johnson', avatar: '👩‍🏫', status: 'online', unread: 3 },
    { id: 2, name: 'Priya Sharma', avatar: '👩‍💻', status: 'online', unread: 0 },
    { id: 3, name: 'Marcus Chen', avatar: '👨‍🏫', status: 'offline', unread: 1 },
    { id: 4, name: 'Emma Wilson', avatar: '👩‍🏫', status: 'online', unread: 0 },
  ]

  const getMessagesForChat = (chatId) => {
    return messages.filter(m => m.to === chatId || m.from === chatId)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

        <div className="grid grid-cols-3 gap-6 h-screen max-h-96">
          {/* Chat List */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <input type="text" placeholder="Search chats..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div className="overflow-y-auto">
              {chatContacts.map((contact) => (
                <div key={contact.id} onClick={() => setSelectedChat(contact)} className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                  selectedChat?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{contact.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-900">{contact.name}</p>
                        <p className={`text-xs ${contact.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                          {contact.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </p>
                      </div>
                    </div>
                    {contact.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{contact.unread}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Window */}
          <div className="col-span-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedChat.avatar}</div>
                    <div>
                      <p className="font-semibold">{selectedChat.name}</p>
                      <p className={`text-xs ${selectedChat.status === 'online' ? 'text-blue-100' : 'text-blue-200'}`}>
                        {selectedChat.status === 'online' ? '🟢 Active now' : '⚫ Away'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">📞</button>
                    <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">📹</button>
                    <button className="p-2 hover:bg-blue-700 rounded-lg transition-colors">ℹ️</button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <p className="text-gray-600 text-center">Loading messages...</p>
                  ) : getMessagesForChat(selectedChat.id).length > 0 ? (
                    getMessagesForChat(selectedChat.id).map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === 'user1' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}>
                          <p>{msg.text || msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.from === 'user1' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start a conversation!</p>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-2">
                    <button type="button" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">📎</button>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    <button type="button" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">😊</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
