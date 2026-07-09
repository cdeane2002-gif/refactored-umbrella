"""
Trains Logistic Regression, Random Forest, and XGBoost on the synthetic rugby
injury dataset and reports 5-fold cross-validated Accuracy/Recall/Precision/
AUC-ROC, plus XGBoost feature importances for the five features shown on the
Sports Science dashboard (PlaySafe Analytics).

Usage: python scripts/train_models.py path/to/rugby_injury_synthetic.csv
"""
import sys
import json
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, recall_score, precision_score, roc_auc_score
from xgboost import XGBClassifier

FEATURES = {
    "acute_chronic_workload_ratio": "ACWR",
    "cumulative_season_load": "Cumulative Season Load",
    "days_since_last_session": "Days Since Rest",
    "session_rpe": "Session RPE",
    "sleep_hours_previous_night": "Sleep Hours",
}


def main(path):
    df = pd.read_csv(path)
    X = df[list(FEATURES.keys())]
    y = df["injury_occurred"]

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scale_pos_weight = (y == 0).sum() / (y == 1).sum()

    models = {
        "Logistic Regression": Pipeline([
            ("scale", StandardScaler()),
            ("clf", LogisticRegression(class_weight="balanced", max_iter=1000)),
        ]),
        "Random Forest": RandomForestClassifier(
            n_estimators=300, class_weight="balanced", random_state=42, n_jobs=-1
        ),
        "XGBoost": XGBClassifier(
            n_estimators=300, max_depth=4, learning_rate=0.05,
            scale_pos_weight=scale_pos_weight, eval_metric="logloss", random_state=42,
        ),
    }

    results = {}
    for name, model in models.items():
        probs = cross_val_predict(model, X, y, cv=cv, method="predict_proba")[:, 1]
        preds = (probs >= 0.5).astype(int)
        results[name] = {
            "accuracy": round(float(accuracy_score(y, preds)), 2),
            "recall": round(float(recall_score(y, preds)), 2),
            "precision": round(float(precision_score(y, preds)), 2),
            "auc": round(float(roc_auc_score(y, probs)), 2),
        }

    final_model = models["XGBoost"]
    final_model.fit(X, y)
    importances = final_model.feature_importances_
    importances = importances / importances.sum() * 100
    feature_importance = sorted(
        [{"feature": FEATURES[col], "value": round(float(imp))} for col, imp in zip(X.columns, importances)],
        key=lambda d: -d["value"],
    )

    print(json.dumps({"modelComparison": results, "featureImportance": feature_importance}, indent=2))


if __name__ == "__main__":
    main(sys.argv[1])
