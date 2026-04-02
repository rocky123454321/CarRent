import { motion } from "framer-motion";

const LoadingSpinner = () => {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 relative overflow-hidden">

			{/* Blue glow */}
			<div className="absolute w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

			{/* Glass card */}
			<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-10 flex flex-col items-center gap-6 shadow-2xl">

				{/* Spinner */}
				<motion.div
					className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full"
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				/>

				{/* Text */}
				<motion.p
					className="text-white/80 text-sm tracking-wide"
					initial={{ opacity: 0 }}
					animate={{ opacity: [0.3, 1, 0.3] }}
					transition={{ duration: 1.5, repeat: Infinity }}
				>
					Loading, please wait...
				</motion.p>

			</div>
		</div>
	);
};

export default LoadingSpinner;