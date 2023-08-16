import React from 'react';
import { Table } from 'flowbite-react';


const TableComponent = ({ headers, data, onEdit }) => {
  return (
    <Table className="custom-table">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell key={header}>{header}</Table.HeadCell>
        ))}
        <Table.HeadCell>
          <span className="sr-only">Edit</span>
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
                className="custom-edit-link"
                onClick={() => onEdit(row)}
                href="#"
              >
                Edit
              </a>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
