"""
CyberLens — Backend Utilities & Model Caching
Provides thread-safe model caching and rapid query execution for the API.
"""

import json
import os
import sys
import threading
from typing import Dict, Any, Optional
import joblib
import pandas as pd

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

_lock = threading.Lock()
_CACHE = {
    'dataset': None,
    'classification_model': None,
    'classification_preprocessor': None,
    'clustering_model': None,
    'clustering_preprocessor': None,
    'pca_transformer': None,
    'classification_results': None,
    'clustering_results': None
}


def get_dataset() -> pd.DataFrame:
    if _CACHE['dataset'] is None:
        with _lock:
            if _CACHE['dataset'] is None:
                csv_path = os.path.join(PROJECT_ROOT, "data", "network_traffic_dataset.csv")
                if not os.path.exists(csv_path):
                    csv_path = os.path.join(PROJECT_ROOT, "data", "sample_network_traffic.csv")
                print(f"[Backend] Loading dataset from {csv_path}...")
                _CACHE['dataset'] = pd.read_csv(csv_path)
    return _CACHE['dataset']


def get_classification_artifacts():
    if _CACHE['classification_model'] is None:
        with _lock:
            if _CACHE['classification_model'] is None:
                m_path = os.path.join(PROJECT_ROOT, "models", "classification_model.pkl")
                p_path = os.path.join(PROJECT_ROOT, "models", "classification_preprocessor.pkl")
                _CACHE['classification_model'] = joblib.load(m_path)
                _CACHE['classification_preprocessor'] = joblib.load(p_path)
    return _CACHE['classification_model'], _CACHE['classification_preprocessor']


def get_clustering_artifacts():
    if _CACHE['clustering_model'] is None:
        with _lock:
            if _CACHE['clustering_model'] is None:
                m_path = os.path.join(PROJECT_ROOT, "models", "clustering_model.pkl")
                p_path = os.path.join(PROJECT_ROOT, "models", "clustering_preprocessor.pkl")
                pca_path = os.path.join(PROJECT_ROOT, "models", "pca_transformer.pkl")
                _CACHE['clustering_model'] = joblib.load(m_path)
                _CACHE['clustering_preprocessor'] = joblib.load(p_path)
                _CACHE['pca_transformer'] = joblib.load(pca_path)
    return _CACHE['clustering_model'], _CACHE['clustering_preprocessor'], _CACHE['pca_transformer']


def get_classification_results() -> Dict[str, Any]:
    if _CACHE['classification_results'] is None:
        with _lock:
            if _CACHE['classification_results'] is None:
                res_path = os.path.join(PROJECT_ROOT, "results", "classification_results.json")
                with open(res_path, 'r') as f:
                    _CACHE['classification_results'] = json.load(f)
    return _CACHE['classification_results']


def get_clustering_results() -> Dict[str, Any]:
    if _CACHE['clustering_results'] is None:
        with _lock:
            if _CACHE['clustering_results'] is None:
                res_path = os.path.join(PROJECT_ROOT, "results", "clustering_results.json")
                with open(res_path, 'r') as f:
                    _CACHE['clustering_results'] = json.load(f)
    return _CACHE['clustering_results']
