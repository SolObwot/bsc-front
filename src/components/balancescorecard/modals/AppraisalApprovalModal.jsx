import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../lib/utils';

const getPerformanceLevels = (targetValue, measurementType) => {
  return [
    { 
      rating: 5, 
      level: "Outstanding",
      range: "Greater than 105%",
      weight: "110%"
    },
    { 
      rating: 4, 
      level: "Exceeds Expectations",
      range: "101%-105%",
      weight: "102%"
    },
    { 
      rating: 3, 
      level: "Meets Expectation(s)",
      range: "100%",
      weight: "100%"
    },
    { 
      rating: 2, 
      level: "Needs Improvement",
      range: "95%-99%",
      weight: "97%"
    },
    { 
      rating: 1, 
      level: "Unsatisfactory",
      range: "Less than 95%",
      weight: "20%"
    },
  ];
};

const AppraisalApprovalModal = ({ 
  isOpen, 
  closeModal, 
  indicator,
  onNavigate,
  hasNext,
  hasPrevious,
  totalCount,
  currentIndex,
  onApprove,
  onReject
}) => {
  const actualValue = indicator?.actualValue || "";
  const selfRating = indicator?.selfRating || "";
  const supervisorRating = indicator?.supervisorRating || "";

  const performanceLevels = React.useMemo(() => 
    getPerformanceLevels(indicator?.targetValue, indicator?.measurementType),
    [indicator?.targetValue, indicator?.measurementType]
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-teal-100">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Dialog.Title className="text-[20px] font-semibold text-gray-700">
                        Performance Appraisal Approval
                      </Dialog.Title>
                      <span className="text-sm text-gray-500">
                        {currentIndex + 1} of {totalCount}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onNavigate('prev')}
                        disabled={!hasPrevious}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          hasPrevious 
                            ? "hover:bg-teal-100 text-gray-600" 
                            : "text-gray-300 cursor-not-allowed"
                        )}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onNavigate('next')}
                        disabled={!hasNext}
                        className={cn(
                          "p-2 rounded-full transition-colors",
                          hasNext 
                            ? "hover:bg-teal-100 text-gray-600" 
                            : "text-gray-300 cursor-not-allowed"
                        )}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                      <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2 ml-2">
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[92vh] overflow-y-auto">
                  <div className="space-y-6">
                    {/* Indicator Details */}
                    <div className="bg-gray-50 p-4 rounded-lg shadow-md mb-4">
                      <h3 className="font-medium text-gray-900">Indicator Details</h3>
                      <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{indicator?.name}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Target Value</dt>
                          <dd className="mt-1 text-sm text-gray-900">{indicator?.targetValue}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Measurement Type</dt>
                          <dd className="mt-1 text-sm text-gray-900 capitalize">{indicator?.measurementType}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Weight</dt>
                          <dd className="mt-1 text-sm text-gray-900">{indicator?.weight}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Ratings Section */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Actual Value
                        </label>
                        <input
                          type="number"
                          value={actualValue}
                          readOnly
                          className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none bg-gray-50 text-[16px] cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Self Rating (1-5)
                        </label>
                        <input
                          type="number"
                          value={selfRating}
                          readOnly
                          className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none bg-gray-50 text-[16px] cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Supervisor's Rating (1-5)
                        </label>
                        <input
                          type="number"
                          value={supervisorRating}
                          readOnly
                          className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none bg-gray-50 text-[16px] cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Weighted Score
                        </label>
                        <input
                          type="text"
                          value={selfRating && supervisorRating ? ((parseFloat(selfRating) + parseFloat(supervisorRating)) / 2).toFixed(2) : ''}
                          readOnly
                          className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none bg-gray-50 text-[16px] cursor-not-allowed font-medium text-teal-600"
                        />
                      </div>
                    </div>

                    {/* Performance Levels Table */}
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Performance Levels Guide 
                        {indicator?.measurementType && (
                          <span className="text-gray-500 ml-2">
                            (Based on {indicator.measurementType} - Less is Better)
                          </span>
                        )}
                      </h3>
                      <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Range</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Score</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {performanceLevels.map((level) => (
                              <tr key={level.rating} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900 font-medium">{level.rating}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{level.level}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{level.range}</td>
                                <td className="px-4 py-2 text-sm text-teal-600 font-medium">{level.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={onReject}
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={onApprove}
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AppraisalApprovalModal;
