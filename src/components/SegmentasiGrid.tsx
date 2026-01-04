import { motion } from "framer-motion";

export default function SegmentasiGrid({ result }: { result: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full mb-6"
    >
      <div className="flex flex-col items-center">
        <p className="font-semibold mb-2 text-center dark:text-blue-200">
          Normal Orientation
        </p>
        <img
          src={result.normal_image || result.normal}
          alt="normal"
          className="w-40 h-40 object-cover rounded shadow transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold mb-2 text-center dark:text-blue-200">
          Flipped (180°)
        </p>
        <img
          src={result.flipped_image || result.flipped}
          alt="flipped"
          className="w-40 h-40 object-cover rounded shadow transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold mb-2 text-center dark:text-blue-200">
          Rotated (90°)
        </p>
        <img
          src={result.rotated_image || result.rotated}
          alt="rotated"
          className="w-40 h-40 object-cover rounded shadow transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold mb-2 text-center dark:text-blue-200">
          Cropped
        </p>
        <img
          src={result.cropped_image || result.cropped}
          alt="cropped"
          className="w-40 h-40 object-cover rounded shadow transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center">
        <p className="font-semibold mb-2 text-center dark:text-blue-200">
          Crack Mask (Black &amp; White)
        </p>
        <img
          src={result.mask_image || result.mask}
          alt="mask"
          className="w-40 h-40 object-contain rounded shadow transition-transform hover:scale-105"
        />
      </div>
    </motion.div>
  );
}
