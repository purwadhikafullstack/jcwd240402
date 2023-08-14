import React from 'react';
import { Table } from 'flowbite-react';

const TableComponent = ({ headers, data, onEdit }) => {
  return (
    <Table>
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
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell
                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
                key={header}
              >
                {row[header]}
              </Table.Cell>
            ))}
            <Table.Cell>
              <a
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
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
