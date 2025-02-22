
"use client"
import { useState, ChangeEvent, FormEvent } from "react";


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

export default function DiabetesForm() {
  const [formData, setFormData] = useState<FormData>({
    pregnancy: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    BMI: "",
    diabetesPedigreeFunction: "",
    age: "",
  });

  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult(`Submitted Data: ${JSON.stringify(formData, null, 2)}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Diabetes Risk Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
            <input
              type="number"
              name={key}
              value={formData[key as keyof FormData]}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Result:</h3>
          <pre className="text-sm text-gray-700">{result}</pre>
        </div>
      )}
    </div>
  );
}