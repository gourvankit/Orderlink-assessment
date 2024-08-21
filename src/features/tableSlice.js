import { createSlice } from "@reduxjs/toolkit";

const tableSlice = createSlice({
  name: "table",
  initialState: {
    columns: [
      { id: "name", title: "Name" },
      { id: "age", title: "Age" },
      { id: "email", title: "Email" },
    ],
    data: [],
  },
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    reorderColumns: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      const reorderedColumns = Array.from(state.columns);
      const [movedColumn] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(destinationIndex, 0, movedColumn);
      state.columns = reorderedColumns;
    },
  },
});

export const { setColumns, setData, reorderColumns } = tableSlice.actions;

export default tableSlice.reducer;
