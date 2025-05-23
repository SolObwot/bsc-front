import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  ClockIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const SavedChat = () => {
  const [savedConversations, setSavedConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for saved conversations
  useEffect(() => {
    // Simulate API call to fetch saved conversations
    setTimeout(() => {
      const mockConversations = [
        {
          id: 1,
          title: 'Leave Policy Clarification',
          document: 'Leave Policy',
          documentId: 2,
          date: '2023-11-10',
          time: '10:23 AM',
          preview: 'How many days of annual leave am I entitled to as a new employee?',
        },
        {
          id: 2,
          title: 'Performance Review Process',
          document: 'Performance Review Procedure',
          documentId: 3,
          date: '2023-11-08',
          time: '02:45 PM',
          preview: 'What are the steps involved in the performance review process?',
        },
        {
          id: 3,
          title: 'Code of Conduct Questions',
          document: 'Code of Conduct',
          documentId: 4,
          date: '2023-11-05',
          time: '09:15 AM',
          preview: 'What are the guidelines regarding accepting gifts from clients?',
        },
        {
          id: 4,
          title: 'Employee Handbook Overview',
          document: 'Employee Handbook',
          documentId: 1,
          date: '2023-10-30',
          time: '11:37 AM',
          preview: 'Can you provide a summary of the key sections in the employee handbook?',
        },
        {
          id: 5,
          title: 'Recruitment Process Questions',
          document: 'Recruitment and Selection Policy',
          documentId: 5,
          date: '2023-10-25',
          time: '03:12 PM',
          preview: 'What is the interview process for new candidates?',
        }
      ];
      
      setSavedConversations(mockConversations);
      setIsLoading(false);
    }, 1200);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredConversations = savedConversations.filter(
    conversation => 
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      setSavedConversations(prevConversations => 
        prevConversations.filter(conversation => conversation.id !== id)
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Saved Conversations</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your saved conversations with the HR Policy Assistant
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/hr/policy/chat"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
              New Conversation
            </Link>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search saved conversations..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-16 flex flex-col items-center justify-center">
          <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-16 flex flex-col items-center justify-center">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No conversations found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? `No results matching "${searchTerm}"` 
              : 'You have no saved conversations yet'}
          </p>
          {!searchTerm && (
            <Link 
              to="/hr/policy/chat"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Start a new conversation
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map(conversation => (
              <li key={conversation.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-gray-100 rounded-md">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium text-gray-900">
                        {conversation.title}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDelete(conversation.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Delete conversation"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {conversation.document}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {conversation.date} at {conversation.time}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {conversation.preview}
                    </p>
                    <div className="mt-4">
                      <Link
                        to={`/hr/policy/chat?conversation=${conversation.id}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Continue conversation
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavedChat;
