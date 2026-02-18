'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  quickReplies?: string[];
}

interface ChatResponse {
  response: string;
  quick_replies?: string[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Salam! Mən AgriAdvisor - sizin kənd təsərrüfatı məsləhətçinizəm. Suvarma, gübrələmə, zərərverici və ya digər mövzularda sual verə bilərsiniz. 🌾',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('API error');

      const data: ChatResponse = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: data.response,
        timestamp: new Date(),
        quickReplies: data.quick_replies,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: 'Bağışlayın, texniki xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full',
          'flex items-center justify-center',
          'shadow-lg transition-all duration-300',
          isOpen
            ? 'bg-earth-600 hover:bg-earth-700 rotate-0'
            : 'bg-gradient-to-br from-leaf-500 to-leaf-600 hover:from-leaf-600 hover:to-leaf-700 animate-pulse-slow'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-slide-up">
          <div className="card overflow-hidden shadow-2xl border-2 border-leaf-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-leaf-600 to-leaf-500 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">AgriAdvisor Məsləhətçi</h3>
                <p className="text-leaf-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
              <Sparkles className="w-5 h-5 text-leaf-200" />
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-earth-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    'flex gap-2',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  {/* Avatar */}
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
                    message.role === 'user'
                      ? 'bg-sky-100'
                      : 'bg-leaf-100'
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-leaf-600" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className={clsx(
                    'max-w-[75%] rounded-2xl px-4 py-2',
                    message.role === 'user'
                      ? 'bg-sky-500 text-white rounded-br-md'
                      : 'bg-white border border-earth-200 text-earth-700 rounded-bl-md shadow-sm'
                  )}>
                    <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-h3:text-base prose-h3:font-semibold prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-table:text-xs prose-th:p-2 prose-td:p-2 prose-strong:font-semibold">
                      {message.role === 'bot' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                    <div className={clsx(
                      'text-xs mt-1',
                      message.role === 'user' ? 'text-sky-200' : 'text-earth-400'
                    )}>
                      {message.timestamp.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              {messages.length > 0 && messages[messages.length - 1].quickReplies && (
                <div className="flex flex-wrap gap-2 pl-10">
                  {messages[messages.length - 1].quickReplies!.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1.5 text-sm bg-leaf-100 text-leaf-700 rounded-full hover:bg-leaf-200 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-leaf-100 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-leaf-600" />
                  </div>
                  <div className="bg-white border border-earth-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-earth-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-earth-200 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Sualınızı yazın..."
                  className="flex-1 px-4 py-2 bg-earth-50 border border-earth-200 rounded-full text-sm focus:outline-none focus:border-leaf-400 focus:ring-2 focus:ring-leaf-100"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-leaf-500 text-white rounded-full flex items-center justify-center hover:bg-leaf-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
