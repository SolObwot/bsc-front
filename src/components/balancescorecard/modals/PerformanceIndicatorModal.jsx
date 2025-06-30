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

const defaultRubric = [
  { level: 1, label: "Below Average", description: "" },
  { level: 2, label: "Fair", description: "" },
  { level: 3, label: "Good", description: "" },
  { level: 4, label: "Very Good", description: "" },
  { level: 5, label: "Outstanding", description: "" },
];

const PerformanceIndicatorModal = ({ 
  isOpen, 
  closeModal, 
  strategicObjective, 
  isEditing = false,
  editData = null,
  onSave = () => {},
  isQualitative = false,
}) => {
  // Shared state
  const [name, setName] = React.useState(editData?.name || "");

  // Quantitative state
  const [weight, setWeight] = React.useState(editData?.weight || "");
  const [targetValue, setTargetValue] = React.useState(
    editData?.measurementType !== 'date' ? editData?.targetValue || "" : ""
  );
  const [metricTab, setMetricTab] = React.useState(editData?.measurementType || "number");
  const [targetDate, setTargetDate] = React.useState(
    editData?.measurementType === 'date' && editData?.targetValue instanceof Date
      ? editData.targetValue
      : editData?.measurementType === 'date' && typeof editData?.targetValue === 'string'
      ? new Date(editData.targetValue)
      : undefined
  );

  // Qualitative state
  const [rubric, setRubric] = React.useState(defaultRubric);

  React.useEffect(() => {
    if (isOpen && editData) {
      setName(editData.name || "");
      if (isQualitative) {
        setRubric(
          [1,2,3,4,5].map(lvl => editData.qualitative_levels?.find(l => l.level === lvl) || { level: lvl, label: "", description: "" })
        );
      } else {
        setWeight(editData.weight || "");
        if (editData.measurementType === 'date') {
          setMetricTab('date');
          if (editData.targetValue instanceof Date) {
            setTargetDate(editData.targetValue);
          } else if (typeof editData.targetValue === 'string') {
            try {
              const date = new Date(editData.targetValue);
              if (!isNaN(date.getTime())) {
                setTargetDate(date);
              }
            } catch (e) {
              setTargetDate(undefined);
            }
          }
          setTargetValue("");
        } else {
          setMetricTab(editData.measurementType || "number");
          setTargetValue(editData.targetValue || "");
          setTargetDate(undefined);
        }
      }
    } else if (isOpen && !editData) {
      setName("");
      setWeight("");
      setTargetValue("");
      setMetricTab("number");
      setTargetDate(undefined);
      setRubric(defaultRubric);
    }
  }, [isOpen, editData, isQualitative]);

  const handleRubricChange = (idx, field, value) => {
    setRubric(prev =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: value } : l))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isQualitative) {
      const formData = {
        name,
        type: "qualitative",
        qualitative_levels: rubric,
      };
      if (isEditing && editData?.id) {
        formData.id = editData.id;
      }
      onSave(formData);
      closeModal();
      return;
    }

    // Quantitative
    const formData = {
      name,
      weight,
      measurementType: metricTab,
      targetValue: metricTab === 'date' ? targetDate : targetValue,
      type: "quantitative",
    };
    if (isEditing && editData?.id) {
      formData.id = editData.id;
    }
    onSave(formData);
    closeModal();
  };

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
                      {isEditing ? 'Edit' : 'Add'} Performance Measure/Indicator
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-7 pt-7 pb-4 max-h-[92vh] overflow-y-auto">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="font-medium text-[15px] text-gray-900">
                          Performance Measure/Indicator<span className="text-red-500 ml-1">*</span>
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
                        required
                      />
                    </div>

                    {isQualitative ? (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Qualitative Rubric</h4>
                        {rubric.map((level, idx) => (
                          <div key={level.level} className="flex flex-col gap-2 border-b pb-3 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-teal-700">Level {level.level}</span>
                              <input
                                type="text"
                                className="border rounded px-2 py-1 flex-1"
                                placeholder="Label"
                                value={level.label}
                                onChange={e => handleRubricChange(idx, "label", e.target.value)}
                              />
                            </div>
                            <textarea
                              className="border rounded px-2 py-1 w-full"
                              placeholder="Description"
                              value={level.description}
                              onChange={e => handleRubricChange(idx, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Net Weight (%)
                          </label>
                          <input
                            type="text"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                            placeholder="Enter weight percentage"
                            required
                          />
                        </div>

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

                        {metricTab === 'date' ? (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Target
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
                              Target
                            </label>
                            <input
                              type="text"
                              value={targetValue}
                              onChange={e => setTargetValue(e.target.value)}
                              className="rounded border border-teal-200 w-full px-4 py-2 mt-1 outline-none focus:border-teal-400 text-[16px] bg-teal-50"
                              placeholder="Enter target value"
                              required
                            />
                          </div>
                        )}
                      </>
                    )}

                    {isEditing && strategicObjective && (
                      <div className="bg-gray-50 p-3 rounded-md mt-4">
                        <p className="text-xs text-gray-500">
                          This indicator belongs to strategic objective:
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {strategicObjective.name}
                        </p>
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
                        {isEditing ? 'Update' : 'Save'} Indicator
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