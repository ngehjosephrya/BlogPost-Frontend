import { type RouteConfig,route, layout, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("posts/:postId", "routes/posts/$postId.tsx"),

    layout("../src/components/ProtectedRoute.tsx", [
        route("posts/new",           "routes/posts/new.tsx"),
        route("posts/:postId/edit",     "routes/posts/$postId.edit.tsx"),
        route("dashboard",          "routes/dashboard.tsx"),
        route("profile/:id",        "routes/profile.tsx"),

    ]),

    route("*", "routes/404.tsx"),
] satisfies RouteConfig;
