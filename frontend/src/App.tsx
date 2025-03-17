import { useState, useRef, useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import TextareaWithButton from './components/chat-input'
import { InputWithButton } from "./components/chat-input";
import { Message } from "./types";

import "./App.css";

import axios from "axios";
import messageService from "./services/messages";

interface SuggestedProfile {
  id: number;
  name: string;
  skills: string[];
  interests: string[];
  similarity: number;
}

interface ChatResponse {
  message: string;
  suggestedProfiles: SuggestedProfile[];
}

const App = () => {
  const [messages, setMessages] = useState<Array<Message>>([
    {
      id: "1",
      sender: "ai",
      text: "Hello, how can I help you today?",
    },
  ]);

  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    messageService.getAll().then(setMessages);
  }, []);

  const [suggestedProfiles, setSuggestedProfiles] = useState<
    SuggestedProfile[]
  >([]);

  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post<ChatResponse>(
        "http://localhost:3001/chat",
        {
          query: message,
        }
      );

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: response.data.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSuggestedProfiles(response.data.suggestedProfiles);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Sorry, there was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col gap-4 p-4 w-full h-screen justify-between">
          <header className="flex sticky top-0 shrink-0 w-full gap-2 justify-between items-center">
            <SidebarTrigger className="" />
            <ModeToggle />
          </header>

          {/* Centered, width-constrained chat container */}
          <div className="flex-1 overflow-y-auto p-4 pb-20">
            <div className="max-w-2xl mx-auto w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 ${
                    message.sender === "user" ? "ml-auto" : "mr-auto"
                  } max-w-[80%]`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Display suggested profiles */}
              {suggestedProfiles.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">
                    Suggested Connections
                  </h3>
                  {suggestedProfiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="mb-2 p-2 bg-background rounded"
                    >
                      <h4 className="font-medium">{profile.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Skills: {profile.skills.join(", ")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Interests: {profile.interests.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <InputWithButton onSend={handleSendMessage} />
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};
export default App;
