import React from "react";
import TableView from "./pages/TableView";
import { DragDropContext } from "react-beautiful-dnd";
import Header from "./components/Header";

function App() {
  const onDragEnd = (result) => {
    // Handle drag end logic if needed
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App">
        <Header />
        <TableView />
      </div>
    </DragDropContext>
  );
}

export default App;
