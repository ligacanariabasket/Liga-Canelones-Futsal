'use client';

import { motion } from 'framer-motion';

export function LandingAnimation({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="flex-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
}
