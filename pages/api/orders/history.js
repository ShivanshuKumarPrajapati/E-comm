import { getSession } from 'next-auth/react';
import db from '../../../utils/db';
import Order from '../../../models/Order';

const handler = async (req, res) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({message: 'Error: signIn required'});
    }
    
    const { user } = session;
    await db.connect();
    const orders = await Order.find({ user: user._id });
    await db.disconnect();

    res.status(200).json({ orders }); 
}

export default handler;