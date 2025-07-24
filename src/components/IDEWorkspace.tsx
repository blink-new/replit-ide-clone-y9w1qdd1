import React, { useState } from 'react'
import { TopNavigation } from './TopNavigation'
import { FileExplorer } from './FileExplorer'
import { CodeEditor } from './CodeEditor'
import { Terminal } from './Terminal'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

export function IDEWorkspace() {
  const [activeFile, setActiveFile] = useState<string | null>('main.py')
  const [language, setLanguage] = useState('python')
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <TopNavigation 
        language={language}
        onLanguageChange={setLanguage}
        isRunning={isRunning}
        onRun={() => setIsRunning(!isRunning)}
      />
      
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer 
              activeFile={activeFile}
              onFileSelect={setActiveFile}
            />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-slate-700 hover:bg-slate-600" />
          
          {/* Main Editor Area */}
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              {/* Code Editor */}
              <ResizablePanel defaultSize={70} minSize={30}>
                <CodeEditor 
                  activeFile={activeFile}
                  language={language}
                />
              </ResizablePanel>
              
              <ResizableHandle className="h-1 bg-slate-700 hover:bg-slate-600" />
              
              {/* Terminal */}
              <ResizablePanel defaultSize={30} minSize={20}>
                <Terminal isRunning={isRunning} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}