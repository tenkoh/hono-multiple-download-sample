import { Hono } from "hono";
import { html } from "hono/html";

const app = new Hono();

const zipLink: string = "https://hono-multiple-download-sample.pages.dev/static/image000.png.zip";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Layout = (props: { title: string; script: any; children: any;}) => html`<!DOCTYPE html>
  <html lang="ja">
    <head>
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css" />
      ${props.script}
      <title>${props.title}</title>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`;

// see: https://zenn.dev/yusukebe/articles/c9bc1aa389cbd7
app.get("/", async (c) => {
	const props = {
		title: "Hello, Hono",
		script: html`<script>console.info('script loaded');</script>`,
    children: <h1>Top</h1>,
	};
	return c.html(<Layout {...props} />);
});

app.get("/use-anchor", async (c) => {
	const props = {
		title: "use anchor sample",
		script: html`<script>
      function execute() {
        const anchor = document.createElement('a');
        for (let i = 0; i < 1; i++) {
          anchor.id = "download-anchor-" + i;
          anchor.href = "${zipLink}";
          anchor.download = '';
          document.body.appendChild(anchor);
          anchor.click();
          URL.revokeObjectURL(anchor.href);
          document.body.removeChild(anchor);
        }
      }
    </script>`,
    children: <button type="button" onclick="execute()">Download</button>,
	};
	return c.html(<Layout {...props} />);
});

export default app;
