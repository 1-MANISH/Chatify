import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {

        const jwt_Secret = process.env.JWT_SECRET;
        const node_env = process.env.NODE_ENV;

        if(!jwt_Secret){
                throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
                {userId},
                jwt_Secret,
                {expiresIn:'7d'}
        )

        res.cookie(
                'chatify_jwt_token',
                token,
                {
                        maxAge:7*24*60*60*1000 ,// 7days
                        httpOnly:true, // prevent XSS attacks - cross site scripting
                        sameSite:node_env === 'development' ? 'lax' : 'strict', // CSRF protection
                        secure:node_env === 'development' ? false : true,
                }
        )
        return token
}

// dev : http://localhost:3000
// prod : https://chatify.com