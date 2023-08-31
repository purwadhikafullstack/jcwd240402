import React from "react";
import { Table } from "flowbite-react";
import { PiTrashLight } from "react-icons/pi";

const TableComponent = ({
  headers,
  data = [],
  onEdit,
  onDelete,
  showIcon = true,
}) => {
  return (
    <Table className="custom-table">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell key={header}>{header}</Table.HeadCell>
        ))}
        {showIcon && <Table.HeadCell><span className="sr-only">Edit</span></Table.HeadCell>}
        {showIcon && <Table.HeadCell><span className="sr-only">Delete</span></Table.HeadCell>}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row, rowIndex) => (
          <Table.Row className="custom-row" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell className="custom-cell" key={header}>
                {header === "Image" ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${row[header]}`}
                    alt="Product Image"
                    width="50"
                    height="50"
                  />
                ) : (
                  row[header]
                )}
              </Table.Cell>
            ))}
            {showIcon && (
              <Table.Cell>
                <button
                  className="custom-edit-link"
                  onClick={() => onEdit(row)}
                  href="#"
                >
                  Edit
                </button>
              </Table.Cell>
            )}
            {showIcon && (
              <Table.Cell>
                <PiTrashLight
                  size={20}
                  className="cursor-pointer"
                  onClick={() => onDelete(row)}
                />
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
