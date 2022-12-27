import React from "react";
import Head from "next/head";
import Link from "next/link";

const Layout = ({ title, children }) => (
    <>
        <Head>
            <title>{ title ? title + " - Amazona" : "Amazona" }</title>
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
                        <Link href="/cart" className="p-2">Cart</Link>
                        <Link href="/login" className="p-2">Login</Link>
                    </div>
                </nav>
            </header>
            <main className="container m-auto mt-4 px-4">{ children }</main>
            <footer className="flex h-10 justify-center items-center shadow-inner">
                <p>Copyright &copy; 2023 Amazona</p>
            </footer>
        </div>
    </>
);

export default Layout;
