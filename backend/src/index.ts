import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode,sign,verify } from "hono/jwt";
import userRouter from "../routes/userRoute";
import blogRouter from "../routes/blogRoute";
import { cors } from "hono/cors";

const app = new Hono<{
    Bindings:{
        DATABASE_URL: string
    },
    Variables:{
        userId:String
    }
}>();

app.use('/*',cors())

app.route('/api/v1/user',userRouter);
app.route('/api/v1/blog',blogRouter)


export default app;