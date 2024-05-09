import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode,sign,verify } from "hono/jwt";


const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL: string,
        JWT_SECRET:string
    },
    Variables:{
        userId:String
    }
}>();

userRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    try {
        const user = await prisma.user.create({
            data:{
                email : body.email,
                password : body.password,
            }
        })
    
        const token = await sign({id:user.id},c.env.JWT_SECRET)
        return c.json({
            jwt:token
        })
    } catch (error) {
        c.status(403);
        return c.json({error:"error while signing up"})
    }
})

userRouter.post('/signin',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const user = await prisma.user.findUnique({
        where:{
            email:body.email,
        }
    });
    console.log(body.email)
   
    if(!user){
        c.status(403);
        return c.json({
            error:"Not a valid User"
        })
    }
    const jwt = await sign({id:user.id},c.env.JWT_SECRET)
    return c.json({
        jwt:jwt
    });
})

export default userRouter;