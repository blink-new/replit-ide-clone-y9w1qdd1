import React, { useState } from 'react'
import { ChevronDown, ChevronRight, File, Folder, FolderOpen, Plus, MoreHorizontal, Trash2, Edit3, FileText, Code, Settings, Image } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  isOpen?: boolean
}

interface FileExplorerProps {
  activeFile: string | null
  onFileSelect: (file: string) => void
  onFileCreate?: (fileName: string, type: 'file' | 'folder') => void
  onFileDelete?: (fileName: string) => void
}

const initialFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    isOpen: true,
    children: [
      { name: 'main.py', type: 'file' },
      { name: 'utils.py', type: 'file' },
      { name: 'config.json', type: 'file' },
      { name: 'styles.css', type: 'file' }
    ]
  },
  {
    name: 'tests',
    type: 'folder',
    isOpen: false,
    children: [
      { name: 'test_main.py', type: 'file' },
      { name: 'test_utils.py', type: 'file' }
    ]
  },
  {
    name: 'assets',
    type: 'folder',
    isOpen: false,
    children: [
      { name: 'logo.png', type: 'file' },
      { name: 'icon.svg', type: 'file' }
    ]
  },
  { name: 'README.md', type: 'file' },
  { name: 'requirements.txt', type: 'file' },
  { name: '.gitignore', type: 'file' }
]

export function FileExplorer({ activeFile, onFileSelect, onFileCreate, onFileDelete }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'file' | 'folder'>('file')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'py':
        return <Code className="w-4 h-4 text-yellow-400" />
      case 'js':
      case 'ts':
        return <Code className="w-4 h-4 text-blue-400" />
      case 'json':
        return <Settings className="w-4 h-4 text-orange-400" />
      case 'md':
        return <FileText className="w-4 h-4 text-blue-300" />
      case 'css':
        return <Code className="w-4 h-4 text-pink-400" />
      case 'html':
        return <Code className="w-4 h-4 text-orange-500" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
        return <Image className="w-4 h-4 text-green-400" />
      case 'txt':
        return <FileText className="w-4 h-4 text-slate-400" />
      default:
        return <File className="w-4 h-4 text-slate-400" />
    }
  }

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

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate?.(newFileName, newFileType)
      setNewFileName('')
      setIsCreateDialogOpen(false)
    }
  }

  const renderFileNode = (node: FileNode, depth: number = 0, path: string[] = []) => {
    const currentPath = [...path, node.name]
    const isActive = activeFile === node.name && node.type === 'file'
    
    return (
      <div key={node.name}>
        <div
          className={`group flex items-center gap-1 px-2 py-1 text-sm cursor-pointer hover:bg-slate-700 ${
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
              {getFileIcon(node.name)}
            </>
          )}
          <span className="truncate flex-1">{node.name}</span>
          
          {/* File Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 text-slate-400 hover:text-slate-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="text-xs">
                  <Edit3 className="w-3 h-3 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-xs text-red-400"
                  onClick={() => onFileDelete?.(node.name)}
                >
                  <Trash2 className="w-3 h-3 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
        <h3 className="text-sm font-medium text-slate-200">Explorer</h3>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-700">
              <Plus className="w-3 h-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New {newFileType === 'file' ? 'File' : 'Folder'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={newFileType === 'file' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewFileType('file')}
                >
                  File
                </Button>
                <Button
                  variant={newFileType === 'folder' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewFileType('folder')}
                >
                  Folder
                </Button>
              </div>
              <Input
                placeholder={`Enter ${newFileType} name...`}
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateFile()}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFile} disabled={!newFileName.trim()}>
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {files.map(file => renderFileNode(file))}
      </div>
      
      {/* Quick Stats */}
      <div className="p-2 border-t border-slate-700 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>{files.length} items</span>
          <span>Python Project</span>
        </div>
      </div>
    </div>
  )
}