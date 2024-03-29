import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from 'bcryptjs';

const handler = async (req, res) => {
    if (req.method != 'POST')
        return;
    
    const data = JSON.parse(req.body);
    const { name, email, password } = data;

    if (!name || !email ||
        !email.includes('@')
        || !password ||
        password.trim().length < 5) {
        res.status(422).json({ message: 'Validation error' });
        return;
    }

    await db.connect();

    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
        res.status(422).json({ message: 'User already exists' });
        db.disconnect();
        return;
    }

    const newUser = new User({
        name,
        email,
        password: bcrypt.hashSync(password),
        isAdmin: false
    });

    const user = await newUser.save(); 

    await db.disconnect();

    res.status(201).send({
        message: 'User created',
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin

    });

}
    
export default handler;