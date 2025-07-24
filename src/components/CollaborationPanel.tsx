import React, { useState } from 'react'
import { Users, MessageCircle, Video, Share2, Crown, Dot } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

interface User {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy'
  isOwner?: boolean
  currentFile?: string
  cursorPosition?: { line: number; column: number }
}

interface CollaborationPanelProps {
  isVisible: boolean
  onToggle: () => void
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'You',
    avatar: '/api/placeholder/32/32',
    status: 'online',
    isOwner: true,
    currentFile: 'main.py',
    cursorPosition: { line: 12, column: 4 }
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: '/api/placeholder/32/32',
    status: 'online',
    currentFile: 'utils.py',
    cursorPosition: { line: 8, column: 15 }
  },
  {
    id: '3',
    name: 'Alex Kumar',
    avatar: '/api/placeholder/32/32',
    status: 'away',
    currentFile: 'config.json'
  },
  {
    id: '4',
    name: 'Maria Garcia',
    avatar: '/api/placeholder/32/32',
    status: 'busy',
    currentFile: 'README.md'
  }
]

export function CollaborationPanel({ isVisible, onToggle }: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'chat'>('users')
  const [chatMessage, setChatMessage] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400'
      case 'away': return 'bg-yellow-400'
      case 'busy': return 'bg-red-400'
      default: return 'bg-slate-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online'
      case 'away': return 'Away'
      case 'busy': return 'Busy'
      default: return 'Offline'
    }
  }

  if (!isVisible) {
    return (
      <div className="w-12 bg-slate-800 border-l border-slate-700 flex flex-col items-center py-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          onClick={onToggle}
        >
          <Users className="w-4 h-4" />
        </Button>
        <div className="mt-2 text-xs text-slate-500 writing-mode-vertical">
          {mockUsers.filter(u => u.status === 'online').length}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-200">Collaboration</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
            onClick={onToggle}
          >
            ×
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setActiveTab('users')}
          >
            <Users className="w-3 h-3 mr-1" />
            Users ({mockUsers.length})
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'ghost'}
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Chat
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'users' ? (
          <div className="p-3 space-y-3">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-700/50">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xs bg-slate-600 text-slate-200">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-800 ${getStatusColor(user.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {user.name}
                    </span>
                    {user.isOwner && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Dot className={`w-3 h-3 ${getStatusColor(user.status)}`} />
                    <span className="text-xs text-slate-400">
                      {getStatusText(user.status)}
                    </span>
                  </div>
                  
                  {user.currentFile && (
                    <div className="text-xs text-slate-500 mt-1">
                      Editing: {user.currentFile}
                      {user.cursorPosition && (
                        <span className="ml-1">
                          (Ln {user.cursorPosition.line})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Separator className="my-4 bg-slate-700" />
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Share2 className="w-3 h-3 mr-2" />
                Share Repl
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Video className="w-3 h-3 mr-2" />
                Start Video Call
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Chat Messages */}
            <div className="flex-1 p-3 space-y-3">
              <div className="text-xs text-slate-500 text-center">
                Chat started • Today at 2:30 PM
              </div>
              
              <div className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-slate-600">SC</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-slate-400">Sarah Chen • 2:31 PM</div>
                  <div className="text-sm text-slate-200 mt-1">
                    Hey! I'm working on the utils.py file. Let me know if you need anything!
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-slate-600">You</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs text-slate-400">You • 2:33 PM</div>
                  <div className="text-sm text-slate-200 mt-1">
                    Perfect! I'm focusing on the main.py logic. Looking good so far 👍
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-3 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && chatMessage.trim()) {
                      // Handle send message
                      setChatMessage('')
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  disabled={!chatMessage.trim()}
                  className="px-3"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}