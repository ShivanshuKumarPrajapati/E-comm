import { getSession } from "next-auth/react";

const handler = async (req, res) => {
    const session = await getSession({ req });

    if (!session)
        return res.status(401).send('signin required');

    res.json(process.env.PAYPAL_CLIENT_ID || 'sb');
    res.send();
}

export default handler;