import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"

type FormData = {
    name: string,
    price: number, 
    image: string,
    description: string
}

const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).positive().required(),
    image: Joi.string(),
    description: Joi.string()
})

const ProductAdd = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: joiResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            image: "",
            description: ""
        }
    })

    const mutation = useMutation({
        mutationFn: async(formData: FormData) => {
            const response = await axios.post(`http://localhost:3000/products`, formData);
            return response.data
        },
        onSuccess: () => {
            alert('Add Successful');
            navigate('/products')
        },
        onError: (error) => {
            alert('Add Failed' + error.message);
        }
    })

    const onSubmit = (formData:FormData) => {
        mutation.mutate(formData)
    }

    return (
        <div className="container my-5">
            <h2>Product Add</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" {...register('name', { required: true, minLength: 3 })} />
                    {errors?.name && (<div id="name" className="form-text text-danger">{errors?.name?.message}</div>)}
                </div>
                
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" {...register('price', { required: true })} />
                    {errors?.price && (<div id="price" className="form-text text-danger">{errors?.price?.message}</div>)}
                </div>

                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input type="text" className="form-control" id="image" {...register('image')} />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea id="description" cols={30} rows={10} className="form-control" {...register('description')} />

                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default ProductAdd
