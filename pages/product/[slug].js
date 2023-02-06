import React,{useContext} from 'react'
import Image from 'next/image';
import Link  from 'next/link';

import Layout from '../../components/Layout'
import { Store } from '../../utils/Store';
import Product from '../../models/Product';
import db from '../../utils/db';
import { toast } from 'react-toastify';

function ProductScreen({product}) {
    const { state, dispatch } = useContext(Store);
    
    const addToCartHandler = async(product) => {
        const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;

      const data = await fetch(`/api/products/${product._id}`);
      
        console.log(data);
        console.log('qty ',quantity);
        if (data.countInStock < quantity) {
        toast.error('Sorry. Product is out of stock');
          return;
        }

      dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
      toast.success('Product added to the cart')
    }

    if (!product) {
         return <Layout title="Produt Not Found">Produt Not Found</Layout>;
    }


  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to product</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={ 640 }
                      
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className='text-lg font-bold' >{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand} </li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description} </li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div >Price </div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div >Status</div>
                          <div>
                              { product.countInStock > 0 ? (
                                  <span className="text-success">In Stock</span>
                              ) : (
                                      <span className="text-danger">Unavailable</span>
                                    )
                            }
                          </div>
                      </div>
                      <button className="primary-button w-full" onClick={() => addToCartHandler(product)} >Add to cart</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductScreen

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}