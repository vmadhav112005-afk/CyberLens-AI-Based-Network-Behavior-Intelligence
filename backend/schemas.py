"""
CyberLens — Pydantic Schemas for API Requests & Responses
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    dataset_loaded: bool
    dataset_rows: int
    classification_model_loaded: bool
    clustering_model_loaded: bool
    version: str = "1.0.0"


class ClassificationPredictRequest(BaseModel):
    packet_count: float = Field(..., example=120)
    byte_count: float = Field(..., example=85000)
    flow_duration: float = Field(..., example=5.2)
    packet_rate: float = Field(..., example=23.07)
    byte_rate: float = Field(..., example=16346.15)
    destination_port: int = Field(..., example=80)
    unique_destination_ports: int = Field(..., example=1)
    failed_login_attempts: int = Field(..., example=0)
    connection_count: int = Field(..., example=4)
    syn_count: int = Field(..., example=2)
    http_requests: int = Field(..., example=3)
    data_exfiltration_score: float = Field(..., example=4.5)


class ClassificationPredictResponse(BaseModel):
    prediction: str
    is_attack: int
    attack_probability: float
    risk_level: str
    risk_color: str
    confidence: float
    contributing_factors: List[str]


class ClusteringPredictRequest(BaseModel):
    packet_count: float = Field(..., example=120)
    byte_count: float = Field(..., example=85000)
    flow_duration: float = Field(..., example=5.2)
    packet_rate: float = Field(..., example=23.07)
    destination_port: int = Field(..., example=80)
    unique_destination_ports: int = Field(..., example=1)
    failed_login_attempts: int = Field(..., example=0)
    connection_count: int = Field(..., example=4)
    http_requests: int = Field(..., example=3)
    data_exfiltration_score: float = Field(..., example=4.5)


class ClusteringPredictResponse(BaseModel):
    cluster_id: int
    cluster_name: str
    badge: str
    color: str
    description: str
    distance_to_center: float
    post_hoc_attack_pct: float
    dominant_protocol: str


class DatasetItem(BaseModel):
    flow_id: str
    source_ip: str
    destination_ip: str
    source_port: int
    destination_port: int
    protocol: str
    packet_count: int
    byte_count: int
    flow_duration: float
    packet_rate: float
    byte_rate: float
    unique_destination_ports: int
    failed_login_attempts: int
    connection_count: int
    data_exfiltration_score: float
    attack_type: str
    is_attack: int


class DatasetPaginationResponse(BaseModel):
    items: List[Dict[str, Any]]
    total: int
    page: int
    limit: int
    pages: int
