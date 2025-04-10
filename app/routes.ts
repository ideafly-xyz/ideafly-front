import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
  } from "@react-router/dev/routes";
  
  export default [
    index("./routes/home.tsx"),
    route("about", "./routes/about.tsx"),

    route("mind", "./routes/mind.tsx"),

    route("weChatRedire","./routes/weChatRedire.tsx"),
  
    layout("./routes/auth/layout.tsx", [
      route("login", "./routes/auth/login.tsx"),
      route("signup", "./routes/auth/signup.tsx"),
    ]),
  
    ...prefix("concerts", [
      route(":city", "./routes/concerts/city.tsx"),
      route(":city/:id", "./routes/concerts/show.tsx"),
      route("trending", "./routes/concerts/trending.tsx"),
    ]),
  ] satisfies RouteConfig;