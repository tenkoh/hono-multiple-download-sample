import { Hono } from "hono";
import { html } from "hono/html";

type Bindings = {
	ZIP_LINK: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const downloadNum: number = 2;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const Layout = (props: { title: string; script: any; children: any }) => html`<!DOCTYPE html>
  <html lang="ja">
    <head>
      <link rel="stylesheet" href="https://fonts.xz.style/serve/inter.css" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css" />
      ${props.script}
      <title>${props.title}</title>
    </head>
    <body>
      <header>
        <h1>${props.title}</h1>
      </header>
      ${props.children}
    </body>
  </html>`;

const downlodButton = (
	<>
		<main>
			<button type="button" onclick="download();">
				Download {downloadNum} files
			</button>
		</main>
		<footer style="margin-top:20px;">
			<a href="/">Back to top</a>
		</footer>
	</>
);

app.get("/", async (c) => {
	const props = {
		title: "multiple download samples",
		script: html`<script></script>`,
		children: (
			<ul>
				<li>
					<a href="/use-anchor">use anchor</a>
				</li>
				<li>
					<a href="/use-anchor-without-remove">use anchor (without removing it)</a>
				</li>
				<li>
					<a href="/use-anchor-with-wait">use anchor with wait</a>
				</li>
				<li>
					<a href="/use-iframe">use iframe</a>
				</li>
			</ul>
		),
	};
	return c.html(<Layout {...props} />);
});

app.get("/use-anchor", async (c) => {
	const props = {
		title: "use anchor sample",
		children: downlodButton,
		script: html`<script>
      function download() {
        for (let i = 0; i < ${downloadNum}; i++) {
          const anchor = document.createElement('a');
          anchor.id = "download-anchor-" + i;
          anchor.href = "${c.env.ZIP_LINK}";
          anchor.download = '';
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          URL.revokeObjectURL(anchor.href);
          document.body.removeChild(anchor);
        }
      }
    </script>`,
	};
	return c.html(<Layout {...props} />);
});

app.get("/use-anchor-without-remove", async (c) => {
	const props = {
		title: "use anchor (without removing it) sample",
		children: downlodButton,
		script: html`<script>
      function download() {
        // idがdownload-anchorから始まる要素があれば削除する
        const oldAnchors = document.querySelectorAll('a.download-anchor');
        oldAnchors.forEach((a) => a.remove());

        for (let i = 0; i < ${downloadNum}; i++) {
          const anchor = document.createElement('a');
          anchor.id = "download-anchor-" + i;
          anchor.class = "download-anchor";
          anchor.href = "${c.env.ZIP_LINK}";
          anchor.download = '';
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          anchor.click();
          URL.revokeObjectURL(anchor.href);
        }
      }
    </script>`,
	};
	return c.html(<Layout {...props} />);
});

app.get("/use-anchor-with-wait", async (c) => {
	const props = {
		title: "use anchor with wait sample",
		children: downlodButton,
		script: html`<script>
      function download() {
        for (let i = 0; i < ${downloadNum}; i++) {
          const anchor = document.createElement('a');
          anchor.id = "download-anchor-" + i;
          anchor.href = "${c.env.ZIP_LINK}";
          anchor.download = '';
          anchor.style.display = 'none';
          document.body.appendChild(anchor);
          // 1秒間隔をあけてダウンロードする
          setTimeout(() => {
            anchor.click();
            URL.revokeObjectURL(anchor.href);
            document.body.removeChild(anchor);
          }, i*1000);
        }
      }
    </script>`,
	};
	return c.html(<Layout {...props} />);
});

app.get("/use-iframe", async (c) => {
	const props = {
		title: "use iframe sample",
		children: downlodButton,
		script: html`<script>
      function download() {
        // idがdownload-anchorから始まる要素があれば削除する
        const oldIframes = document.querySelectorAll('iframe');
        oldIframes.forEach((i) => i.remove());

        for (let i = 0; i < ${downloadNum}; i++) {
          const iframe = document.createElement('iframe');
          iframe.id = "download-inframe-" + i;
          iframe.src = "${c.env.ZIP_LINK}";
          iframe.style.display = 'none';
          iframe.sandbox = 'allow-downloads';
          document.body.appendChild(iframe);
        }
      }
    </script>`,
	};
	return c.html(<Layout {...props} />);
});
export default app;
