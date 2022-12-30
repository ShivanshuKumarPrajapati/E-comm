import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image';
import Link  from 'next/link';

import Layout from '../../components/Layout'
import data from '../../utils/data';

function ProductScreen() {
    const { query } = useRouter();
    const { slug } = query;
    const product = data.products.find((a) => a.slug === slug);
    if (!product) {
        return <div>Product Not Found</div>;
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
            height={640}
            layout="responsive"
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
                      <button className="primary-button w-full">Add to cart</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductScreen