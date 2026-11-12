function formatSuccessResponse(data = null, meta = null) {
  const response = {
    success: true,
    data: data !== undefined ? data : null
  };
  if (meta) {
    response.meta = meta;
  }
  return response;
}

function formatErrorResponse(code, message, details = null) {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

module.exports = {
  formatSuccessResponse,
  formatErrorResponse
};

