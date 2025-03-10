import { useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle'
import { AppSidebar } from './components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import TextareaWithButton from './components/chat-input'
import { InputWithButton } from './components/chat-input'

import './App.css'

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className='flex flex-col gap-4 p-4 w-full h-screen justify-between'>
          <header className="flex sticky top-0 shrink-0 w-full gap-2 justify-between items-center"> 
            <SidebarTrigger className=''/>
            <ModeToggle />
          </header>
          
          
          <InputWithButton/>
        </main>

      </SidebarProvider>
    </ThemeProvider>
  )
}
export default App
