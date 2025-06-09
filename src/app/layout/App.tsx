import { useLocation } from "react-router";
import Navbar from "./nav/Navbar";
import { AnimatePresence, motion } from "motion/react";
import AnimatedOutlet from "../router/AnimatedOutlet";
import AuthModal from "../../features/account/AuthModal";

function App() {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-10 mt-24">
        <AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 0, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <AnimatedOutlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <AuthModal />
    </div>
  );
}

export default App;
