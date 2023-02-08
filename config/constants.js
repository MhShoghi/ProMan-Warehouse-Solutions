module.exports.WAREHOUSE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_SERVICE: "out of service",
  UNDER_MAINTENANCE: "under maintenance",
};

/**
 * Pending: This means that the transfer has been initiated but not yet completed.
 * Approved: This means that the transfer has been approved and is ready to be executed.
 * Executed: This means that the transfer has been completed and the product has been moved from the source warehouse to the destination warehouse.
 * Rejected: This means that the transfer has been rejected and will not be executed.
 */
module.exports.TRANSFER_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  EXECUTED: "executed",
  REJECTED: "rejected",
};

module.exports.TRANSFER_TYPES = {
  STATIC_TO_STATIC: "Static-Static",
  STATIC_TO_PORTABLE: "Static-Portable",
  PORTABLE_TO_STATIC: "Portable-Static",
  PORTABLE_TO_PORTABLE: "Portable-Portable",
  SUPPLIER_TO_STATIC: "Supplier-Static",
};
