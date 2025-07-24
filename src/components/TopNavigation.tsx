import React, { useState } from 'react'
import { Play, Square, RotateCcw, Settings, Share2, Users, Save, GitBranch, Cloud, Zap, Crown } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface TopNavigationProps {
  language: string
  onLanguageChange: (language: string) => void
  isRunning: boolean
  onRun: () => void
  onCollaborationToggle: () => void
  collaborators?: number
  isSaved?: boolean
}

export function TopNavigation({ 
  language, 
  onLanguageChange, 
  isRunning, 
  onRun, 
  onCollaborationToggle,
  collaborators = 3,
  isSaved = true
}: TopNavigationProps) {
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = () => {
    setIsDeploying(true)
    setTimeout(() => setIsDeploying(false), 2000)
  }

  return (
    <div className="h-12 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-700">
      {/* Left Section - Project info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-white font-medium">Python IDE Clone</span>
          {!isSaved && (
            <div className="w-2 h-2 bg-orange-400 rounded-full" title="Unsaved changes" />
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
          <Badge variant="secondary" className="h-5 text-xs bg-green-900 text-green-300 border-green-700">
            <Crown className="w-2 h-2 mr-1" />
            Owner
          </Badge>
        </div>
      </div>

      {/* Center - Run controls */}
      <div className="flex items-center gap-3">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600 text-white text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            <SelectItem value="python">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                Python
              </div>
            </SelectItem>
            <SelectItem value="javascript">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full" />
                JavaScript
              </div>
            </SelectItem>
            <SelectItem value="typescript">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                TypeScript
              </div>
            </SelectItem>
            <SelectItem value="java">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                Java
              </div>
            </SelectItem>
            <SelectItem value="cpp">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                C++
              </div>
            </SelectItem>
            <SelectItem value="html">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full" />
                HTML
              </div>
            </SelectItem>
            <SelectItem value="css">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full" />
                CSS
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onRun}
          className={`h-8 px-4 font-medium ${
            isRunning 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Square className="w-3 h-3 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-2" />
              Run
            </>
          )}
        </Button>
      </div>

      {/* Right Section - Actions and user */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 text-slate-300 hover:text-white hover:bg-slate-800 ${isDeploying ? 'animate-pulse' : ''}`}
          onClick={handleDeploy}
          title="Deploy"
        >
          <Cloud className={`w-4 h-4 ${isDeploying ? 'text-blue-400' : ''}`} />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-slate-300 hover:text-white hover:bg-slate-800 relative"
          onClick={onCollaborationToggle}
          title="Collaboration"
        >
          <Users className="w-4 h-4" />
          {collaborators > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-green-600 text-white border-slate-900">
              {collaborators}
            </Badge>
          )}
        </Button>

        <div className="w-px h-6 bg-slate-600 mx-2" />

        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src="/api/placeholder/28/28" alt="User" />
            <AvatarFallback className="text-xs bg-slate-600 text-slate-200">
              You
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="text-xs text-slate-300">Pro</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-slate-300 hover:text-white hover:bg-slate-800"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}