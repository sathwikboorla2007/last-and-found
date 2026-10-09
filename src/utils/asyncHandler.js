const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
        //here in place of promise we can use try catch
    }
}


export { asyncHandler }
