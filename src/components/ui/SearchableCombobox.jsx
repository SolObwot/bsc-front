import { useState, Fragment, useEffect, useMemo, useRef, useCallback } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};

const SearchableCombobox = ({ 
    label, 
    options, 
    selected, 
    onChange, 
    onSearch, 
    onLoadMore,
    hasMore,
    loading, 
    placeholder, 
    error 
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const observer = useRef();

  const lastOptionElementRef = useCallback(node => {

    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const displayOptions = useMemo(() => {
  const finalOptions = [];
    const seenIds = new Set();

    // Add the currently selected item to the list first.
    if (selected) {
      finalOptions.push(selected);
      if (selected.id != null) {
        seenIds.add(selected.id);
      }
    }

    // Add the options from the search results, avoiding duplicates if they have an ID.
    (options || []).forEach(opt => {
      if (opt) {
        // Add the option if it has no ID, or if its ID hasn't been seen yet.
        if (opt.id == null || !seenIds.has(opt.id)) {
          finalOptions.push(opt);
          if (opt.id != null) {
            seenIds.add(opt.id);
          }
        }
      }
    });
    
    return finalOptions;
  }, [options, selected]);

  const getDisplayValue = (option) => {
    if (!option) return '';
    return `${option.surname} ${option.first_name}`;
  };

  return (
    <div>
      <Combobox value={selected} onChange={onChange} nullable>
        <Combobox.Label className="block text-sm font-medium text-gray-700 mb-1">{label}</Combobox.Label>
        <div className="relative mt-1">
          <div className={`relative w-full cursor-default rounded-md bg-white text-left shadow-sm sm:text-sm border transition-colors ${error ? 'border-red-500' : 'border-gray-300'} focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-50 focus-within:border-indigo-50`}>
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-transparent"
              displayValue={getDisplayValue}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
              {loading && displayOptions.length === 0 && <div className="relative cursor-default select-none px-4 py-2 text-gray-700">Loading...</div>}
              {!loading && displayOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">Nothing found.</div>
              ) : (
                displayOptions.map((option, index) => (
                  <Combobox.Option
                    key={option?.id || `option-${index}`}
                    ref={index === displayOptions.length - 1 ? lastOptionElementRef : null}
                    className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'}`}
                    value={option}
                  >
                    {({ selected: isSelected, active }) => (
                      <>
                        <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>{getDisplayValue(option)}</span>
                        {isSelected ? (<span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'}`}><CheckIcon className="h-5 w-5" aria-hidden="true" /></span>) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
              {loading && displayOptions.length > 0 && <div className="relative cursor-default select-none px-4 py-2 text-gray-700 text-center">Loading more...</div>}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default SearchableCombobox;