export interface PredictionData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigree: number;
  Age: number;
}

export type ModelType = 'classification' | 'regression';

export interface PredictionRequest {
  data: PredictionData;
  modelType: ModelType;
}

export interface PredictionResponse {
  prediction: number;
  error?: string;
}