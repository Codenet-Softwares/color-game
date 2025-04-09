export const customErrorHandler = (error) => {
    let errorMessage = ''
    if (error?.response?.data?.message) {
        errorMessage = error?.response?.data?.message
    } else if (error?.response?.data?.errMessage) {
        errorMessage = error?.response?.data?.errMessage
        if (error?.response?.data?.responseCode === 401) {
            window.location.href = '/'
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("role");
        }
    } else {
        errorMessage = "something went wrong"
    }
    return errorMessage
}