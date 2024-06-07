import { Hono } from "hono";
import { renderer } from "./renderer";

type Bindings = {
	MY_VAR: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(renderer);

app.get("/", (c) => {
	return c.render(<h1>{c.env.MY_VAR}</h1>);
});

export default app;
