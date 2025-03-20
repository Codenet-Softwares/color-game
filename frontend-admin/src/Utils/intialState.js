export function getCreateSubAdmin(body = {}) {
  return {
    userName: "",
    password: "",
  };
}

export function getViewWinningRequest(body = {}) {
  return {
    request: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
    modalOpen: false,
    data: [],
    marketId: "",
    isRefresh: true
  };
}

export function getViewWinningHistory(body = {}) {
  return {
    history: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 20,
    name: "",
    totalData: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
    openRowIndex: null
  };
}
export function getSubAdminWinResult(body = {}) {
  return {
    // history: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 20,
    totalData: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
    openRowIndex: null
  };
}
export function getViewSubadmin(body = {}) {
  return {
    data: [],
    currentPage: 1,
    totalPages: 1,
    totalEntries: 10,
    name: "",
    totalData: 0,
    searchTerm: "",
    debouncedSearchTerm: "",
  };
}

