import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            
            {/* Minimalist Spinner */}
            <div className="relative flex items-center justify-center">
                {/* Outer static ring - very faint */}
                <div className="w-12 h-12 rounded-full border-[1.5px] border-white/5" />
                
                {/* Active spinning arc */}
                <motion.div
                    className="absolute w-12 h-12 rounded-full border-[1.5px] border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Typography */}
            <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 flex flex-col items-center gap-1"
            >
                <p className="text-white font-black text-[10px] uppercase tracking-[0.3em]">
                    System Loading
                </p>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 bg-blue-500 rounded-full"
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ 
                                duration: 1, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;