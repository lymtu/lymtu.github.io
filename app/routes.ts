import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const loadRoutes = async () => {
  const allRoutes = await flatRoutes();

  return process.env.NODE_ENV === "production"
    ? allRoutes.filter((route) => !route.id?.startsWith("routes/admin"))
    : allRoutes;
};

export default loadRoutes() satisfies RouteConfig;