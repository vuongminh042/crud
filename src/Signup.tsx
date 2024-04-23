import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type FormData = {
    name: string,
    email: string, 
    password: string,
    confirmPassword: string
}

const signupSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email({ tlds: {allow: false} }).required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')),
})

const Signup = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: joiResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const mutation = useMutation({
        mutationFn: async(formData: FormData) => {
            const response = await axios.post(`http://localhost:3000/signup`, formData);
            return response.data
        },
        onSuccess: () => {
            alert('Signup Successful');
            navigate('/signin')
        },
        onError: (error) => {
            alert('Signup Failed' + error.message);
        }
    })

    const onSubmit = (formData:FormData) => {
        mutation.mutate(formData)
    }

    return (
        <div className="container my-5">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" {...register('name', { required: true, minLength: 3 })} />
                    {errors?.name && (<div id="name" className="form-text text-danger">{errors?.name?.message}</div>)}
                </div>
                
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

                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">confirmPassword</label>
                    <input type="password" className="form-control" id="confirmPassword" {...register('confirmPassword')} />
                    {errors?.confirmPassword && (<div id="confirmPassword" className="form-text text-danger">{errors?.confirmPassword?.message}</div>)}
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default Signup
