import React from "react";
import { Table } from "flowbite-react";
import { PiTrashLight } from "react-icons/pi";

const TableComponent = ({ headers, data = [], onEdit, onDelete }) => {
  return (
    <Table className="custom-table">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell key={header}>{header}</Table.HeadCell>
        ))}
        <Table.HeadCell>
          <span className="sr-only">Actions</span>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row, rowIndex) => (
          <Table.Row className="custom-row" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell className="custom-cell" key={header}>
                {row[header]}
              </Table.Cell>
            ))}
            <Table.Cell>
              <button
                className="custom-edit-link"
                onClick={() => onEdit(row)}
                href="#"
              >
                Edit
              </button>
            </Table.Cell>
            <PiTrashLight
              size={20}
              className="mt-4 cursor-pointer"
              onClick={() => onDelete(row)}
            />
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
