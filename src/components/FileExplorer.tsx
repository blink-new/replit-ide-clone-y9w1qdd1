import React, { useState } from 'react'
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Plus } from 'lucide-react'
import { Button } from './ui/button'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
}

interface FileExplorerProps {
  activeFile: string | null
  onFileSelect: (file: string) => void
}

const initialFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      { name: 'main.py', type: 'file' },
      { name: 'utils.py', type: 'file' },
      { name: 'config.json', type: 'file' }
    ]
  },
  {
    name: 'tests',
    type: 'folder',
    isOpen: false,
    children: [
      { name: 'test_main.py', type: 'file' }
    ]
  },
  { name: 'README.md', type: 'file' },
  { name: 'requirements.txt', type: 'file' }
]

export function FileExplorer({ activeFile, onFileSelect }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)

  const toggleFolder = (path: string[]) => {
    setFiles(prev => {
      const newFiles = [...prev]
      let current = newFiles
      
      for (let i = 0; i < path.length - 1; i++) {
        const folder = current.find(f => f.name === path[i])
        if (folder?.children) {
          current = folder.children
        }
      }
      
      const target = current.find(f => f.name === path[path.length - 1])
      if (target && target.type === 'folder') {
        target.isOpen = !target.isOpen
      }
      
      return newFiles
    })
  }

  const renderFileNode = (node: FileNode, depth: number = 0, path: string[] = []) => {
    const currentPath = [...path, node.name]
    const isActive = activeFile === node.name && node.type === 'file'
    
    return (
      <div key={node.name}>
        <div
          className={`flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-slate-700 ${
            isActive ? 'bg-blue-600 text-white border-r-2 border-blue-400' : 'text-slate-300'
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(currentPath)
            } else {
              onFileSelect(node.name)
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              {node.isOpen ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-3 h-3" />
              <File className="w-4 h-4 text-slate-400" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {node.children.map(child => 
              renderFileNode(child, depth + 1, currentPath)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-200">Files</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700">
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  )
}