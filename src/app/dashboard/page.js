'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboardData, setPage, setPageSize, setSort, setFilter } from '../../store/slices/dataSlice'; 
import { logout } from '../../store/slices/authSlice'; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DashboardPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, total, loading, error, currentPage, pageSize, sortBy, sortOrder, filter } = useSelector(
    (state) => state.data
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    } else {
      dispatch({ type: 'auth/loginSuccess', payload: token }); 
      fetchData();
    }
  }, [router, dispatch, isAuthenticated, currentPage, pageSize, sortBy, sortOrder, filter]);

  const fetchData = () => {
    dispatch(
      fetchDashboardData({
        page: currentPage,
        limit: pageSize,
        sortBy,
        sortOrder,
        filter,
      })
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    router.push('/login');
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (e) => {
    dispatch(setPageSize(parseInt(e.target.value)));
  };

  const handleSort = (field) => {
    dispatch(setSort(field));
  };

  const handleFilterChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  const totalPages = Math.ceil(total / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const categoryData = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  if (!isAuthenticated) {
    return null; 
  }

  if (loading) {
    return <div className="p-4">Loading data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="mb-4 flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-gray-700">
              Filter:
            </label>
            <input
              type="text"
              id="filter"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 text-gray-700">
              Items per page:
            </label>
            <select
              id="pageSize"
              className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto shadow-md rounded-md">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('category')}
                >
                  Category {sortBy === 'category' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('stock')}
                >
                  Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-indigo-600 hover:text-indigo-900">
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
              {data.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-gray-600">
              Showing page {currentPage} of {totalPages}
            </div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 rounded-l-md border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  aria-current={currentPage === number ? 'page' : undefined}
                  className={`${
                    currentPage === number
                      ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:z-20`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-2 py-2 rounded-r-md border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 focus:z-20"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Data Visualization</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data to display in the chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;