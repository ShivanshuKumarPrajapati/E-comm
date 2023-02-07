import React from 'react'
import Layout from '../components/Layout'
import CheckoutWizard from '../components/CheckoutWizard';
import { useState, useEffect, useContext } from "react";
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import  Cookies  from 'js-cookie';

const PaymentScreen = () => {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart; 

  const submitHandler = (e) => {
    console.log('submitHandler')
    e.preventDefault();

    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    
    Cookies.set('cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push('/placeorder');
  }

   useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    }
  
    setSelectedPaymentMethod(paymentMethod || '');
  }, [paymentMethod, router, shippingAddress.address]);


  return (
    <Layout title='Payment Method'>
      <CheckoutWizard activeStep={ 2 } />
      <form  className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {
          ['Paypal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div key={ payment } className="flex items-center mb-4">
              <input
                type="radio"
                id={ payment }
                name="paymentMethod"
                required
                checked={ payment === selectedPaymentMethod }
                onChange={ () => setSelectedPaymentMethod(payment) }
              />
              <label htmlFor={ payment } className="ml-2 text-sm">
                { payment }
              </label>
            </div>
          ))
        }
        <div className="mb-4 flex justify-between">
          <button
            className="default-button"
            type='button'
            onClick={ () => router.push('/shipping') }>
          Back
          </button>
          <button className="primary-button">Next </button>
        </div>
          
      </form>
    </Layout>
  )
}

PaymentScreen.auth = true;

export default PaymentScreen;