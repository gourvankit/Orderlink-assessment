import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../../features/tableSlice";
import { fetchData } from "../../services/api";
import DraggableTable from "../DraggableTable/DraggableTable";
import styles from "./Table.module.css";
import Pagination from "@mui/material/Pagination";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import TextField from "@mui/material/TextField";
import { saveAs } from "file-saver";

const Table = () => {
  const dispatch = useDispatch();
  const { columns, data } = useSelector((state) => state.table);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((col) => col.id)
  );
  const [draggableData, setDraggableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        dispatch(setData(fetchedData));
      } catch (err) {
        setError("Error fetching data");
      }
    };
    loadData();
  }, [dispatch]);

  const handleSort = (columnId) => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    const sortedData = [...data].sort((a, b) => {
      if (a[columnId] < b[columnId]) return newDirection === "asc" ? -1 : 1;
      if (a[columnId] > b[columnId]) return newDirection === "asc" ? 1 : -1;
      return 0;
    });
    dispatch(setData(sortedData));
    setSortColumn(columnId);
    setSortDirection(newDirection);
  };

  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column.id].toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCellClick = (rowId, columnId) => {
    setEditingCell({ rowId, columnId });
    setEditValue(data.find((row) => row.id === rowId)[columnId]);
  };

  const handleCellChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleCellBlur = () => {
    if (editingCell) {
      const { rowId, columnId } = editingCell;
      const updatedData = data.map((row) =>
        row.id === rowId ? { ...row, [columnId]: editValue } : row
      );
      dispatch(setData(updatedData));
      setEditingCell(null);
    }
  };

  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  const visibleColumnsData = columns.filter((col) =>
    visibleColumns.includes(col.id)
  );
  const handleDragEnd = (updatedData) => {
    const newData = [...data];
    // Update only the data on the current page
    const startIdx = (currentPage - 1) * rowsPerPage;
    newData.splice(startIdx, updatedData.length, ...updatedData);
    dispatch(setData(newData));
    setDraggableData(updatedData);
  };
  const handleDownload = () => {
    const csvData = draggableData
      .map((row) => visibleColumns.map((colId) => row[colId]).join(","))
      .join("\n");

    const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(csvBlob, "view-data.csv");
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.inputContainer}>
        <p>Search</p>
        <TextField
          id="outlined-basic"
          label="Search Results"
          onChange={(e) => setFilterText(e.target.value)}
          variant="outlined"
          value={filterText}
          size="small"
        />
      </div>
      <div className={styles.columnVisibility}>
        {columns.map((column) => (
          <label key={column.id}>
            <Checkbox
              type="checkbox"
              color="success"
              checked={visibleColumns.includes(column.id)}
              onChange={() => toggleColumnVisibility(column.id)}
            />
            {column.title}
          </label>
        ))}
      </div>

      <div className={styles.drag}>
        <DraggableTable
          data={paginatedData}
          columns={visibleColumnsData}
          onDragEnd={handleDragEnd}
        />
        {draggableData.length > 0 ? (
          <Button variant="contained" onClick={handleDownload}>
            Download
          </Button>
        ) : (
          <Button variant="contained" disabled>
            Download
          </Button>
        )}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            {visibleColumnsData.map((column) => (
              <th key={column.id} onClick={() => handleSort(column.id)}>
                {column.title}{" "}
                {sortColumn === column.id &&
                  (sortDirection === "asc" ? "🔼" : "🔽")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              {visibleColumnsData.map((column) => (
                <td
                  key={column.id}
                  onClick={() => handleCellClick(row.id, column.id)}
                >
                  {editingCell?.rowId === row.id &&
                  editingCell?.columnId === column.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={handleCellChange}
                      onBlur={handleCellBlur}
                      autoFocus
                    />
                  ) : (
                    row[column.id]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <span>
          <Pagination
            count={totalPages}
            variant="outlined"
            shape="rounded"
            onChange={(key, val) => setCurrentPage(val)}
          />
          {/* Page {currentPage} of {totalPages} */}
        </span>
      </div>
      <div className={styles.author}>
        <span>Created By- Gourvankit Singh Bhati</span>
      </div>
    </div>
  );
};

export default Table;
