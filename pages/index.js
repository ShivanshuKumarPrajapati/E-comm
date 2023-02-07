import Layout from '../components/Layout'
import data from '../utils/data'
import ProductItem from '../components/ProductItem'
import db from '../utils/db';
import Product from '../models/Product';
import { Store } from '../utils/Store';
import { useContext } from 'react';
import { toast } from 'react-toastify';

export default function Home({ products }) {
  
    const {state,dispatch} = useContext(Store);
  const { cart } = state;

   const addToCartHandler = async(product) => {
        const existItem = cart.cartItems.find((x) => x.slug === product.slug);
        const quantity = existItem ? existItem.quantity + 1 : 1;
      
        const res = await fetch(`/api/products/${product._id}`);
      
        const data = await res.json();
     
        if (data.countInStock < quantity) {
        toast.error('Sorry. Product is out of stock');
          return;
        }

     dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
     
     toast.success('Product added to cart');
    }

  
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem product={product} key={product.slug} addToCartHandler={addToCartHandler} />
        ))}
      </div>
    </Layout>
  );
}


export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}