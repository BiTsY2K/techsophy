import pandas as pd
import pickle
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error, confusion_matrix, classification_report

# Load the Dataset (Example: Pima Indian Diabetes Dataset)
url = "https://raw.githubusercontent.com/jbrownlee/Datasets/master/pima-indians-diabetes.data.csv"
columns = ["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigree", "Age", "Outcome"]
data = pd.read_csv(url, names=columns)

# Preprocessing
X = data.drop(columns=["Outcome"])  # Features
y_classification = data["Outcome"]  # Target for classification (Diabetes: Yes/No)
y_regression = data["Glucose"]  # Target for regression (Predict glucose level)

# Split Data for Training and Testing (80% Train, 20% Test)
X_train, X_test, y_train_cls, y_test_cls = train_test_split(X, y_classification, test_size=0.2, random_state=42)
X_train_reg, X_test_reg, y_train_reg, y_test_reg = train_test_split(X, y_regression, test_size=0.2, random_state=42)

# Train XGBoost for Classification
xgb_classifier = xgb.XGBClassifier(scale_pos_weight=3, use_label_encoder=False, eval_metric="logloss")  # Handle imbalance
xgb_classifier.fit(X_train, y_train_cls)
y_pred_cls = xgb_classifier.predict(X_test)

# Train XGBoost for Regression
xgb_regressor = xgb.XGBRegressor(objective="reg:squarederror")
xgb_regressor.fit(X_train_reg, y_train_reg)
y_pred_reg = xgb_regressor.predict(X_test_reg)

# Evaluate Classification Model
accuracy = accuracy_score(y_test_cls, y_pred_cls)
print("Classification Accuracy:", accuracy)

