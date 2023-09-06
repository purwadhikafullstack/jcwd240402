import React from "react";
import { Table } from "flowbite-react";
import { PiTrashLight } from "react-icons/pi";
import Button from "./Button"; 

const TableComponent = ({
  headers,
  data = [],
  onEdit,
  onDelete,
  onTransfer,
  onApproveReject, 
  showIcon = true,
  showTransfer = false,
  showApproveReject = false, 
}) => {
  return (
    <Table className="custom-table bg-white rounded-lg shadow-lg">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell className="bg-blue5" key={header}>
            {header}
          </Table.HeadCell>
        ))}
        {showTransfer && showIcon && (
          <Table.HeadCell className="bg-blue5">
            <span className="sr-only">Transfer</span>
          </Table.HeadCell>
        )}
        {showApproveReject && (
          <Table.HeadCell className="bg-blue5">
            <span className="sr-only">Approve/Reject</span>
          </Table.HeadCell>
        )}
        {showIcon && (
          <Table.HeadCell className="bg-blue5">
            <span className="sr-only">Edit</span>
          </Table.HeadCell>
        )}
        {showIcon && (
          <Table.HeadCell className="bg-blue5">
            <span className="sr-only">Delete</span>
          </Table.HeadCell>
        )}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row, rowIndex) => (
          <Table.Row className="custom-row" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell className="custom-cell" key={header}>
                {header === "Image" ? (
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${row[header]}`}
                    alt="Product"
                    width="50"
                    height="50"
                  />
                ) : (
                  row[header]
                )}
              </Table.Cell>
            ))}
            {showTransfer && showIcon && (
              <Table.Cell>
                <button
                  className="custom-transfer-link"
                  onClick={() => onTransfer(row)}
                >
                  Transfer
                </button>
              </Table.Cell>
            )}
            {showApproveReject && (
              <Table.Cell>
                <Button
                  buttonSize="small"
                  buttonText="Manage"
                  onClick={() => onApproveReject(row)} 
                  bgColor="bg-blue3"
                  colorText="text-white"
                  fontWeight="font-semibold"
                />
              </Table.Cell>
            )}
            {showIcon && (
              <Table.Cell>
                <button
                  className="custom-edit-link"
                  onClick={() => onEdit(row)}
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
