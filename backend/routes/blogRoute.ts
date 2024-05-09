import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { use } from "hono/jsx";
import { decode,sign,verify } from "hono/jwt";

const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string,
    }
    Variables:{
        userId:string,
    }
}>();

blogRouter.use('/*',async (c,next)=>{
    
    const jwt = c.req.header("authorization");
    if(!jwt){
        c.status(401)
        return c.json({
            error:"Unauthorized"
        })
    }
    const token = jwt.split(" ")[1];    
    const payload = await verify(token,c.env.JWT_SECRET)
    if(!payload){
        c.status(401);
        return c.json({
            error:"Unauthorized"
        })
    }

    c.set('userId',payload.id);
    await next();
})

blogRouter.post('/',async (c)=>{
    const userId = c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    if(!userId){
        c.status(403);
        return c.json({
            error:"Unauthorized"
        })
    }
    const body =await c.req.json();
    const post = await prisma.post.create({
        data:{
            content:body.content,
            title:body.title,
            authorId:userId,
        }
        
    })

    return c.json({
        id:post.id
    })
})

blogRouter.put('/',async (c)=>{
    const userId = c.get('userId');
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const body = await c.req.json();
    prisma.post.update({
        data:{
            content:body.content,
            title:body.title,
        },
        where:{
            id:body.id,
            authorId:userId,
        }
    })

    return c.text("Updated post")
})

blogRouter.get('/bulk',async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

    const post = await prisma.post.findMany({})
    
    return c.json(post)
})

blogRouter.get('/:id',async (c)=>{
    const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    const id = c.req.param('id');

    const post = await prisma.post.findUnique({
        where:{
            id
        }
    })

    return c.json(post)

})

export default blogRouter;