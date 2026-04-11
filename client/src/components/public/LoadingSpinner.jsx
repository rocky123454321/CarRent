import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-500">
            
            {/* Minimalist Spinner Container */}
            <div className="relative flex items-center justify-center">
                
                {/* Outer static ring - subtle hint of the track */}
                <div className="w-10 h-10 rounded-full border-[1.2px] border-zinc-100 dark:border-zinc-900" />
                
                {/* Active spinning arc - Pure Black in Light, Pure White in Dark */}
                <motion.div
                    className="absolute w-10 h-10 rounded-full border-[1.2px] border-t-zinc-900 dark:border-t-white border-r-transparent border-b-transparent border-l-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Typography Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-col items-center gap-3"
            >
                <p className="text-zinc-900 dark:text-zinc-100 font-bold text-[9px] uppercase tracking-[0.4em] antialiased">
                    Processing
                </p>
                
                {/* Minimalist Progress Line instead of dots */}
                <div className="h-[1px] w-8 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <motion.div 
                        className="h-full bg-zinc-900 dark:bg-white w-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;