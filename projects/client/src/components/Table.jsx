import React, { useState } from "react";
import { Table } from "flowbite-react";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import Button from "./Button";

const TableComponent = ({
  headers,
  data = [],
  onEdit,
  onDelete,
  onTransfer,
  onApproveReject,
  onDetails,
  showIcon = true,
  showTransfer = false,
  showApproveReject = false,
  showDetails = false,
}) => {
  const [showDropdownIndex, setShowDropdownIndex] = useState(-1);

  const handleDropdownToggle = (index) => {
    setShowDropdownIndex(showDropdownIndex === index ? -1 : index);
  };

  return (
    <Table className="custom-table bg-white rounded-lg shadow-lg">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell className="bg-blue5 text-center" key={header}>
            {header}
          </Table.HeadCell>
        ))}
        {(showTransfer || showApproveReject || showIcon) && (
          <Table.HeadCell className="bg-blue5">
            <span className="sr-only">Actions</span>
          </Table.HeadCell>
        )}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row, rowIndex) => (
          <Table.Row className="custom-row" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell className={`custom-cell text-center`} key={header}>
                {header === "Image" ? (
                  <img
                    className="mx-auto"
                    src={`${process.env.REACT_APP_API_BASE_URL}${row[header]}`}
                    alt="Product"
                    width="60"
                    height="60"
                  />
                ) : (
                  row[header]
                )}
              </Table.Cell>
            ))}
            {(showTransfer || showIcon || showApproveReject) && (
              <Table.Cell>
                {showApproveReject && (
                  <Button
                    buttonSize="small"
                    buttonText="Manage"
                    onClick={() => onApproveReject(row)}
                    bgColor="bg-blue3"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                )}
                <div className="relative inline-block ml-2">
                  {(showTransfer || showIcon) && (
                    <IoEllipsisHorizontalCircle
                      size={20}
                      className="cursor-pointer"
                      onClick={() => handleDropdownToggle(rowIndex)}
                    />
                  )}
                  {showDropdownIndex === rowIndex && (
                    <div className="absolute right-0 bg-white rounded-lg shadow-card-1 border border-gray-200 z-20">
                      <ul className="list-none">
                        {showTransfer && (
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <button onClick={() => onTransfer(row)}>
                              Transfer
                            </button>
                          </li>
                        )}
                        {showDetails && (
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <button onClick={() => onDetails(row)}>
                              Details
                            </button>
                          </li>
                        )}
                        {showIcon && (
                          <li className="py-2 px-4 cursor-pointer hover-bg-gray-100">
                            <button onClick={() => onEdit(row)}>Edit</button>
                          </li>
                        )}
                        {showIcon && (
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <button onClick={() => onDelete(row)}>
                              Delete
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
