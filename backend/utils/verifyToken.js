

export const verifyToken = (authHeader) => {
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return (401, "")
    jwt.verify(token, SECRET_KEY, (err, user) => {
        return (err, user)
    });
}