import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Button } from './ui/button'
import { X } from 'lucide-react'

interface CodeEditorProps {
  activeFile: string | null
  language: string
}

const sampleCode: Record<string, string> = {
  'main.py': `# Welcome to your Python Repl!
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

# Try running this code
if __name__ == "__main__":
    user_name = input("What's your name? ")
    print(greet(user_name))`,
  
  'utils.py': `# Utility functions
import math

def calculate_area(radius):
    """Calculate the area of a circle"""
    return math.pi * radius ** 2

def fibonacci(n):
    """Generate fibonacci sequence up to n"""
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib`,
  
  'config.json': `{
  "name": "My Python Project",
  "version": "1.0.0",
  "description": "A sample Python project",
  "author": "Your Name",
  "dependencies": {
    "requests": "^2.28.0",
    "numpy": "^1.24.0"
  },
  "scripts": {
    "start": "python main.py",
    "test": "python -m pytest tests/"
  }
}`,
  
  'README.md': `# My Python Project

Welcome to my awesome Python project!

## Getting Started

1. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. Run the project:
   \`\`\`bash
   python main.py
   \`\`\`

## Features

- ✨ Clean and simple code structure
- 🚀 Easy to extend and modify
- 📝 Well documented

## Contributing

Feel free to submit issues and enhancement requests!`,
  
  'requirements.txt': `requests==2.28.2
numpy==1.24.3
pytest==7.4.0
black==23.3.0
flake8==6.0.0`,
  
  'test_main.py': `import unittest
from main import greet

class TestMain(unittest.TestCase):
    def test_greet(self):
        result = greet("World")
        self.assertEqual(result, "Hello, World!")
    
    def test_greet_empty(self):
        result = greet("")
        self.assertEqual(result, "Hello, !")

if __name__ == '__main__':
    unittest.main()`
}

export function CodeEditor({ activeFile, language }: CodeEditorProps) {
  const [openTabs, setOpenTabs] = useState<string[]>(['main.py'])
  const [activeTab, setActiveTab] = useState('main.py')
  const [code, setCode] = useState<Record<string, string>>(sampleCode)

  useEffect(() => {
    if (activeFile && !openTabs.includes(activeFile)) {
      setOpenTabs(prev => [...prev, activeFile])
    }
    if (activeFile) {
      setActiveTab(activeFile)
    }
  }, [activeFile, openTabs])

  const closeTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newTabs = openTabs.filter(tab => tab !== fileName)
    setOpenTabs(newTabs)
    
    if (activeTab === fileName && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1])
    }
  }

  const getLanguageFromFile = (fileName: string) => {
    const ext = fileName.split('.').pop()
    switch (ext) {
      case 'py': return 'python'
      case 'js': return 'javascript'
      case 'ts': return 'typescript'
      case 'java': return 'java'
      case 'cpp': case 'cc': case 'cxx': return 'cpp'
      case 'html': return 'html'
      case 'css': return 'css'
      case 'json': return 'json'
      case 'md': return 'markdown'
      case 'txt': return 'text'
      default: return 'text'
    }
  }

  if (openTabs.length === 0) {
    return (
      <div className="h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg font-medium mb-2">No files open</p>
          <p className="text-sm">Select a file from the explorer to start coding</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <TabsList className="h-10 bg-slate-100 rounded-none border-b border-slate-200 justify-start p-0">
          {openTabs.map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="relative px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none group"
            >
              <span className="mr-2">{tab}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-slate-200"
                onClick={(e) => closeTab(tab, e)}
              >
                <X className="w-3 h-3" />
              </Button>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {openTabs.map(tab => (
          <TabsContent key={tab} value={tab} className="flex-1 m-0">
            <div className="h-full flex flex-col">
              <div className="flex-1 p-4">
                <div className="relative w-full h-full">
                  {/* Line Numbers */}
                  <div className="absolute left-0 top-0 w-12 h-full bg-slate-50 border-r border-slate-200 flex flex-col text-xs text-slate-400 font-mono pt-4">
                    {(code[tab] || '').split('\n').map((_, index) => (
                      <div key={index} className="h-5 flex items-center justify-end pr-2">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  
                  {/* Code Editor */}
                  <textarea
                    value={code[tab] || ''}
                    onChange={(e) => setCode(prev => ({ ...prev, [tab]: e.target.value }))}
                    className="w-full h-full resize-none border-none outline-none font-mono text-sm leading-relaxed pl-14 pt-4 pr-4"
                    style={{ 
                      fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
                      lineHeight: '20px'
                    }}
                    placeholder={`Start coding in ${tab}...`}
                    spellCheck={false}
                  />
                </div>
              </div>
              
              <div className="h-6 bg-slate-100 border-t border-slate-200 flex items-center justify-between px-4 text-xs text-slate-600">
                <span>Language: {getLanguageFromFile(tab)}</span>
                <span>UTF-8</span>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}