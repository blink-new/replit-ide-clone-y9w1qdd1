import React from 'react'
import { GitBranch, Wifi, Bell, Settings, Users, Zap } from 'lucide-react'
import { Button } from './ui/button'

interface StatusBarProps {
  activeFile: string | null
  language: string
  cursorPosition?: { line: number; column: number }
  isConnected?: boolean
  collaborators?: number
}

export function StatusBar({ 
  activeFile, 
  language, 
  cursorPosition = { line: 1, column: 1 },
  isConnected = true,
  collaborators = 0
}: StatusBarProps) {
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return 'text-yellow-400'
      case 'javascript': return 'text-yellow-300'
      case 'typescript': return 'text-blue-400'
      case 'java': return 'text-orange-500'
      case 'cpp': return 'text-blue-500'
      case 'html': return 'text-orange-400'
      case 'css': return 'text-pink-400'
      case 'json': return 'text-orange-300'
      case 'markdown': return 'text-blue-300'
      default: return 'text-slate-400'
    }
  }

  const formatFileSize = (fileName: string) => {
    // Simulate file sizes for demo
    const sizes: Record<string, string> = {
      'main.py': '1.2 KB',
      'utils.py': '856 B',
      'config.json': '234 B',
      'README.md': '2.1 KB',
      'requirements.txt': '145 B',
      'test_main.py': '678 B'
    }
    return sizes[fileName] || '0 B'
  }

  return (
    <div className="h-6 bg-slate-900 border-t border-slate-700 flex items-center justify-between px-3 text-xs text-slate-400">
      {/* Left side - File info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        
        {activeFile && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">{activeFile}</span>
              <span>•</span>
              <span>{formatFileSize(activeFile)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
            </div>
          </>
        )}
      </div>

      {/* Right side - Status indicators */}
      <div className="flex items-center gap-4">
        {collaborators > 0 && (
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{collaborators} online</span>
          </div>
        )}
        
        <div className={`flex items-center gap-1 ${getLanguageColor(language)}`}>
          <Zap className="w-3 h-3" />
          <span className="capitalize">{language}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Wifi className={`w-3 h-3 ${isConnected ? 'text-green-400' : 'text-red-400'}`} />
          <span>{isConnected ? 'Connected' : 'Offline'}</span>
        </div>
        
        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200">
          <Bell className="w-3 h-3" />
        </Button>
        
        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 text-slate-400 hover:text-slate-200">
          <Settings className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}