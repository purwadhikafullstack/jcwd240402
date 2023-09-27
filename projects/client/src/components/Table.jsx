import React, { useState } from "react";
import { Table } from "flowbite-react";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import Button from "./Button";
import OrderModal from "./modal/orderList/OrderModal";
import noimage from "../../src/assets/images/noimagefound.jpg";

const TableComponent = ({
  headers,
  data = [],
  onEdit,
  onDelete,
  onTransfer,
  onApproveReject,
  onApprove,
  onReject,
  onSend,
  onCancel,
  onDetails,
  showIcon = true,
  showTransfer = false,
  showApproveReject = false,
  showApprove = false,
  showReject = false,
  showSend = false,
  showCancel = false,
  showAsyncAction = false,
  showDetails = false,
  successMsg,
  openAlert,
  setOpenAlert,
  color,
  errMsg,
}) => {
  const [showDropdownIndex, setShowDropdownIndex] = useState(-1);

  const handleDropdownToggle = (index) => {
    setShowDropdownIndex(showDropdownIndex === index ? -1 : index);
  };

  const shouldShowActions = () => {
    return (
      showTransfer ||
      showApproveReject ||
      showIcon ||
      showApprove ||
      showReject ||
      showSend ||
      showCancel ||
      showAsyncAction ||
      showDetails
    );
  };

  const handleDelete = (row) => {
    if (onDelete) {
      onDelete(row);
    }
    setShowDropdownIndex(-1);
  };

  return (
    <Table className="custom-table bg-white rounded-lg shadow-lg">
      <Table.Head className="sticky -top-0.5 z-10">
        {headers.map((header) => (
          <Table.HeadCell className="bg-blue5 text-center " key={header}>
            {header}
          </Table.HeadCell>
        ))}
        {shouldShowActions() && (
          <Table.HeadCell className="bg-blue5 text-center"></Table.HeadCell>
        )}
      </Table.Head>
      <Table.Body className="divide-y">
        {data.map((row, rowIndex) => (
          <Table.Row className="custom-row" key={rowIndex}>
            {headers.map((header) => (
              <Table.Cell
                className={`custom-cell text-center  max-w-md break-words whitespace-normal `}
                key={header}
              >
                {header === "Image" ? (
                  <img
                    className="mx-auto"
                    src={
                      row[header]
                        ? ` ${process.env.REACT_APP_API_BASE_URL}${row[header]}`
                        : noimage
                    }
                    alt="Product"
                    width="60"
                    height="60"
                  />
                ) : (
                  row[header]
                )}
              </Table.Cell>
            ))}

            {shouldShowActions() && (
              <Table.Cell className="overflow-visible">
                {showAsyncAction && (
                  <OrderModal
                    row={row}
                    onApprove={onApprove}
                    onReject={onReject}
                    onSend={onSend}
                    onCancel={onCancel}
                    successMsg={successMsg}
                    errMsg={errMsg}
                    openAlert={openAlert}
                    setOpenAlert={setOpenAlert}
                    color={color}
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
                  {showApproveReject && row.shouldShowApproveReject && (
                    <Button
                      buttonSize="small"
                      buttonText="Manage"
                      onClick={() => onApproveReject(row)}
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
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
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <button onClick={() => onEdit(row)}>Edit</button>
                          </li>
                        )}
                        {showIcon && (
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                            <button onClick={() => handleDelete(row)}>
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
