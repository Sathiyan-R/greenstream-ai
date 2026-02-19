import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export const MapSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden relative">
      {/* Skeleton map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
        {/* Animated pulse circles simulating zones */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10 border border-blue-500/20"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              width: `${Math.random() * 100 + 80}px`,
              height: `${Math.random() * 100 + 80}px`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Center loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="p-6 bg-gray-800/90 border-gray-700 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <motion.div
                className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="space-y-2">
                <motion.div
                  className="h-3 w-48 bg-gray-700 rounded"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="h-2 w-32 bg-gray-700 rounded mx-auto"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-400 animate-pulse">
                Loading environmental data...
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
