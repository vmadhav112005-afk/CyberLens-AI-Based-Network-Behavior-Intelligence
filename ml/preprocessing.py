"""
CyberLens — ML Preprocessing Module
Strictly prevents data leakage and ensures clean feature transformation
for both Supervised Classification and Unsupervised Clustering pipelines.
"""

from typing import Tuple, List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# Non-informative identifiers to exclude from feature matrix
IDENTIFIER_COLS = ['flow_id', 'source_ip', 'destination_ip']

# Target labels (must be strictly excluded from clustering!)
TARGET_COLS = ['attack_type', 'is_attack']

# Key numerical features used for modelling
NUMERICAL_FEATURES = [
    'packet_count',
    'byte_count',
    'flow_duration',
    'packet_rate',
    'byte_rate',
    'avg_packet_size',
    'min_packet_size',
    'max_packet_size',
    'tcp_flag_count',
    'syn_count',
    'ack_count',
    'rst_count',
    'fin_count',
    'forward_packets',
    'backward_packets',
    'forward_bytes',
    'backward_bytes',
    'active_time',
    'idle_time',
    'connection_count',
    'failed_connections',
    'unique_destination_ports',
    'source_entropy',
    'destination_entropy',
    'payload_size',
    'inter_arrival_time',
    'jitter',
    'retransmission_count',
    'dns_requests',
    'http_requests',
    'tls_connections',
    'login_attempts',
    'failed_login_attempts',
    'data_exfiltration_score',
    'hour',
    'day_of_week',
    'destination_port'
]

# Interactive input features (subset that users can tweak in the sandbox/explorer)
INTERACTIVE_FEATURES = [
    'packet_count',
    'byte_count',
    'flow_duration',
    'packet_rate',
    'byte_rate',
    'destination_port',
    'unique_destination_ports',
    'failed_login_attempts',
    'connection_count',
    'syn_count',
    'http_requests',
    'data_exfiltration_score'
]


class CyberLensPreprocessor:
    """Preprocesses network traffic features with leakage prevention and reproducible scaling."""

    def __init__(self, feature_names: List[str] = None):
        self.feature_names = feature_names or NUMERICAL_FEATURES
        self.scaler = StandardScaler()
        self.feature_means: Dict[str, float] = {}
        self.is_fitted = False

    def fit(self, df: pd.DataFrame, baseline_df: pd.DataFrame = None):
        X = df[self.feature_names].copy().fillna(0)
        self.scaler.fit(X)
        self.feature_means = {col: float(X[col].mean()) for col in self.feature_names}
        
        # If baseline normal data is available, compute normal reference means
        if baseline_df is not None:
            self.baseline_means = {col: float(baseline_df[col].mean()) for col in self.feature_names if col in baseline_df.columns}
        else:
            self.baseline_means = self.feature_means.copy()
            
        self.is_fitted = True
        return self

    def transform(self, df: pd.DataFrame) -> np.ndarray:
        if not self.is_fitted:
            raise RuntimeError("Preprocessor has not been fitted yet!")
        X = df[self.feature_names].copy().fillna(0)
        return self.scaler.transform(X)

    def fit_transform(self, df: pd.DataFrame, baseline_df: pd.DataFrame = None) -> np.ndarray:
        return self.fit(df, baseline_df).transform(df)

    def transform_single_dict(self, input_dict: Dict[str, Any]) -> np.ndarray:
        """Transforms a partial user input dictionary by calculating coherent flow metrics."""
        row = self.baseline_means.copy() if hasattr(self, 'baseline_means') else self.feature_means.copy()

        # Update with provided inputs
        for col, val in input_dict.items():
            if col in row and val is not None:
                row[col] = float(val)

        # Compute mathematically coherent derived features
        pkts = float(row.get('packet_count', 45))
        bytes_total = float(row.get('byte_count', 24500))
        duration = max(0.01, float(row.get('flow_duration', 5.0)))

        row['avg_packet_size'] = bytes_total / max(1.0, pkts)
        row['min_packet_size'] = min(64.0, row['avg_packet_size'] * 0.3)
        row['max_packet_size'] = max(row['avg_packet_size'] * 1.4, 1460.0)

        row['forward_packets'] = int(pkts * 0.55)
        row['backward_packets'] = max(0, int(pkts - row['forward_packets']))
        row['forward_bytes'] = int(bytes_total * 0.55)
        row['backward_bytes'] = max(0, int(bytes_total - row['forward_bytes']))

        row['active_time'] = duration * 0.85
        row['idle_time'] = duration * 0.15

        syn = float(row.get('syn_count', 1))
        ack = int(pkts * 0.45)
        rst = 1 if syn > 5 else 0
        fin = 1
        row['ack_count'] = ack
        row['rst_count'] = rst
        row['fin_count'] = fin
        row['tcp_flag_count'] = syn + ack + rst + fin

        df_single = pd.DataFrame([[row[col] for col in self.feature_names]], columns=self.feature_names)
        return self.scaler.transform(df_single)


def prepare_classification_data(df: pd.DataFrame, test_size: float = 0.20, random_state: int = 42) -> Tuple[
    np.ndarray, np.ndarray, np.ndarray, np.ndarray, CyberLensPreprocessor
]:
    """Prepares 80/20 train/test split with zero data leakage (scaler fit on training set only)."""
    X_train_df, X_test_df, y_train, y_test = train_test_split(
        df[NUMERICAL_FEATURES],
        df['is_attack'].values,
        test_size=test_size,
        random_state=random_state,
        stratify=df['is_attack'].values
    )

    preprocessor = CyberLensPreprocessor(feature_names=NUMERICAL_FEATURES)
    normal_train_df = X_train_df[y_train == 0]
    X_train_scaled = preprocessor.fit_transform(X_train_df, baseline_df=normal_train_df)
    X_test_scaled = preprocessor.transform(X_test_df)

    return X_train_scaled, X_test_scaled, y_train, y_test, preprocessor


def prepare_clustering_data(df: pd.DataFrame, sample_size: int = None, random_state: int = 42) -> Tuple[
    np.ndarray, pd.DataFrame, CyberLensPreprocessor
]:
    """
    Prepares strictly UNLABELED dataset for unsupervised clustering.
    Target labels ('is_attack', 'attack_type') are completely stripped prior to scaling.
    """
    # Exclude targets completely
    unlabeled_df = df[NUMERICAL_FEATURES].copy()

    if sample_size and sample_size < len(unlabeled_df):
        sampled_df = unlabeled_df.sample(n=sample_size, random_state=random_state).reset_index(drop=True)
    else:
        sampled_df = unlabeled_df

    preprocessor = CyberLensPreprocessor(feature_names=NUMERICAL_FEATURES)
    X_scaled = preprocessor.fit_transform(sampled_df)

    return X_scaled, sampled_df, preprocessor
