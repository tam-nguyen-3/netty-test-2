import { useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle'
import { AppSidebar } from './components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import TextareaWithButton from './components/chat-input'
import { InputWithButton } from './components/chat-input'

import './App.css'

// Define a message type for better type safety
type Message = {
  sender: 'user' | 'ai';
  text: string;
}

const App = () => {

  const [messages, setMessages] = useState<Array<Message>>([
    { 
      sender: 'ai', 
      text: 'Hello, how can I help you today?' 
    }
  ])

  const handleSendMessage = (message: string) => {
    const userMessage: Message = { 
      sender: 'user', 
      text: message 
    }

    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const aiMessage: Message = {
        sender: 'ai',
        text: 'This is a sample response!',
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className='flex flex-col gap-4 p-4 w-full h-screen justify-between'>
          <header className="flex sticky top-0 shrink-0 w-full gap-2 justify-between items-center"> 
            <SidebarTrigger className=''/>
            <ModeToggle />
          </header>

          {/* Chat messages area */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-4 max-w-3/4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <InputWithButton onSend={handleSendMessage}/>
        </main>

      </SidebarProvider>
    </ThemeProvider>
  )
}
export default App
