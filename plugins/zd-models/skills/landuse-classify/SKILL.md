---
name: landuse-classify
paths: ["**/Xgboost/**", "**/*inference*.py", "**/*classif*.py"]
description: Train or run the XGBoost land-use classifier: classes, T-minus alignment, model bundle, unified parcel/sub-parcel inference, predictions.gpkg.
---

# Land-use classification (XGBoost on temporal features)

Classes (default): `Agriculture, Sugarcane, Builtup, Open Land, Road, Waterbody, Orchard`. Keep the label encoder with the model.

Model bundle (joblib) = `{model, label_encoder, feature_columns, scaler?, config{period_days, target_year, bands, indices}, trained_at, git_sha}`. Stored on Hugging Face under a versioned directory; load with `hf_hub_download` using `HF_TOKEN` from the environment.

**T-minus alignment.** Training rows are anchored on the ground-truth date: period `t−k` means k periods before the label date. At inference, anchor on the latest valid Sentinel-2 date for the AOI and build the same offsets, so phenology aligns across years.

Training
1. Join labels to `feature_matrix.parquet` on `parcel_uid`; drop Isolation-Forest outliers.
2. Group split by mauza/village (never random rows); stratify by class.
3. `XGBClassifier` with early stopping on a validation fold; class weights for minority classes (Waterbody, Orchard).
4. Report per-class precision/recall/F1 and a confusion matrix; feature importance by period to sanity-check phenology.

Inference (unified)
1. Parcels + optional sub-parcels (`sub-parcelling`) → features for both → predict → `unit_uid` results with `parent_uid`.
2. Reconcile: a parent's class = area-weighted majority of sub-parcel classes unless confidence < 0.5, then keep parent prediction.
3. Write `predictions.gpkg` (geometry, ids, class, probability, top-2 alternative) and a summary CSV by class and district.
