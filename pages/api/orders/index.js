import { getSession } from "next-auth/react";
import Order from "../../../models/Order";
import db from "../../../utils/db";

const handler = async(req,  res) => {

    const session = await getSession({ req });
    
    if(!session)
    return res.status(400).send('SignIn required');
    const userId = session._id;

    await db .connect();

    const data =  req.body;
    const newItem = JSON.parse(data);

    const newOrder = new Order({
        ...newItem,
        user : userId
    });
    
    const order = await newOrder.save();
    res.status(201).send(order);

};

export default handler;