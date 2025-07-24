import React, { useState } from 'react'
import { TopNavigation } from './TopNavigation'
import { FileExplorer } from './FileExplorer'
import { CodeEditor } from './CodeEditor'
import { Terminal } from './Terminal'
import { StatusBar } from './StatusBar'
import { CollaborationPanel } from './CollaborationPanel'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable'

export function IDEWorkspace() {
  const [activeFile, setActiveFile] = useState<string | null>('main.py')
  const [language, setLanguage] = useState('python')
  const [isRunning, setIsRunning] = useState(false)
  const [isCollaborationVisible, setIsCollaborationVisible] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  const handleFileCreate = (fileName: string, type: 'file' | 'folder') => {
    console.log(`Creating ${type}: ${fileName}`)
    // In a real app, this would create the file/folder
  }

  const handleFileDelete = (fileName: string) => {
    console.log(`Deleting: ${fileName}`)
    // In a real app, this would delete the file
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <TopNavigation 
        language={language}
        onLanguageChange={setLanguage}
        isRunning={isRunning}
        onRun={() => setIsRunning(!isRunning)}
        onCollaborationToggle={() => setIsCollaborationVisible(!isCollaborationVisible)}
        collaborators={3}
        isSaved={true}
      />
      
      <div className="flex-1 flex">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer 
              activeFile={activeFile}
              onFileSelect={setActiveFile}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
            />
          </ResizablePanel>
          
          <ResizableHandle className="w-1 bg-slate-700 hover:bg-slate-600" />
          
          {/* Main Editor Area */}
          <ResizablePanel defaultSize={isCollaborationVisible ? 60 : 80}>
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
          
          {/* Collaboration Panel */}
          {isCollaborationVisible && (
            <>
              <ResizableHandle className="w-1 bg-slate-700 hover:bg-slate-600" />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
                <CollaborationPanel 
                  isVisible={isCollaborationVisible}
                  onToggle={() => setIsCollaborationVisible(false)}
                />
              </ResizablePanel>
            </>
          )}
          
          {/* Collapsed Collaboration Panel */}
          {!isCollaborationVisible && (
            <CollaborationPanel 
              isVisible={false}
              onToggle={() => setIsCollaborationVisible(true)}
            />
          )}
        </ResizablePanelGroup>
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        activeFile={activeFile}
        language={language}
        cursorPosition={cursorPosition}
        isConnected={true}
        collaborators={3}
      />
    </div>
  )
}