
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { PredictionRequest, PredictionData, ModelType } from '@/app/types';

export const config = {
  runtime: 'edge',
};

console.log("PREDICT");

const validatePredictionData = (data: Partial<PredictionData>): data is PredictionData => {
  const requiredFields: (keyof PredictionData)[] = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigree',
    'Age'
  ];

  return requiredFields.every(field =>
    typeof data[field] === 'number' && !isNaN(data[field] as number)
  );
};

const runPythonScript = async (
  data: PredictionData,
  modelType: ModelType
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['lib/model.py']);

    let result = '';

    pythonProcess.stdout.on('data', (data: Buffer) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data: Buffer) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Process exited with code ${code}`));
        return;
      }
      resolve(parseFloat(result.trim()));
    });

    pythonProcess.stdin.write(JSON.stringify({ data, modelType }));
    pythonProcess.stdin.end();
  });
};

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return new NextResponse(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json() as PredictionRequest;
    const { data, modelType } = body;

    if (!validatePredictionData(data)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid or missing fields in prediction data' }),
        { status: 400 }
      );
    }

    const prediction = await runPythonScript(data, modelType);

    return new NextResponse(
      JSON.stringify({ prediction }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}