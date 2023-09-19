import React, { useState } from "react";
import { Table } from "flowbite-react";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import Select from "react-select";
import Button from "./Button";
import OrderModal from "./modal/orderList/OrderModal";

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
}) => {
  const [showDropdownIndex, setShowDropdownIndex] = useState(-1);
  const [selectedActions, setSelectedActions] = useState(
    Array(data.length).fill(null)
  );

  const handleDropdownToggle = (index) => {
    setShowDropdownIndex(showDropdownIndex === index ? -1 : index);
  };

  const actionOptions = [
    { value: "approve", label: "Approve" },
    { value: "reject", label: "Reject" },
    { value: "cancel", label: "Cancel" },
    { value: "send", label: "Send" },
  ];

  const handleConfirmAction = (row, rowIndex) => {
    const selectedActionForRow = selectedActions[rowIndex];
    if (!selectedActionForRow) return;
    switch (selectedActionForRow.value) {
      case "approve":
        onApprove(row);
        break;
      case "reject":
        onReject(row);
        break;
      case "cancel":
        onCancel(row);
        break;
      case "send":
        onSend(row);
        break;
      default:
        break;
    }

    const newActions = [...selectedActions];
    newActions[rowIndex] = null;
    setSelectedActions(newActions);
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
      showAsyncAction
    );
  };

  console.log(headers);
  console.log(data);
  console.log(data);

  return (
    <Table className="custom-table bg-white rounded-lg shadow-lg">
      <Table.Head>
        {headers.map((header) => (
          <Table.HeadCell className="bg-blue5 text-center" key={header}>
            {header}
          </Table.HeadCell>
        ))}
        {shouldShowActions() && (
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
            {shouldShowActions() && (
              <Table.Cell className="overflow-visible">
                {showAsyncAction && (
                  <OrderModal
                    row={row}
                    onApprove={onApprove}
                    onReject={onReject}
                    onSend={onSend}
                    onCancel={onCancel}
                  />
                )}
              </Table.Cell>
            )}
            {/* {shouldShowActions() && (
              <Table.Cell className="overflow-visible">
                <div className="flex items-center space-x-2">
                  {showAsyncAction && (
                    <>
                      <Select
                        options={actionOptions}
                        placeholder="Options"
                        value={selectedActions[rowIndex]}
                        onChange={(value) => {
                          const newActions = [...selectedActions];
                          newActions[rowIndex] = value;
                          setSelectedActions(newActions);
                        }}
                        className="w-36 flex-shrink-0"
                      />
                      <Button
                        buttonSize="small"
                        buttonText="Confirm"
                        onClick={() => handleConfirmAction(row, rowIndex)}
                        bgColor="bg-blue3"
                        colorText="text-white"
                        fontWeight="font-semibold"
                        className="flex-shrink-0 p-1 text-sm"
                      />
                    </>
                  )}
                </div>
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
                          <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
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
            )} */}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TableComponent;
