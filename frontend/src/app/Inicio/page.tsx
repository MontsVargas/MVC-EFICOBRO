"use client";

import { motion } from "framer-motion";

export default function Inicio() {
  const texto = "BIENVENIDO".split(""); 

  return (
    <main className="relative flex-grow p-6 bg-white flex justify-center items-center min-h-screen overflow-hidden">
      {/* Texto animado */}
      <motion.div
        className="text-center text-4xl font-bold text-blue-800 flex space-x-1 z-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {texto.map((letra, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {letra}
          </motion.span>
        ))}
      </motion.div>
    </main>
  );
}
