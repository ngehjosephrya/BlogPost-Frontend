import { type RouteConfig,route, layout, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),

    layout("../src/components/ProtectedRoute.tsx", [
        // route("dashboard",          "routes/dashboard.tsx"),
        route("posts/new",           "routes/posts/new.tsx"),
        // route("posts/:id/edit",     "routes/posts/edit.tsx"),
        // route("profile/:id",        "routes/profile.tsx"),

    ])
] satisfies RouteConfig;
