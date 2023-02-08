module.exports.WAREHOUSE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_SERVICE: "out of service",
  UNDER_MAINTENANCE: "under maintenance",
};

/**
 * Pending: This means that the transfer has been initiated but not yet completed.
 * COMPLETED: This means that the transfer has been completed and the product has been moved from the source warehouse to the destination warehouse.
 * Rejected: This means that the transfer has been rejected and will not be executed.
 */
module.exports.TRANSFER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  REJECTED: "rejected",
};

module.exports.TRANSFER_TYPES = {
  STATIC_TO_STATIC: "Static-Static",
  STATIC_TO_PORTABLE: "Static-Portable",
  PORTABLE_TO_STATIC: "Portable-Static",
  PORTABLE_TO_PORTABLE: "Portable-Portable",
  SUPPLIER_TO_STATIC: "Supplier-Static",
};

module.exports.UPDATE_PRODUCT_STOCK_TYPE = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
};

module.exports.USERT_TYPES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  MANAGER: "manager",
  TECHNICIAN: "technician",
};
