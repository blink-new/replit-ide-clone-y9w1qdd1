import React, { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'
import { X, Minimize2, Square, Terminal as TerminalIcon } from 'lucide-react'

interface TerminalProps {
  isRunning: boolean
}

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error'
  content: string
  timestamp: Date
}

export function Terminal({ isRunning }: TerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'output',
      content: 'Welcome to Replit Terminal',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'output',
      content: 'Type "help" for available commands',
      timestamp: new Date()
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  // Focus input when terminal is clicked
  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Simulate code execution output
  useEffect(() => {
    if (isRunning) {
      const outputs = [
        'Running main.py...',
        'Hello, World!',
        "What's your name? ",
        'Hello, User!',
        'Process finished with exit code 0'
      ]
      
      let index = 0
      const interval = setInterval(() => {
        if (index < outputs.length) {
          setLines(prev => [...prev, {
            id: Date.now().toString() + index,
            type: index === outputs.length - 1 ? 'output' : 'output',
            content: outputs[index],
            timestamp: new Date()
          }])
          index++
        } else {
          clearInterval(interval)
        }
      }, 800)

      return () => clearInterval(interval)
    }
  }, [isRunning])

  const handleCommand = (command: string) => {
    // Add input line
    setLines(prev => [...prev, {
      id: Date.now().toString(),
      type: 'input',
      content: `$ ${command}`,
      timestamp: new Date()
    }])

    // Process command
    let response = ''
    switch (command.toLowerCase().trim()) {
      case 'help':
        response = `Available commands:
  help     - Show this help message
  clear    - Clear terminal
  ls       - List files
  pwd      - Show current directory
  python   - Run Python interpreter
  node     - Run Node.js
  git      - Git commands`
        break
      case 'clear':
        setLines([])
        setCurrentInput('')
        return
      case 'ls':
        response = 'main.py  utils.py  config.json  README.md  requirements.txt  tests/'
        break
      case 'pwd':
        response = '/home/runner/my-repl'
        break
      case 'python':
        response = 'Python 3.11.0 (main, Oct 24 2022, 18:26:48) [MSC v.1933 64 bit (AMD64)] on win32\nType "help", "copyright", "credits" or "license" for more information.\n>>>'
        break
      case 'node':
        response = 'Welcome to Node.js v18.12.1.\nType ".help" for more information.\n>'
        break
      case 'git status':
        response = `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`
        break
      default:
        if (command.startsWith('git ')) {
          response = `git: '${command.slice(4)}' is not a git command. See 'git --help'.`
        } else {
          response = `bash: ${command}: command not found`
        }
    }

    // Add response
    setTimeout(() => {
      setLines(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: command.toLowerCase().trim() === 'clear' ? 'output' : 
              response.includes('not found') || response.includes('not a git command') ? 'error' : 'output',
        content: response,
        timestamp: new Date()
      }])
    }, 200)

    setCurrentInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput)
    }
  }

  if (isMinimized) {
    return (
      <div className="h-8 bg-slate-900 border-t border-slate-700 flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-white text-sm">
          <TerminalIcon className="w-4 h-4" />
          <span>Terminal</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-slate-800"
          onClick={() => setIsMinimized(false)}
        >
          <Square className="w-3 h-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col">
      {/* Terminal Header */}
      <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-3">
        <div className="flex items-center gap-2 text-sm">
          <TerminalIcon className="w-4 h-4" />
          <span>Terminal</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-slate-700"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-white hover:bg-slate-700"
            onClick={() => setLines([])}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-y-auto font-mono text-sm cursor-text"
        onClick={focusInput}
      >
        {lines.map(line => (
          <div key={line.id} className="mb-1">
            <span className={`${
              line.type === 'input' ? 'text-green-400' :
              line.type === 'error' ? 'text-red-400' :
              'text-gray-300'
            }`}>
              {line.content}
            </span>
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-green-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono"
            placeholder="Type a command..."
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}