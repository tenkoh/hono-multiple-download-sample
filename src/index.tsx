import { Hono } from "hono";
import { renderer } from "./renderer";

type Bindings = {
  IMG_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// app.use(renderer);

app.get("/", async (c) => {
	const object = await c.env.IMG_BUCKET.get("image000.png");
	if (!object) return c.notFound();
	const data = await object.arrayBuffer();
	const contentType = object.httpMetadata?.contentType ?? "";

	return c.body(data, 200, {
		"Content-Type": contentType,
	});
});

export default app;
