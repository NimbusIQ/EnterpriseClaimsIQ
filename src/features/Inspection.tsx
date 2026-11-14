"use client";
import { useState } from "react";
import { db, storage } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const steps = [
  "Front Slope",
  "Back Slope",
  "Test Square 1",
  "Test Square 2",
  "Ridge",
  "Flashing"
];

export default function Inspection() {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleCapture = async (file: File) => {
    const storageRef = ref(storage, `inspections/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setImages([...images, url]);
    setStep(step + 1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{steps[step]}</h1>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files && handleCapture(e.target.files[0])}
        className="mb-4"
      />

      <p className="text-sm text-gray-500">{Math.round((step / steps.length) * 100)}% complete</p>
    </div>
  );
}
