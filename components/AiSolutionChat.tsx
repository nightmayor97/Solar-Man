import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { UserIcon, BotIcon, SendIcon } from './Icons';
import { useAppContext } from '../App';

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

const AiSolutionChat: React.FC = () => {
  const { currentUser } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: `Hello ${currentUser?.fullName}! I'm the Solar Man AI assistant. How can I help you with your solar energy questions today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Load chat history from localStorage when the component mounts for the current user
  useEffect(() => {
    if (!currentUser?.id) return;

    const storageKey = `chatHistory_${currentUser.id}`;
    try {
      const savedHistory = localStorage.getItem(storageKey);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          setMessages(parsedHistory);
        }
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
    }
  }, [currentUser?.id]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    // Only save if there's a user and the conversation has started (more than the initial message)
    if (currentUser?.id && messages.length > 1) {
      const storageKey = `chatHistory_${currentUser.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
      }
    }
  }, [messages, currentUser?.id]);


  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: currentInput,
      });
      const botMessage: Message = { sender: 'bot', text: response.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API error:", error);
      const errorMessage: Message = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-secondary-dark px-2">AI Chat Assistant</h2>
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className={`p-4 rounded-xl max-w-lg ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                </div>
                 {msg.sender === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
               <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="p-4 rounded-xl bg-gray-200 text-gray-800 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input */}
        <div className="p-4 bg-gray-100 border-t">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full pl-4 pr-12 py-3 rounded-full bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || input.trim() === ''}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiSolutionChat;