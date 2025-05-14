import { AnimatePresence, motion } from "framer-motion";

interface ModalAnimatedProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
}

export const ModalAnimated = ({ isOpen, setIsOpen, children }: ModalAnimatedProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div className="bg-[#121212] border-[1px] border-[#0065BD] text-white p-6 rounded-lg w-full max-w-md shadow-xl cursor-default relative overflow-hidden">
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
