

const requestPart = ["body",'query','params','headers']

const validate = (schema)=>{
    return (req,res,next)=>{
        for (const key in schema) {
            const {error} = schema[key].validate(req[key])
            if (condition) {
                
            }
            
        }
    }
}

export default validate;