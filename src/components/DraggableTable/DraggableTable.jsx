import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./DraggableTable.module.css";

const DraggableRow = ({ id, row, columns }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {columns.map((column) => (
        <td key={column.id}>{row[column.id]}</td>
      ))}
    </tr>
  );
};

const DraggableTable = ({ data, columns, onDragEnd }) => {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
          const oldIndex = data.findIndex((item) => item.id === active.id);
          const newIndex = data.findIndex((item) => item.id === over.id);

          onDragEnd(arrayMove(data, oldIndex, newIndex));
        }
      }}
    >
      <SortableContext
        items={data.map((row) => row.id)}
        strategy={verticalListSortingStrategy}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <DraggableRow
                key={row.id}
                id={row.id}
                row={row}
                columns={columns}
              />
            ))}
          </tbody>
        </table>
      </SortableContext>
    </DndContext>
  );
};

export default DraggableTable;
