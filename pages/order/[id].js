import { useRouter } from 'next/router';
import React, { useReducer } from 'react'
import Layout from '../../components/Layout';
import { useEffect } from 'react';
import { getError } from '../../utils/error';
import Image from 'next/image';
import Link from 'next/link';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
           return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
          return { ...state, loadingPay: false, errorPay: action.payload };
        case 'PAY_RESET':
          return { ...state, successPay: false, loadingPay:false, errorPay: '' };
        default:
            return state;
    }
}


const OrderScreen = () => {
  
    const [{isPending},paypalDispatch] = usePayPalScriptReducer();

    const {query} = useRouter(); 
    const orderId = query.id;
    const [{
        loading, error, order , successPay, loadingPay
    }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        order: {}
    });
    
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const res = await fetch(`/api/orders/${orderId}`);
              const data = await res.json();
              
                dispatch({ type: 'FETCH_SUCCESS', payload: data });   
            }
            catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
            }
        }

      if (!order._id || successPay || (order._id && order._id !== orderId)) {
        fetchOrder();
        
        if (successPay) {
          dispatch({ type: "PAY_RESET" });
        }
      }
      else {
        const loadPaypalScript = async () => {
          const res = await fetch('/api/keys/paypal');
          const clientId = await res.json();
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'client-id': clientId,
              currency: 'USD',
            },
          });
          paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
        }
        loadPaypalScript();
      }

    }, [orderId, order, paypalDispatch, successPay]);

     const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
     } = order;
    

  function createOrder(data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: totalPrice,
          },
        },
      ],
    }).then((orderID) => {
      return orderID;
    });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async (details) => {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const res = await fetch(`/api/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(details),
        });

        const data = await res.json();
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Payment successful');
      }
      catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }



  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-lg font-bold">{`Order ID: ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Paid at {paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card overflow-x-auto p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="    p-5 text-right">Quantity</th>
                    <th className="  p-5 text-right">Price</th>
                    <th className="p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`} className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card  p-5">
              <h2 className="mb-2 text-lg">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>{" "}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                    </li>
                    { !isPaid && (
                      <li>
                        {
                          isPending ? (
                            <div>Loading...</div>
                          ) :
                            (
                              <div className='w-full mt-5'>
                                <PayPalButtons
                                  createOrder={ createOrder }
                                  onApprove={ onApprove }
                                  onError={ onError }
                                >
                                  </PayPalButtons>
                              </div>
                            )
                        }
                        {loadingPay && <div>Loading...</div>} 
                      </li>
                    )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default OrderScreen