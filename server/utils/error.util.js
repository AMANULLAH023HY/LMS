class AppErorr extends Error{
    constructor(message,statusCode){
        super(message);

        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.statusCode);
    }
};


export default AppErorr;