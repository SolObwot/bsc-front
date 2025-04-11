import { useState, useEffect, useCallback } from 'react';

export const useTemplateFilters = (templates = []) => {
  const [filterText, setFilterText] = useState('');
  const [filterStrategicObjective, setFilterStrategicObjective] = useState('');
  const [filterReviewPeriod, setFilterReviewPeriod] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState(templates);

  const applyFilters = useCallback(() => {
    const filtered = templates.filter(template =>
      (template.name?.toLowerCase().includes(filterText.toLowerCase())) &&
      (filterStrategicObjective
        ? template.strategic_objective?.toLowerCase().includes(filterStrategicObjective.toLowerCase())
        : true) &&
      (filterReviewPeriod ? template.review_period === filterReviewPeriod : true) &&
      (filterYear ? new Date(template.created_at).getFullYear().toString() === filterYear : true)
    );
    setFilteredTemplates(filtered);
  }, [templates, filterText, filterStrategicObjective, filterReviewPeriod, filterYear]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleReset = () => {
    setFilterText('');
    setFilterStrategicObjective('');
    setFilterReviewPeriod('');
    setFilterYear('');
  };

  return {
    filteredTemplates,
    filterProps: {
      filterText,
      setFilterText,
      filterStrategicObjective,
      setFilterStrategicObjective,
      filterReviewPeriod,
      setFilterReviewPeriod,
      filterYear,
      setFilterYear,
      handleReset,
    },
  };
};
