import { useState, useCallback, useRef } from 'react';
import axios from '../../lib/axios';

const useUserSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Ref to store the current search query
  const currentQueryRef = useRef('');

  const searchUsers = useCallback(async (query) => {
    currentQueryRef.current = query;
    if (!query) {
      setSearchResults([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/users?search=${query}&page=1`);
      const responseData = res.data.data || res.data || [];
      const meta = res.data.meta;
      
      const transformedData = responseData.map(user => {
        const employmentDetails = Array.isArray(user.employment_details)
          ? user.employment_details[0] || {}
          : user.employment_details || {};
        const t = {
          ...user,
          department: user.unit_or_branch?.department?.name || null,
          unit: user.unit_or_branch?.name || null,
          fullDepartment: user.unit_or_branch?.department?.name || 'N/A',
          fullUnit: user.unit_or_branch?.name || 'N/A',
          jobTitle: user.job_title?.name || null,
          employmentCategory: employmentDetails.employment_category,
          isProbation: employmentDetails.is_probation === 1,
        };
        return t;
      });
      
      setSearchResults(transformedData);
      if (meta) {
        setHasMore(meta.current_page < meta.last_page);
        setPage(meta.current_page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreUsers = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await axios.get(`/users?search=${currentQueryRef.current}&page=${nextPage}`);
      const responseData = res.data.data || res.data || [];
      const meta = res.data.meta;

      const transformedData = responseData.map(user => {
        const employmentDetails = Array.isArray(user.employment_details)
          ? user.employment_details[0] || {}
          : user.employment_details || {};
        return {
          ...user,
          department: user.unit_or_branch?.department?.name || null,
          unit: user.unit_or_branch?.name || null,
          fullDepartment: user.unit_or_branch?.department?.name || 'N/A',
          fullUnit: user.unit_or_branch?.name || 'N/A',
          jobTitle: user.job_title?.name || null,
          employmentCategory: employmentDetails.employment_category,
          isProbation: employmentDetails.is_probation === 1,
        };
      });

      setSearchResults(prev => [...prev, ...transformedData]);
      if (meta) {
        setHasMore(meta.current_page < meta.last_page);
        setPage(meta.current_page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  return { searchResults, loading, error, hasMore, searchUsers, loadMoreUsers };
};

export default useUserSearch;