import { AnimatePresence, motion } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

// import your pages
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import BlogTitles from "./pages/BlogTitles";
import GenerateImages from "./pages/GenerateImages";
import ImageGeneration from "./pages/ImageGeneration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";


// ...other pages

const page = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: "easeOut" },
};

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/ai"
          element={
            <motion.div {...page}>
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path="/ai/write-article"
          element={
            <motion.div {...page}>
              <WriteArticle />
            </motion.div>
          }
        />
        <Route
          path="/ai/blog-titles"
          element={
            <motion.div {...page}>
              <BlogTitles />
            </motion.div>
          }
        />
        <Route
          path="/ai/generate-images"
          element={
            <motion.div {...page}>
              <GenerateImages />
            </motion.div>
          }
        />
        <Route
          path="/ai/image-generation"
          element={
            <motion.div {...page}>
              <ImageGeneration />
            </motion.div>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <motion.div {...page}>
              <AdminDashboard />
            </motion.div>
          }
        />
        <Route
          path="/admin/panel"
          element={
            <motion.div {...page}>
              <AdminPanel />
            </motion.div>
          }
        />

        {/* add other routes same way */}
      </Routes>
    </AnimatePresence>
  );
}
