// export const customErrorHandler = (error) => {
//     let errorMessage = ''
//     if (error?.response?.data?.message) {
//         errorMessage = error?.response?.data?.message
//     } else if (error?.response?.data?.errMessage) {
//         errorMessage = error?.response?.data?.errMessage
//         if (error?.response?.data?.responseCode === 401) {
//             window.location.href = '/'
//             sessionStorage.removeItem("user");
//             sessionStorage.removeItem("role");
//         }
//     } else {
//         errorMessage = "something went wrong"
//     }
//     return errorMessage
// }


export const customErrorHandler = (error) => {
    const data = error?.response?.data;
    const errorMessage = data?.message || data?.errMessage || "Something went wrong";

    // Handle token mismatch or 401 unauthorized
    if (data?.responseCode === 401 || data?.errMessage === "Token mismatch. Unauthorized access.") {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("role");
        window.location.href = '/';
        return null; // Prevent further error processing
    }

    return errorMessage;
}