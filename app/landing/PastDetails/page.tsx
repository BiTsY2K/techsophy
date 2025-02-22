"use client"
import { useState, useEffect } from "react";

interface FormData {
  pregnancy: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  BMI: string;
  diabetesPedigreeFunction: string;
  age: string;
}

const generateRandomData = (): FormData => ({
  pregnancy: (Math.floor(Math.random() * 10)).toString(),
  glucose: (Math.floor(Math.random() * 200)).toString(),
  bloodPressure: (Math.floor(Math.random() * 120)).toString(),
  skinThickness: (Math.floor(Math.random() * 50)).toString(),
  insulin: (Math.floor(Math.random() * 300)).toString(),
  BMI: (Math.random() * 50).toFixed(1),
  diabetesPedigreeFunction: (Math.random() * 2).toFixed(2),
  age: (Math.floor(Math.random() * 80)).toString(),
});

export default function DiabetesDataTable() {
  const [data, setData] = useState<FormData>(generateRandomData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateRandomData());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-full  mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Patient Diabetes Data</h2>
      <table className="w-full border-collapse border border-gray-300 mt-2">
        <thead>
          <tr className="bg-gray-200">
            {Object.keys(data).map((key) => (
              <th key={key} className="border border-gray-300 p-2 capitalize">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.values(data).map((value, index) => (
              <td key={index} className="border border-gray-300 p-2">{value}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}