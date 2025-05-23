import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  ArrowPathIcon, 
  BookOpenIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AssistantChat = () => {
  const [selectedDocument, setSelectedDocument] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDocuments, setAvailableDocuments] = useState([
    { id: 1, title: 'Employee Handbook', type: 'policy' },
    { id: 2, title: 'Leave Policy', type: 'policy' },
    { id: 3, title: 'Performance Management Guidelines', type: 'guidelines' },
    { id: 4, title: 'Code of Conduct', type: 'policy' },
    { id: 5, title: 'Recruitment and Selection Policy', type: 'policy' }
  ]);
  const [showPromptLibrary, setShowPromptLibrary] = useState(false);
  
  const chatContainerRef = useRef(null);
  
  useEffect(() => {
    // Scroll to bottom of chat when history changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Fetch available documents - would be implemented in a real app
  useEffect(() => {
    // API call to fetch documents would go here
    // For now, we're using the static list above
  }, []);
  
  const handleSendMessage = () => {
    if (!message.trim() || !selectedDocument) return;
    
    // Add user message to chat
    setChatHistory(prev => [...prev, { sender: 'user', text: message }]);
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `This is a simulated response about the ${selectedDocument} document: ${message}`;
      setChatHistory(prev => [...prev, { sender: 'assistant', text: aiResponse }]);
      setIsLoading(false);
    }, 1000);
    
    setMessage('');
  };
  
  const handleSelectPrompt = (promptText) => {
    setMessage(promptText);
    setShowPromptLibrary(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const saveConversation = () => {
    // Implementation would save the current conversation
    alert('Conversation saved successfully!');
  };
  
  const promptLibrary = [
    {
      title: 'Chapter 1: Understanding Policies',
      subItems: [
        {
          title: 'Policy Overview',
          prompts: [
            { title: "Policy Summary", text: "Provide a concise summary of the [policy name]" },
            { title: "Key Components", text: "What are the main components of the [policy name]?" }
          ]
        },
        {
          title: 'Policy Application',
          prompts: [
            { title: "Practical Examples", text: "Give me 3 practical examples of how the [policy name] applies in day-to-day operations" },
            { title: "Department-Specific", text: "How does the [policy name] specifically apply to the [department] department?" }
          ]
        }
      ]
    },
    {
      title: 'Chapter 2: Procedural Guidance',
      subItems: [
        {
          title: 'Step-by-Step Procedures',
          prompts: [
            { title: "Process Walkthrough", text: "Walk me through the step-by-step process for [procedure name]" },
            { title: "Required Documentation", text: "What documentation is required for [procedure name]?" }
          ]
        },
        {
          title: 'Compliance & Reporting',
          prompts: [
            { title: "Compliance Checklist", text: "Create a compliance checklist for [procedure name]" },
            { title: "Reporting Timeline", text: "What's the reporting timeline and process for [procedure name]?" }
          ]
        }
      ]
    },
    {
      title: 'Chapter 3: Employee Rights & Responsibilities',
      subItems: [
        {
          title: 'Understanding Rights',
          prompts: [
            { title: "Rights Overview", text: "Explain the employee rights related to [topic]" },
            { title: "Legal Protections", text: "What legal protections exist for employees regarding [topic]?" }
          ]
        },
        {
          title: 'Responsibilities & Obligations',
          prompts: [
            { title: "Employee Obligations", text: "List the key responsibilities employees have regarding [topic]" },
            { title: "Non-Compliance Consequences", text: "What are the consequences of not following the [policy name]?" }
          ]
        }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">HR Policy Assistant</h1>
        <p className="text-gray-600 mb-6">
          Select a document and chat with our assistant to get information about HR policies and procedures.
        </p>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Document
          </label>
          <select
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a document</option>
            {availableDocuments.map(doc => (
              <option key={doc.id} value={doc.title}>{doc.title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedDocument && (
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#08796c] text-white px-6 py-4 flex items-center">
            <DocumentTextIcon className="w-6 h-6 mr-2" />
            <h2 className="font-semibold">{selectedDocument}</h2>
            <button 
              onClick={saveConversation}
              className="ml-auto text-white hover:text-blue-100 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md"
            >
              Save Conversation
            </button>
          </div>
          
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ maxHeight: 'calc(100vh - 400px)' }}
          >
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Select a topic from the prompt library or ask a question about {selectedDocument}</p>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 rounded-lg px-4 py-2 ${
                      chat.sender === 'user' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {chat.text}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3/4 rounded-lg px-4 py-2 bg-gray-100">
                  <div className="flex items-center space-x-2">
                    <ArrowPathIcon className="w-5 h-5 animate-spin text-gray-500" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setShowPromptLibrary(!showPromptLibrary)}
                className="mr-3 text-gray-500 hover:text-gray-700"
              >
                <BookOpenIcon className="w-5 h-5" />
              </button>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${selectedDocument}...`}
                className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={`ml-3 p-2 rounded-full ${
                  !message.trim() || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
            
            {showPromptLibrary && (
              <div className="mt-4 border border-gray-200 rounded-md shadow-md max-h-64 overflow-y-auto">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium">Prompt Library</h3>
                </div>
                <div className="p-3">
                  {promptLibrary.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className="mb-4">
                      <h4 className="font-medium text-gray-800 mb-2">{chapter.title}</h4>
                      {chapter.subItems.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="ml-4 mb-3">
                          <h5 className="font-medium text-gray-700 mb-1">{section.title}</h5>
                          <ul className="ml-4 space-y-1">
                            {section.prompts.map((prompt, promptIndex) => (
                              <li key={promptIndex}>
                                <button
                                  onClick={() => handleSelectPrompt(prompt.text)}
                                  className="text-blue-600 hover:text-blue-800 text-left"
                                >
                                  • <strong>{prompt.title}:</strong> {prompt.text}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantChat;
