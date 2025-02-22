"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PredictionData, PredictionResponse } from '@/app/types';

const PredictionForm = () => {
  const [formData, setFormData] = useState<PredictionData>({
    Pregnancies: 0,
    Glucose: 0,
    BloodPressure: 0,
    SkinThickness: 0,
    Insulin: 0,
    BMI: 0,
    DiabetesPedigree: 0,
    Age: 0
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: formData,
          modelType: 'classification'
        })
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json() as PredictionResponse;

      if (result.error) {
        throw new Error(result.error);
      }

      setPrediction(result.prediction);
    } catch (err) {
      setError((err as Error).message || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Diabetes Prediction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(Object.keys(formData) as Array<keyof PredictionData>).map((field) => (
            <div key={field} className="grid w-full items-center gap-1.5">
              <Label htmlFor={field}>{field}</Label>
              <Input
                type="number" id={field} name={field} value={formData[field]} onChange={handleInputChange} required className="w-full" step="any"
              />
            </div>
          ))}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Get Prediction'}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {prediction !== null && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">Prediction Result:</h3>
              <p className="mt-2">
                {prediction === 1 ? 'Positive' : 'Negative'} for diabetes
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;