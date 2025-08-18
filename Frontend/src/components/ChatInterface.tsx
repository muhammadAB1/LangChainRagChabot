import { useState, useRef, useEffect } from "react";
import { Send, Upload } from "lucide-react";
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  hasFiles: boolean;
  files: Array<{ name: string; fileName?: string; id: string }>;
}

export function ChatInterface({ hasFiles, files }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasFiles) {
      setMessages([]);
      setConversationHistory([]);
    }
  }, [hasFiles]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || files.length === 0) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get the first file's fileName for the API call
      const fileName = files[0]?.fileName || files[0]?.name;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          fileName: fileName,
          history: conversationHistory,
        }),
      });
      setConversationHistory(prev => [...prev, input]);
      setInput("");
      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let aiResponse = '';
      const aiMessageId = Math.random().toString(36).substr(2, 9);

      // Add initial AI message
      const aiMessage: Message = {
        id: aiMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      // Read streaming response
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        aiResponse += chunk;

        // Update the AI message with streaming content
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: aiResponse }
            : msg
        ));
      }

      // Add to conversation history when response is complete
      setConversationHistory(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-2xl font-semibold">Chat Assistant</h2>
        <p className="text-muted-foreground">
          Ask questions about your uploaded files
        </p>
      </div>

      <div className="messages-area flex-1 overflow-y-auto min-h-0">
        {!hasFiles ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-md">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">No Files Uploaded</h3>
                <p className="text-muted-foreground">
                  Please upload any PDF or text file to continue with the chat.
                  I'll be able to help you analyze and discuss your documents once they're uploaded.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-enter ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
              >
                <div
                  className={`${message.sender === "user" ? "message-user" : "message-ai"}`}
                >
                  <div className="text-sm leading-relaxed prose prose-sm">
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {isTyping && (
          <div className="flex justify-start message-enter">
            <div className="message-ai">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={hasFiles ? "Type your message..." : "Upload files first to start chatting"}
            className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isTyping || !hasFiles}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping || !hasFiles}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4 py-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}