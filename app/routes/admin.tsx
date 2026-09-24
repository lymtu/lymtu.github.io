import { Link, NavLink, Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="mt-(--header-height) mx-auto w-full md:w-2xl lg:w-3xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <nav className="flex items-center gap-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              "cursor-pointer " +
              (isActive ? "text-blue-500 font-bold" : "hover:underline")
            }
          >
            文章列表
          </NavLink>
          <Link
            to="/admin/add"
            className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-blue-500 text-white cursor-pointer"
          >
            新增文章
          </Link>
        </nav>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}