import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type FormData = {
    email: string, 
    password: string,
}

const signinSchema = Joi.object({
    email: Joi.string().email({ tlds: {allow: false} }).required(),
    password: Joi.string().min(6).required(),
})

const Signin = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: joiResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const mutation = useMutation({
        mutationFn: async(formData: FormData) => {
            const response = await axios.post(`http://localhost:3000/signin`, formData);
            return response.data
        },
        onSuccess: () => {
            alert('Signin Successful');
            navigate('/products')
        },
        onError: (error) => {
            alert('Signin Failed' + error.message);
        }
    })

    const onSubmit = (formData:FormData) => {
        mutation.mutate(formData)
    }

    return (
        <div className="container my-5">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit(onSubmit)}>                
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">email</label>
                    <input type="email" className="form-control" id="email" {...register('email', { required: true })} />
                    {errors?.email && (<div id="email" className="form-text text-danger">{errors?.email?.message}</div>)}
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">password</label>
                    <input type="password" className="form-control" id="password" {...register('password', { required: true })} />
                    {errors?.password && (<div id="password" className="form-text text-danger">{errors?.password?.message}</div>)}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default Signin
