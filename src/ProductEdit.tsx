import Joi from "joi"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

type FormData = {
    id?:number,
    name: string,
    price: number, 
    image: string,
    description: string
}

const productSchema = Joi.object({
    id: Joi.number(),
    name: Joi.string().min(3).required(),
    price: Joi.number().min(0).positive().required(),
    image: Joi.string(),
    description: Joi.string()
})

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate()
    const { register, handleSubmit, reset } = useForm<FormData>({
        resolver: joiResolver(productSchema),
        defaultValues: {
            name: "",
            price: 0,
            image: "",
            description: ""
        }
    })

    useQuery({
            queryKey: ['products', id],
            queryFn: async() => {
                const response = await axios.get(`http://localhost:3000/products/${id}`);
                reset(response.data)
                return response.data
            }
    })

    const mutation = useMutation({
        mutationFn: async(formData: FormData) => {
            const response = await axios.put(`http://localhost:3000/products/${formData.id}`, formData);
            return response.data
        },
        onSuccess: () => {
            alert('Update Successful');
            navigate('/products')
        },
        onError: (error) => {
            alert('Update Failed' + error.message);
        }
    })

    const onSubmit = (formData:FormData) => {
        mutation.mutate(formData)
    }

    return (
        <div className="container my-5">
            <h2>Product Update</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" {...register('name')} />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" {...register('price')} />
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

export default ProductEdit
