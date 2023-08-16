import React from 'react';
import { Table } from 'flowbite-react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing the Edit and Trash icons from Font Awesome

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
              <Table.Cell
                className="custom-cell"
                key={header}
              >
                {row[header]}
              </Table.Cell>
            ))}
            <Table.Cell>
              <a
                className="custom-edit-link mr-2" // Added margin for spacing
                onClick={() => onEdit(row)}
                href="#"
              >
                <FaEdit />
              </a>
              <a
                className="custom-trash-link"
                onClick={() => onDelete(row)}
                href="#"
              >
                <FaTrash />
              </a>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
