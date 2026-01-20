import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';
import { useApp } from '../App';
import { Link } from 'react-router-dom';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm your BadmintonPro assistant. I can help you find the perfect gear based on your play style and physical stats. What are you looking for today? (e.g., Rackets, Shoes)" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Simplify product data to save context window and focus on key attributes
  const inventoryContext = JSON.stringify(PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    brand: p.brand,
    specs: p.specs,
    tags: p.tags
  })));

  // Fallback responses for demo mode
  const getFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('racket') || msg.includes('rocket') || msg.includes('拍')) {
      return "Great choice! For rackets, I'd recommend:\n\n• **[Astrox 99 Pro](/product/11111111-1111-1111-1111-111111111111)** - Head-heavy, great for power players\n• **[Thruster F Claw](/product/22222222-2222-2222-2222-222222222222)** - Excellent for attacking play\n• **[Nanoflare 800 LT](/product/66666666-6666-6666-6666-666666666666)** - Light and fast for doubles\n\nWhat's your skill level? (Beginner/Intermediate/Advanced)";
    }

    if (msg.includes('shoe') || msg.includes('鞋')) {
      return "For badminton shoes, check out:\n\n• **[Power Cushion 65 Z](/product/33333333-3333-3333-3333-333333333333)** - Excellent cushioning ($145)\n• **[Li-Ning Ranger V1](/product/99999999-9999-9999-9999-999999999999)** - Great stability ($145)\n• **[Victor P9200 Court Shoes](/product/cccccccc-cccc-cccc-cccc-cccccccccccc)** - Lightweight and durable ($140)\n\nWhat's your shoe size?";
    }

    if (msg.includes('apparel') || msg.includes('shirt') || msg.includes('jersey') || msg.includes('衣')) {
      return "We have great apparel options:\n\n• **[Li-Ning Team Jersey](/product/aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa)** - Breathable team wear ($45)\n\nAre you looking for men's or women's apparel?";
    }

    if (msg.includes('accessori') || msg.includes('grip') || msg.includes('shuttlecock') || msg.includes('配件')) {
      return "For accessories, we recommend:\n\n• **[Pro Grip Tape (Blue)](/product/bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb)** - $8.50\n• **[Aerosensa 50 (Dozen)](/product/44444444-4444-4444-4444-444444444444)** - Tournament grade shuttlecocks ($35)\n\nNeed anything specific?";
    }

    if (msg.includes('beginner') || msg.includes('初学')) {
      return "For beginners, I recommend:\n\n• **[Nanoflare 800 LT](/product/66666666-6666-6666-6666-666666666666)** - Light and easy to handle\n• **[Arcsaber 11 Pro](/product/77777777-7777-7777-7777-777777777777)** - Great control and balance\n\nThese rackets are forgiving and help you develop proper technique!";
    }

    if (msg.includes('advanced') || msg.includes('pro') || msg.includes('高级')) {
      return "For advanced players seeking power:\n\n• **[Astrox 99 Pro](/product/11111111-1111-1111-1111-111111111111)** - Maximum smash power ($219)\n• **[Thruster F Claw](/product/22222222-2222-2222-2222-222222222222)** - Aggressive attacking racket ($185)\n\nBoth have stiff shafts for explosive power!";
    }

    return "I can help you find the perfect badminton gear! We have:\n\n• **Rackets** - From Yonex, Victor, Li-Ning\n• **Shoes** - Power Cushion, Court shoes\n• **Apparel** - Jerseys and sportswear\n• **Accessories** - Grips, shuttlecocks, bags\n\nWhat are you looking for today?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        // Use fallback response when API key is not configured
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'model',
            text: getFallbackResponse(userMessage)
          }]);
          setIsLoading(false);
        }, 800);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      // Construct the conversation history for context
      const history = messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');

      const prompt = `
        System Instruction:
        You are an expert sales assistant for "BadmintonPro", a badminton equipment shop.
        
        YOUR GOAL:
        Help the user find the best product from the AVAILABLE INVENTORY provided below. 
        
        PROCESS:
        1. Ask clarifying questions one by one to understand their needs. 
           - If they want a Racket: Ask about their skill level (Beginner/Intermediate/Advanced), play style (Attacking/Defensive/All-around), and if they prefer singles or doubles.
           - If they want Shoes: Ask about their size, foot width, or cushioning preference.
           - If they want Apparel: Ask for gender and size preference.
           - You can ask for their Height and Weight to recommend racket balance (Head heavy/light) or apparel size.
        2. Once you have enough info, recommend 1-3 specific products from the inventory.
        3. When recommending a product, you MUST format the name as a link like this: [Product Name](/product/ID). Example: [Astrox 99](/product/1).
        
        RULES:
        - DO NOT recommend products that are not in the AVAILABLE INVENTORY list.
        - Keep responses concise and friendly.
        - If the user asks about something unrelated to badminton or the store, politely bring them back to the topic.
        
        AVAILABLE INVENTORY JSON:
        ${inventoryContext}
        
        CURRENT CONVERSATION:
        ${history}
        User: ${userMessage}
        Assistant:
      `;

      // Use the correct API call format for @google/genai with Gemini 3
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingLevel: 'low'  // Use low thinking for faster chat responses
          }
        }
      });

      const text = response.text;
      if (text) {
        setMessages(prev => [...prev, { role: 'model', text }]);
      } else {
        // Use fallback if no response
        setMessages(prev => [...prev, { role: 'model', text: getFallbackResponse(userMessage) }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      // Use intelligent fallback on error
      setMessages(prev => [...prev, { role: 'model', text: getFallbackResponse(userMessage) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  // Simple parser to render links from the AI response
  const renderMessageText = (text: string) => {
    // Handle markdown bold **text** and links [text](/path)
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, index) => {
      // Check for link
      const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <Link key={index} to={linkMatch[2]} className="text-primary underline font-bold hover:text-blue-700" onClick={() => setIsOpen(false)}>
            {linkMatch[1]}
          </Link>
        );
      }
      // Check for bold
      const boldMatch = part.match(/\*\*([^*]+)\*\*/);
      if (boldMatch) {
        return <strong key={index} className="font-semibold">{boldMatch[1]}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200"
        aria-label="Open AI Assistant"
      >
        {isOpen ? (
          <span className="material-symbols-outlined text-[28px]">close</span>
        ) : (
          <span className="material-symbols-outlined text-[28px]">smart_toy</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] flex flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center gap-3 text-white">
            <div className="bg-white/20 p-1.5 rounded-full">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-sm">BadmintonPro AI</h3>
              <p className="text-xs opacity-90">Inventory Expert</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                    }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about rackets, shoes..."
                className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-primary focus:ring-0 text-sm transition-all text-slate-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-1.5 text-primary disabled:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] block">send</span>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2">AI can make mistakes. Check product specs.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;