import { Outlet } from "react-router"; // 只保留 Outlet 来渲染子路由内容
import { Meta, Links, ScrollRestoration, Scripts } from "react-router"; // 保持其余功能

// 自定义的布局组件
export default function AuthLayout() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* 子路由内容：登录或注册页面 */}
        <main style={{ padding: "20px" }}>
          <Outlet /> {/* 子组件会通过 Outlet 渲染 */}
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
