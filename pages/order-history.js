import Link from 'next/link';
import React,{useEffect} from 'react'
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { useReducer } from 'react';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, orders: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

const OrderHistoryScreen = () => {

    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        orders: [],
        error: ''
    });

    useEffect(() => {
        const fetchOrder = async() => {
            try {
                dispatch({type:'FETCH_REQUEST'});
                const res  = await fetch('/api/orders/history');
                const data = await res.json();
                await dispatch({ type: "FETCH_SUCCESS", payload: data.orders });
            }
            catch(err){
                dispatch({type: 'FETCH_FAIL',payload:getError(err)})
            }
        }
        fetchOrder();
    },[]);

  return (
    <Layout title="Order History">
      <h1 className="mb-4 text-xl">Order History</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
          ) : orders.length === 0 ? (
              <div className="alert-error">No Order History Found</div>
          ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b">
              <tr>
                <th className="px-5 text-left">ID</th>
                <th className="p-5 text-left">DATE</th>
                <th className="p-5 text-left">TOTAL</th>
                <th className="p-5 text-left">PAID</th>
                <th className="p-5 text-left">DELIVERED</th>
                <th className="p-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b">
                  <td className=" p-5 ">{order._id.substring(20, 24)}</td>
                  <td className=" p-5 ">{order.createdAt.substring(0, 10)}</td>
                  <td className=" p-5 ">${order.totalPrice}</td>
                  <td className=" p-5 ">
                    {order.isPaid
                      ? `${order.paidAt.substring(0, 10)}`
                      : "not paid"}
                  </td>
                  <td className=" p-5 ">
                    {order.isDelivered
                      ? `${order.deliveredAt.substring(0, 10)}`
                      : "not delivered"}
                  </td>
                  <td className=" p-5 ">
                    <Link href={`/order/${order._id}`} passHref>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen