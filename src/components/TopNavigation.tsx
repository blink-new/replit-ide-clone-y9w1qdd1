import React from 'react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Play, Square, Settings, Users, Share } from 'lucide-react'

interface TopNavigationProps {
  language: string
  onLanguageChange: (language: string) => void
  isRunning: boolean
  onRun: () => void
}

export function TopNavigation({ language, onLanguageChange, isRunning, onRun }: TopNavigationProps) {
  return (
    <div className="h-12 bg-slate-900 text-white flex items-center justify-between px-4 border-b border-slate-700">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-xs font-bold">
            R
          </div>
          <span className="font-medium text-sm">My Repl</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onRun}
            size="sm"
            className={`${
              isRunning 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isRunning ? (
              <>
                <Square className="w-3 h-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Run
              </>
            )}
          </Button>
          
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32 h-8 bg-slate-800 border-slate-600 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
          <Users className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
          <Share className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}