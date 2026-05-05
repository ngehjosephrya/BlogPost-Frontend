import { type RouteConfig,route, layout, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    // route("sign-in", "routes/sign-in.tsx"),
    // route("sign-up", "routes/sign-up.tsx"),

    layout("components/ProtectedRoute.tsx", [
        // route("dashboard",          "routes/dashboard.tsx"),
        // route("post/new",           "routes/posts/new.tsx"),
        // route("posts/:id/edit",     "routes/posts/edit.tsx"),
        // route("profile/:id",        "routes/profile.tsx"),

    ])
] satisfies RouteConfig;
