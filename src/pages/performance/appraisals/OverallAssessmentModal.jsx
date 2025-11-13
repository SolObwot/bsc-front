import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, UserCircleIcon, CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";
import StatusBadge from "./AppraisalStatusBadge"; 

const OverallAssessmentModal = ({ isOpen, closeModal, appraisal, onApprove, onReject }) => {
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
                                        <Dialog.Title className="text-lg font-semibold text-gray-700">
                                            Overall Assessment Score
                                        </Dialog.Title>
                                        <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                                            <XMarkIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="px-7 pt-7 pb-4">
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <h3 className="font-medium text-lg text-gray-800 mb-2">{appraisal?.agreementTitle}</h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span>{appraisal?.employeeName || "Current User"} - {appraisal?.employeeTitle || "Position"}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span>Period: {appraisal?.period}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
                                                    <span>Submitted: {appraisal?.submittedDate ? new Date(appraisal.submittedDate).toLocaleDateString() : "N/A"}</span>
                                                </div>
                                                <div>
                                                    <StatusBadge status={appraisal?.status} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th colSpan="4" className="px-4 py-3 text-center text-sm font-semibold text-gray-800 uppercase tracking-wider border-b">
                                                            OVERALL ASSESSMENT: (Overall assessment to be obtained by getting a total of Part A and B of the KPIs)
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            SCORE
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            Part A (Quantative Objectives)
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            Part B (Qualitative Objectives)
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r">TOTAL POINTS</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartA || "0"}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 border-r">{appraisal?.totalPartB || "0"}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{appraisal?.totalScore || "0"}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="border rounded-lg overflow-hidden">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            Total Score Points
                                                        </th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            100 – 91
                                                        </th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            90 – 76
                                                        </th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            75 – 60
                                                        </th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                                                            59 – 50
                                                        </th>
                                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            49-40
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r">Assessment</td>
                                                        <td className="px-4 py-2 text-sm text-center font-medium text-green-700 border-r">Excellent</td>
                                                        <td className="px-4 py-2 text-sm text-center font-medium text-blue-700 border-r">Very Good</td>
                                                        <td className="px-4 py-2 text-sm text-center font-medium text-teal-700 border-r">Good</td>
                                                        <td className="px-4 py-2 text-sm text-center font-medium text-amber-700 border-r">Fair</td>
                                                        <td className="px-4 py-2 text-sm text-center font-medium text-red-700">Below Average</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r">Overall Assessment</td>
                                                        <td colSpan="5" className={`px-4 py-2 text-sm text-center font-bold ${
                                                            appraisal?.totalScore >= 91 ? "bg-green-100 text-green-800" :
                                                            appraisal?.totalScore >= 76 ? "bg-blue-100 text-blue-800" :
                                                            appraisal?.totalScore >= 60 ? "bg-teal-100 text-teal-800" :
                                                            appraisal?.totalScore >= 50 ? "bg-amber-100 text-amber-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}>
                                                            {
                                                                appraisal?.totalScore >= 91 ? "Excellent" :
                                                                appraisal?.totalScore >= 76 ? "Very Good" :
                                                                appraisal?.totalScore >= 60 ? "Good" :
                                                                appraisal?.totalScore >= 50 ? "Fair" :
                                                                appraisal?.totalScore >= 40 ? "Below Average" : "Not Rated"
                                                            }
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            onClick={closeModal}
                                            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => onReject && onReject(appraisal)}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                                        >
                                            Reject Supervisor's Rating
                                        </button>
                                        <button
                                            onClick={() => onApprove && onApprove(appraisal)}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            Accept Supervisor's Rating
                                        </button>
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

export default OverallAssessmentModal;