import React from 'react';
import { InformationCircleIcon} from '@heroicons/react/20/solid';

const InfoBanner = () => {
  return (
    <div className="rounded-md bg-teal-700 p-4 m-4 text-white">
      <div className="flex">
        <div className="shrink-0">
          <InformationCircleIcon aria-hidden="true" className="size-5" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm">
            This is a friendly reminder that all you need to do on this tab is to set your agreement. If you are ready to start your appraisals,{' '}
            <a href="#" className="font-medium whitespace-nowrap underline hover:text-blue-600">
              click here
            </a>. To submit your agreement for review,{' '}
            <a href="#" className="font-medium whitespace-nowrap underline hover:text-blue-600">
              click here
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
