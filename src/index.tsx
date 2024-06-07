import { Hono } from "hono";
import { renderer } from "./renderer";

type Bindings = {
	MY_VAR: string;
  MY_KV: KVNamespace;
  IMG_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// app.use(renderer);

app.get("/", async (c) => {
	// return c.render(<h1>{c.env.MY_VAR}</h1>);
	const object = await c.env.IMG_BUCKET.get("image000.png");
	if (!object) return c.notFound();
	const data = await object.arrayBuffer();
	const contentType = object.httpMetadata?.contentType ?? "";

	return c.body(data, 200, {
		"Content-Type": contentType,
	});
  // await c.env.MY_KV.put("hello", "world");
  // const name = await c.env.MY_KV.get("hello");
  // return c.render(<h1>{name}</h1>);
});

export default app;
