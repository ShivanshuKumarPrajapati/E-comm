import React, {useContext} from "react";
import Head from "next/head";
import Link from "next/link";

import { Store } from "../utils/Store";

const Layout = ({ title, children }) => {

    const { state} = useContext(Store);
    const { cartItems } = state.cart;

    return (
      <>
        <Head>
          <title>{title ? title + " - Amazona" : "Amazona"}</title>
          <meta name="description" content="Ecommerce website" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="flex min-h-screen flex-col justify-between">
          <header>
            <nav className="flex h-12 items-center px-4 justify-between shadow-md">
              <Link href="/" className="text-lg font-bold">
                amazona
              </Link>
              <div>
                <Link href="/cart" className="p-2">
                Cart
                { cartItems.length > 0 && (
                    <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-1 text-sm font-bold">
                        {cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </span>
                ) }
                </Link>
                <Link href="/login" className="p-2">
                  Login
                </Link>
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
