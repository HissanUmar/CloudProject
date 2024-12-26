import jwt from 'jsonwebtoken'  // export for web token which is used for authentication for further routes
//  const JWT_secret = " " // add your secret here
const fetchuser = async (req, res, next) => {


    console.log("fetching userID");
    const auth_token = req.header("auth_token");
    const response = await fetch('http://localhost:8080/get-username',{
    method: 'GET',
    headers: {
    'auth_token': auth_token ? `${auth_token}` : '', // Attach the token in Authorization header
    'Content-Type': 'application/json', // Optional, depending on the server's expected content type
    }
    });

    const data = await response.json();
    const userId = data.userId;

    if(!userId){
        res.status(400).json({error: 'User id not found in the database.'});
    }
    req.userId = userId;
    next();
}

export default fetchuser;