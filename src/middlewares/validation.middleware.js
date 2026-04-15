import { BadRequestError } from "../utils/Error/exceptions.js"



const validate = (schema)=>{
    return (req,res,next)=>{
        const validationErrors=[]
        for (const key in schema) {
            const {error,value} = schema[key].validate(req[key],{
                abortEarly:false,
                errors:{wrap:{label:''}}
            })
            if (error) {
                validationErrors.push(
                    ...error.details.map(({message,path})=>{
                        const fieldPath = path?.length ? `.${path.join(".")}` : "";
                        return `${key}${fieldPath}: ${message}`;
                    })
                );
                continue;
            }
            req[key]=value;
            
        }
        if (validationErrors.length) {
            throw new BadRequestError('Validation Error',validationErrors);
        }
        next()
    }
}

export default validate;
