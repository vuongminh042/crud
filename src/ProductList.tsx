import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios";
import { Link } from "react-router-dom"

type TProduct = {
    id?: number,
    name: string,
    price: number,
    image: string,
    description: string,
}

const ProductList = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await axios.get(` http://localhost:3000/products`);
            return response.data
        }
    });

    const mutation = useMutation({
        mutationFn: async(id:number) => {
            const confirm = window.confirm('Do you want delete ?');
            if(confirm) {
                await axios.delete(`http://localhost:3000/products/${id}`);
                alert('Delete Successful')
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['products']
            })
        },
        onError: (error) => {
            alert('Delete Failed' + error.message);
        }
    })

    return (
        <div className="container my-5">
            <Link to="/signup" className="btn btn-danger">Signup</Link>
            <h2>Product List</h2>
            <Link to="/products/add" className="btn btn-primary">Add</Link>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Image</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((product: TProduct, index: number) => {
                        return (
                            <tr key={index}>
                                <td scope="col">{index + 1}</td>
                                <td scope="col">{product.name}</td>
                                <td scope="col">{product.price}</td>
                                <td scope="col">
                                    <img src={product.image} alt={product.name} width={70} />
                                </td>
                                <td scope="col">{product.description}</td>
                                <td scope="col">
                                    <Link to={`/products/${product.id}/edit`} className="btn btn-primary">Update</Link>
                                    <button className="btn btn-danger" onClick={() => mutation.mutate(product.id!)}>Delete</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

        </div>
    )
}

export default ProductList
