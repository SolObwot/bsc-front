import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Calendar } from "../../../components/ui/Calender";
import { cn } from '../../../lib/utils';

const metTypeTabs = [
  { label: "# Number", value: "number" },
  { label: "Currency", value: "currency" },
  { label: "% Percentage", value: "percentage" },
  { label: "Date", value: "date" },
];

const PerformanceIndicatorModal = ({ isOpen, closeModal }) => {
  const [name, setName] = React.useState("");
  const [weight, setWeight] = React.useState("");
  const [targetValue, setTargetValue] = React.useState("");
  const [metricTab, setMetricTab] = React.useState("number");
  const [targetDate, setTargetDate] = React.useState();

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-teal-100">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-[20px] font-semibold text-gray-700">
                      Add Performance Measure/Indicator
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[92vh] overflow-y-auto">
                  <form className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="font-medium text-[15px] text-gray-900">
                          Indicator Name <span className="text-red-500 ml-1">*</span>
                        </label>
                        <span className="text-xs text-gray-400">(Char {name.length} of 1000)</span>
                      </div>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value.slice(0, 1000))}
                        className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                        placeholder="Enter indicator name"
                        maxLength={1000}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                         Net Weight (%)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                        placeholder="Enter weight percentage"
                      />
                    </div>

                    {/* Metric type tabs */}
                    <div className="mb-4">
                      <label className="text-[15px] font-medium text-gray-800 mb-1 block">
                        Measurement Type <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {metTypeTabs.map((tab) => (
                          <button
                            key={tab.value}
                            className={cn(
                              "rounded-tl rounded-tr px-4 py-2 text-sm border border-teal-200 bg-teal-50 font-medium",
                              metricTab === tab.value
                                ? "bg-teal-600 text-white border-teal-600 z-10"
                                : "hover:bg-teal-100 text-teal-700"
                            )}
                            onClick={e => {e.preventDefault(); setMetricTab(tab.value)}}
                            type="button"
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Conditional Target Value/Date Input */}
                    {metricTab === 'date' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Target Date
                        </label>
                        <div className="relative">
                          <CalendarDaysIcon className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
                          <Calendar
                            selected={targetDate}
                            onSelect={setTargetDate}
                            className="rounded border border-teal-200 w-full px-4 py-2 pl-10 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Target Value
                        </label>
                        <input
                          type="text"
                          value={targetValue}
                          onChange={e => setTargetValue(e.target.value)}
                          className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                          placeholder="Enter target value"
                        />
                      </div>
                    )}

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        Save Indicator
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PerformanceIndicatorModal;