import jwt from 'jsonwebtoken'  // export for web token which is used for authentication for further routes
//  const JWT_secret = " " // add your secret here
const fetchuser = (req, res, next) => {

    const token = req.header("auth_token");
    console.log(token);
    if (!token) {
        console.log("no token");
        return res.status(401).send({ error: "Please authentictate by providing the token" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('date: ',data.user.id);
        
        req.userid = data.user.id;        

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).send({ error: "Please authentictate by providing the valid token" });
    }

}

export default fetchuser;