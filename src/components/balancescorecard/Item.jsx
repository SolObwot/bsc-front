'use client'

import React, { useState, useEffect, Fragment } from 'react';
import { SunIcon, ChevronUpIcon, ChevronDownIcon, EllipsisHorizontalIcon, ClockIcon, CalendarIcon, DocumentTextIcon, CheckCircleIcon, ExclamationCircleIcon, PlusCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { PencilIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition, Dialog } from '@headlessui/react';
import { Avatar } from '../ui/Avatar';
import StrategicObjectiveModal from './modals/StrategicObjectiveModal';
import PerformanceIndicatorModal from './modals/PerformanceIndicatorModal';
import AppraisalModal from './modals/AppraisalModal';
import AppraisalApprovalModal from './modals/AppraisalApprovalModal';

const itemActions = [
  { name: 'Edit', description: 'Modify this objective', icon: PencilIcon },
  { name: 'Delete', description: 'Remove this objective', icon: TrashIcon },
  { name: 'Share', description: 'Share this objective with others', icon: ShareIcon },
  { name: 'Add key result', description: 'Add a new key result to this objective', icon: PlusCircleIcon }
];

const ObjectiveItem = ({ objective, subObjectives = [] }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [expandedSubObjectiveId, setExpandedSubObjectiveId] = useState(subObjectives[0]?.id || null);
  const [isStrategicModalOpen, setIsStrategicModalOpen] = useState(false);
  const [isIndicatorModalOpen, setIsIndicatorModalOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = React.useState(null);
  const [isAppraisalApprovalModalOpen, setIsAppraisalApprovalModalOpen] = React.useState(false);
  const [selectedStrategicObjective, setSelectedStrategicObjective] = React.useState(null);
  const [selectedPerformanceIndicator, setSelectedPerformanceIndicator] = React.useState(null);
  const [isPerformanceAppraisalModalOpen, setIsPerformanceAppraisalModalOpen] = React.useState(false);
  const [currentIndicatorIndex, setCurrentIndicatorIndex] = React.useState(0);
  const [approvalModalCurrentIndex, setApprovalModalCurrentIndex] = React.useState(0);

  useEffect(() => {
    if (subObjectives.length > 0) {
      setExpandedSubObjectiveId(subObjectives[0]?.id || null);
    }
  }, [objective.title, subObjectives]);

  const toggleSubObjective = (id) => {
    setExpandedSubObjectiveId(prev => prev === id ? null : id);
  };

  const currentIndicators = subObjectives.find(
    obj => obj.id === expandedSubObjectiveId
  )?.indicators || [];

  const handleIndicatorEdit = (indicator, index) => {
    setSelectedPerformanceIndicator(indicator);
    setCurrentIndicatorIndex(index);
    setIsPerformanceAppraisalModalOpen(true);
  };

  const handleIndicatorNavigation = (direction) => {
    if (direction === 'next' && currentIndicatorIndex < currentIndicators.length - 1) {
      setCurrentIndicatorIndex(prev => prev + 1);
      setSelectedPerformanceIndicator(currentIndicators[currentIndicatorIndex + 1]);
    } else if (direction === 'prev' && currentIndicatorIndex > 0) {
      setCurrentIndicatorIndex(prev => prev - 1);
      setSelectedPerformanceIndicator(currentIndicators[currentIndicatorIndex - 1]);
    }
  };

  const handleIndicatorClick = (indicator, index) => {
    setSelectedPerformanceIndicator(indicator);
    setCurrentIndicatorIndex(index);
    setIsPerformanceAppraisalModalOpen(true);
  };

  const handleStrategicObjectiveEdit = (objective) => {
    setSelectedStrategicObjective(objective);
    setIsAppraisalApprovalModalOpen(true);
  };

  const handleApprovalModalNavigation = (direction) => {
    if (direction === 'next' && approvalModalCurrentIndex < currentIndicators.length - 1) {
      setApprovalModalCurrentIndex(prev => prev + 1);
      setSelectedIndicator(currentIndicators[approvalModalCurrentIndex + 1]);
    } else if (direction === 'prev' && approvalModalCurrentIndex > 0) {
      setApprovalModalCurrentIndex(prev => prev - 1);
      setSelectedIndicator(currentIndicators[approvalModalCurrentIndex - 1]);
    }
  };

  const handleIndicatorDelete = (indicator, index) => {
    setSelectedIndicator(indicator);
    setApprovalModalCurrentIndex(index);
    setIsAppraisalApprovalModalOpen(true);
  };

  const handleActionSelect = (action) => {
    if (action.name === 'Delete') {
      setSelectedIndicator(objective);
      setIsAppraisalApprovalModalOpen(true);
    }
    setSelectedAction(action);
  };

  const handleAppraisalModalClose = () => {
    setIsPerformanceAppraisalModalOpen(false);
    setSelectedPerformanceIndicator(null);
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-3 shadow-xs overflow-hidden transition-all duration-150">
      {/* Header - Made entire header clickable */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-teal-800 p-3 text-white hover:bg-teal-700 transition-colors"
      >
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center min-w-0 flex-1">
            <div className="shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center mr-2">
              <SunIcon aria-hidden="true" className="size-4 text-teal-800" />
            </div>
            <div title={objective.title}>
              <h3 className="font-semibold text-sm uppercase truncate flex-1">{objective.title}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-2">
            <div className="hidden sm:flex items-center space-x-1 bg-teal-700/30 px-2 py-1 rounded">
              <span className="text-xs">Perspective Weight:</span>
              <span className="font-medium text-sm">{objective.totalWeight}</span>
            </div>
            
            <div className="flex items-center">
              <Avatar className="h-7 w-7">
                <span className="text-xs font-medium text-teal-800">
                  {objective.assignee.name.charAt(0)}
                </span>
              </Avatar>
              <span className="text-xs ml-1 hidden sm:inline">{objective.assignee.name}</span>
            </div>
            
            <div className="p-1 rounded-full hover:bg-teal-700/50 hover:text-white transition-colors bg-white text-teal-700">
              <ChevronUpIcon 
                className={`h-4 w-4 transform transition-transform ${isExpanded ? '' : 'rotate-180'}`}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              />
            </div>
          </div>
        </div>
      </button>

      {/* Content */}
      <div className="bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center">
              <ClockIcon className="w-3 h-3 mr-1" />
              Updated: {objective.lastUpdated}
            </span>
            <span className="flex items-center">
              <CalendarIcon className="w-3 h-3 mr-1" />
              Created: {objective.created}
            </span>
            <span className="flex items-center">
              <DocumentTextIcon className="w-3 h-3 mr-1" />
              {subObjectives.length} Strategic Objective(s)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center text-xs font-medium py-1 px-2 rounded ${
              objective.status === 'Completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {objective.status === 'Completed' 
                ? <CheckCircleIcon className="w-3 h-3 mr-1" />
                : <ExclamationCircleIcon className="w-3 h-3 mr-1" />}
              {objective.status}
            </span>
            
            <Listbox value={selectedAction} onChange={handleActionSelect}>
              <div className="relative">
                <ListboxButton className="flex items-center text-xs border border-teal-700 text-teal-700 rounded px-2.5 py-1 hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-300">
                  Actions
                  <ChevronDownIcon className="h-3 w-3 ml-1" />
                </ListboxButton>
                
                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <ListboxOptions className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none py-1">
                    {itemActions.map((action) => (
                      <ListboxOption
                        key={action.name}
                        value={action}
                        className={({ active }) => 
                          `px-3 py-2 text-sm cursor-default select-none ${
                            active ? 'bg-teal-50 text-teal-900' : 'text-gray-700'
                          } ${action.name === 'Delete' ? 'text-red-600' : ''}`
                        }
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <action.icon className={`w-4 h-4 mr-2 ${action.name === 'Delete' ? 'text-red-600' : 'text-teal-600'}`} />
                            <span>{action.name}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 pl-6">{action.description}</p>
                        </div>
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      {/* Sub-objectives */}
      {isExpanded && subObjectives.length > 0 && (
        <div className="bg-gray-50 p-3 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-600">
              STRATEGIC OBJECTIVES
            </h4>
            <button 
              onClick={() => setIsStrategicModalOpen(true)}
              className="flex items-center text-xs border border-teal-700 text-teal-700 rounded px-2.5 py-1 hover:bg-teal-50"
            >
              <PlusCircleIcon className="h-3 w-3 mr-1" />
              Add Strategic Objective
            </button>
          </div>
          <ul className="space-y-2">
            {subObjectives.map((subObj) => (
              <li key={`${objective.title}-${subObj.id}`} className="bg-white rounded border border-gray-200 overflow-hidden">
                <button 
                  onClick={() => toggleSubObjective(subObj.id)}
                  className="w-full flex items-center justify-between p-2 hover:bg-gray-50 text-left"
                >
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="p-1 rounded mr-1">
                      <ChevronUpIcon className={`h-3 w-3 text-gray-500 transition-transform ${
                        expandedSubObjectiveId === subObj.id ? '' : 'transform rotate-180'
                      }`} />
                    </div>
                    <div title={subObj.name}>
                      <div className='flex items-center'>
                        <span className="text-xs font-medium text-gray-800 truncate max-w-[180px] capitalize">
                          {subObj.name} |
                        </span>
                        <span className="flex items-center text-xs text-gray-500">
                          <DocumentTextIcon className="w-3 h-3 mr-1" />
                          {subObj.indicators.length} Performance Indicator(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded whitespace-nowrap">
                      Strategic Objective Weight: {subObj.weight}
                    </span>
                    {/* Stop propagation on the Listbox to prevent header click */}
                    <div onClick={e => e.stopPropagation()}>
                      <Listbox>
                        <div className="relative">
                          <ListboxButton className="p-1 rounded hover:bg-gray-100">
                            <EllipsisHorizontalIcon className="h-4 w-4 text-gray-500" />
                          </ListboxButton>
                          <ListboxOptions className="absolute right-0 z-10 mt-1 w-32 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none py-1 text-xs">
                            <ListboxOption 
                              value="edit" 
                              className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleStrategicObjectiveEdit(subObj)}
                            >
                              Edit
                            </ListboxOption>
                            <ListboxOption value="delete" className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-red-600">
                              Delete
                            </ListboxOption>
                          </ListboxOptions>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                </button>
                
                {expandedSubObjectiveId === subObj.id && (
                  <div className="bg-gray-50 border-t border-gray-200 p-2 pl-8 pb-16">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-xs font-medium text-gray-500 capitalize">
                        Performance Measure/Indicator
                      </h5>
                      <button 
                        onClick={() => setIsIndicatorModalOpen(true)}
                        className="flex items-center text-xs border border-teal-700 text-teal-700 rounded px-2.5 py-1 hover:bg-teal-50"
                      >
                        <PlusCircleIcon className="h-3 w-3 mr-1" />
                        Add KPIs
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {subObj.indicators.map((indicator, index) => (
                        <li key={indicator.id} className="flex items-center bg-white p-1.5 rounded border border-gray-200">
                          <div className="min-w-0 flex-1 mr-2">
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleIndicatorClick(indicator, index);
                              }}
                            >
                              <div title={indicator.name}>
                                <span className="text-sm/7 text-blue-700 underline line-clamp-2 capitalize">
                                  {indicator.name}
                                </span>
                              </div>
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 whitespace-nowrap">
                              <span className="text-xs text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                Net Weight: {indicator.weight}
                              </span>
                            </div>
                            <Listbox as="div" className="relative z-20">
                              <ListboxButton className="p-0.5 rounded hover:bg-gray-100">
                                <EllipsisHorizontalIcon className="h-3.5 w-3.5 text-gray-500" />
                              </ListboxButton>
                              <ListboxOptions className="absolute right-auto left-0 sm:right-0 sm:left-auto z-30 mt-1 w-28 origin-top-right rounded-md bg-white shadow-lg border border-gray-200 focus:outline-none py-1 text-xs">
                                <ListboxOption 
                                  value="edit" 
                                  className="block px-2 py-1 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleIndicatorEdit(indicator, index)}
                                >
                                  Edit
                                </ListboxOption>
                                <ListboxOption 
                                  value="delete" 
                                  className="block px-2 py-1 hover:bg-gray-100 cursor-pointer text-red-600"
                                  onClick={() => handleIndicatorDelete(indicator, index)}
                                >
                                  Delete
                                </ListboxOption>
                              </ListboxOptions>
                            </Listbox>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <StrategicObjectiveModal 
        isOpen={isStrategicModalOpen}
        closeModal={() => setIsStrategicModalOpen(false)}
      />
      
      <PerformanceIndicatorModal
        isOpen={isIndicatorModalOpen}
        closeModal={() => setIsIndicatorModalOpen(false)}
      />

      <AppraisalModal 
        isOpen={isPerformanceAppraisalModalOpen}
        closeModal={handleAppraisalModalClose}
        indicator={selectedPerformanceIndicator}
        onNavigate={handleIndicatorNavigation}
        hasNext={currentIndicatorIndex < currentIndicators.length - 1}
        hasPrevious={currentIndicatorIndex > 0}
        totalCount={currentIndicators.length}
        currentIndex={currentIndicatorIndex}
      />

      <AppraisalApprovalModal 
        isOpen={isAppraisalApprovalModalOpen}
        closeModal={() => setIsAppraisalApprovalModalOpen(false)}
        indicator={selectedIndicator}
        onNavigate={handleApprovalModalNavigation}
        hasNext={approvalModalCurrentIndex < currentIndicators.length - 1}
        hasPrevious={approvalModalCurrentIndex > 0}
        totalCount={currentIndicators.length}
        currentIndex={approvalModalCurrentIndex}
        onApprove={() => {
          // Handle delete approval
          console.log('Deleting indicator:', selectedIndicator);
          setIsAppraisalApprovalModalOpen(false);
          setSelectedIndicator(null);
          setApprovalModalCurrentIndex(0);
        }}
        onReject={() => {
          setIsAppraisalApprovalModalOpen(false);
          setSelectedIndicator(null);
          setApprovalModalCurrentIndex(0);
        }}
      />
    </div>
  );
};

export default ObjectiveItem;