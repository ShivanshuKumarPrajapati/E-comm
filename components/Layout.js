import React, {useContext, useState, useEffect} from "react";
import Head from "next/head";
import Link from "next/link";

import { Store } from "../utils/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import Cookies from "js-cookie";

const Layout = ({ title, children }) => {

    const { state,dispatch} = useContext(Store);
    const { cartItems } = state.cart;
    const [cartItemsCount,setCartItemsCount] = useState(0);
    
    const {status, data:session} = useSession();

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    
    }

  useEffect(() => {
      setCartItemsCount(cartItems.reduce((a, c) => a + c.quantity, 0))
    },[cartItems])

    return (
      <>
        <Head>
          <title>{title ? title + " - Amazona" : "Amazona"}</title>
          <meta name="description" content="Ecommerce website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <ToastContainer position="bottom-center" limit={1} />
        <div className="flex min-h-screen flex-col justify-between">
          <header>
            <nav className="flex h-12 items-center px-4 justify-between shadow-md">
              <Link href="/" className="text-lg font-bold">
                amazona
              </Link>
              <div>
                <Link href="/cart" className="p-2">
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-sm font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                {status === "loading" ? (
                  "Loading..."
                ) : session?.user ? (
                  <Menu as="div" className="relative inline-block">
                    <Menu.Button className="p-2 text-blue-600">
                      {session.user.name}
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 w-56 origin-right-top bg-white shadow-lg">
                        <Menu.Item>
                          <DropdownLink className="dropdown-link" href='/profile'>
                          Profile
                          </DropdownLink>
                        </Menu.Item>  
                        <Menu.Item>
                          <DropdownLink className="dropdown-link" href='/order-history'>
                            Order History
                          </DropdownLink>
                        </Menu.Item>
                        <Menu.Item>
                          <Link href="/api/auth/signout" onClick={logoutClickHandler} className="dropdown-link">
                            Logout
                          </Link>
                        </Menu.Item>
                      </Menu.Items>
                  </Menu>
                ) : (
                  <Link href="/login" className="p-2">
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </header>
          <main className="container m-auto mt-4 px-4">{children}</main>
          <footer className="flex h-10 justify-center items-center shadow-inner">
            <p>Copyright &copy; 2023 Amazona</p>
          </footer>
        </div>
      </>
    );
}
export default Layout;
