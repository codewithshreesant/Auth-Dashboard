import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const fetchData = async (params = {}) => {

  await new Promise((resolve) => setTimeout(resolve, 500));
  const { page = 1, limit = 10, sortBy, sortOrder, filter } = params;

  let mockData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.random() * 100,
    category: ['Electronics', 'Clothing', 'Books'][i % 3],
    stock: Math.floor(Math.random() * 50),
  }));

  if (filter) {
    mockData = mockData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  if (sortBy) {
    mockData.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (typeof valueA === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockData.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: mockData.length,
  };
};

export const fetchDashboardData = createAsyncThunk(
  'data/fetchDashboardData',
  async (params) => {
    const response = await fetchData(params);
    return response;
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    sortBy: null,
    sortOrder: 'asc',
    filter: '',
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
      state.currentPage = 1; 
    },
    setSort: (state, action) => {
      const { sortBy } = action.payload;
      if (state.sortBy === sortBy) {
        state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = sortBy;
        state.sortOrder = 'asc';
      }
      state.currentPage = 1; 
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 1; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, setPageSize, setSort, setFilter } = dataSlice.actions;
export default dataSlice.reducer;