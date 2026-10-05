"""
CyberLens — Network Traffic Dataset Generator
Reproducible generator for realistic cybersecurity network traffic data.
Synthesizes 150,000+ realistic network flows representing Normal traffic and 6 attack types.
Controlled noise and overlap ensure realistic machine learning metrics.
"""

import argparse
import os
import numpy as np
import pandas as pd


def generate_network_traffic(num_rows: int = 150000, random_state: int = 42) -> pd.DataFrame:
    np.random.seed(random_state)

    # Class distributions (~55% Normal, ~45% Attacks across 6 categories)
    proportions = {
        'Normal': 0.54,
        'DDoS': 0.14,
        'Port_Scan': 0.09,
        'Brute_Force': 0.08,
        'Botnet': 0.05,
        'Web_Attack': 0.05,
        'Data_Exfiltration': 0.05
    }

    # Normalize proportions to match num_rows exactly
    class_counts = {k: int(v * num_rows) for k, v in proportions.items()}
    diff = num_rows - sum(class_counts.values())
    class_counts['Normal'] += diff

    print(f"[CyberLens Generator] Target Rows: {num_rows}")
    print("[CyberLens Generator] Target Distribution:")
    for k, v in class_counts.items():
        print(f"  - {k:18s}: {v:,} rows ({v / num_rows * 100:.1f}%)")

    dfs = []
    flow_counter = 1

    for attack_type, count in class_counts.items():
        if count <= 0:
            continue

        is_attack = 0 if attack_type == 'Normal' else 1

        # Protocol probabilities: TCP, UDP, ICMP
        if attack_type == 'Normal':
            proto_choices = np.random.choice(['TCP', 'UDP', 'ICMP'], size=count, p=[0.70, 0.25, 0.05])
            dest_port_choices = np.random.choice([80, 443, 53, 22, 21, 8080, 3389, 445], size=count,
                                                 p=[0.30, 0.40, 0.15, 0.03, 0.02, 0.05, 0.03, 0.02])
            flow_duration = np.random.exponential(scale=12.0, size=count) + 0.1
            packet_count = np.random.negative_binomial(n=10, p=0.15, size=count) + 5
            avg_packet_size = np.random.normal(loc=550, scale=120, size=count).clip(64, 1460)
            syn_count = np.random.poisson(lam=1.2, size=count)
            ack_count = (packet_count * 0.45).astype(int) + np.random.poisson(1, count)
            rst_count = np.random.poisson(lam=0.2, size=count)
            fin_count = np.random.poisson(lam=0.8, size=count)
            failed_logins = np.random.choice([0, 1], size=count, p=[0.97, 0.03])
            login_attempts = failed_logins + np.random.choice([0, 1, 2], size=count, p=[0.85, 0.12, 0.03])
            connection_count = np.random.poisson(lam=4, size=count) + 1
            failed_connections = np.random.poisson(lam=0.2, size=count)
            unique_dest_ports = np.random.choice([1, 2, 3], size=count, p=[0.80, 0.15, 0.05])
            http_requests = np.where(np.isin(dest_port_choices, [80, 8080]), np.random.poisson(lam=3, size=count) + 1, 0)
            dns_requests = np.where(dest_port_choices == 53, np.random.poisson(lam=2, size=count) + 1, 0)
            tls_connections = np.where(dest_port_choices == 443, np.random.poisson(lam=1, size=count) + 1, 0)
            data_exfiltration_score = np.random.beta(a=1.5, b=8.0, size=count) * 20
            inter_arrival_time = np.random.exponential(scale=0.08, size=count) + 0.001
            jitter = np.random.normal(loc=0.015, scale=0.005, size=count).clip(0.001, 0.1)

        elif attack_type == 'DDoS':
            proto_choices = np.random.choice(['TCP', 'UDP', 'ICMP'], size=count, p=[0.75, 0.20, 0.05])
            dest_port_choices = np.random.choice([80, 443, 53, 8080], size=count, p=[0.45, 0.35, 0.10, 0.10])
            flow_duration = np.random.exponential(scale=4.0, size=count) + 0.05
            packet_count = np.random.negative_binomial(n=40, p=0.02, size=count) + 800  # High packet volume
            avg_packet_size = np.random.normal(loc=950, scale=180, size=count).clip(200, 1500)
            syn_count = np.random.poisson(lam=45, size=count) + 20
            ack_count = np.random.poisson(lam=15, size=count)
            rst_count = np.random.poisson(lam=8, size=count)
            fin_count = np.random.poisson(lam=1, size=count)
            failed_logins = np.zeros(count, dtype=int)
            login_attempts = np.zeros(count, dtype=int)
            connection_count = np.random.poisson(lam=85, size=count) + 50
            failed_connections = np.random.poisson(lam=25, size=count) + 10
            unique_dest_ports = np.random.choice([1, 2], size=count, p=[0.90, 0.10])
            http_requests = np.where(np.isin(dest_port_choices, [80, 8080]), np.random.poisson(lam=30, size=count) + 10, 0)
            dns_requests = np.where(dest_port_choices == 53, np.random.poisson(lam=20, size=count) + 5, 0)
            tls_connections = np.where(dest_port_choices == 443, np.random.poisson(lam=8, size=count), 0)
            data_exfiltration_score = np.random.beta(a=1.0, b=5.0, size=count) * 15
            inter_arrival_time = np.random.exponential(scale=0.002, size=count) + 0.0001  # Rapid bursts
            jitter = np.random.normal(loc=0.004, scale=0.001, size=count).clip(0.0005, 0.02)

        elif attack_type == 'Port_Scan':
            proto_choices = np.random.choice(['TCP', 'UDP'], size=count, p=[0.90, 0.10])
            dest_port_choices = np.random.randint(20, 65535, size=count)
            flow_duration = np.random.exponential(scale=1.5, size=count) + 0.02
            packet_count = np.random.poisson(lam=3, size=count) + 1  # Minimal packets per probe
            avg_packet_size = np.random.normal(loc=68, scale=10, size=count).clip(40, 120)
            syn_count = np.random.poisson(lam=3, size=count) + 1
            ack_count = np.random.poisson(lam=0.5, size=count)
            rst_count = np.random.poisson(lam=2, size=count) + 1
            fin_count = np.random.poisson(lam=0.1, size=count)
            failed_logins = np.zeros(count, dtype=int)
            login_attempts = np.zeros(count, dtype=int)
            connection_count = np.random.poisson(lam=35, size=count) + 15
            failed_connections = np.random.poisson(lam=28, size=count) + 10
            unique_dest_ports = np.random.randint(15, 120, size=count)  # Key scan indicator
            http_requests = np.zeros(count, dtype=int)
            dns_requests = np.zeros(count, dtype=int)
            tls_connections = np.zeros(count, dtype=int)
            data_exfiltration_score = np.random.beta(a=0.5, b=9.0, size=count) * 5
            inter_arrival_time = np.random.exponential(scale=0.01, size=count) + 0.001
            jitter = np.random.normal(loc=0.008, scale=0.003, size=count).clip(0.001, 0.05)

        elif attack_type == 'Brute_Force':
            proto_choices = np.random.choice(['TCP'], size=count)
            dest_port_choices = np.random.choice([22, 3389, 21, 80, 443], size=count, p=[0.45, 0.25, 0.15, 0.10, 0.05])
            flow_duration = np.random.exponential(scale=18.0, size=count) + 2.0
            packet_count = np.random.negative_binomial(n=15, p=0.2, size=count) + 20
            avg_packet_size = np.random.normal(loc=280, scale=45, size=count).clip(80, 600)
            syn_count = np.random.poisson(lam=6, size=count) + 2
            ack_count = (packet_count * 0.4).astype(int)
            rst_count = np.random.poisson(lam=4, size=count) + 1
            fin_count = np.random.poisson(lam=2, size=count)
            failed_logins = np.random.randint(8, 45, size=count)  # Strong brute force signature
            login_attempts = failed_logins + np.random.randint(1, 6, size=count)
            connection_count = np.random.poisson(lam=20, size=count) + 8
            failed_connections = np.random.poisson(lam=8, size=count) + 2
            unique_dest_ports = np.random.choice([1, 2], size=count, p=[0.92, 0.08])
            http_requests = np.where(np.isin(dest_port_choices, [80, 443]), np.random.poisson(lam=12, size=count) + 5, 0)
            dns_requests = np.zeros(count, dtype=int)
            tls_connections = np.where(dest_port_choices == 443, np.random.poisson(lam=3, size=count), 0)
            data_exfiltration_score = np.random.beta(a=1.0, b=7.0, size=count) * 10
            inter_arrival_time = np.random.exponential(scale=0.06, size=count) + 0.005
            jitter = np.random.normal(loc=0.02, scale=0.005, size=count).clip(0.002, 0.08)

        elif attack_type == 'Botnet':
            proto_choices = np.random.choice(['TCP', 'UDP'], size=count, p=[0.80, 0.20])
            dest_port_choices = np.random.choice([6667, 8080, 443, 53, 445, 80], size=count, p=[0.30, 0.25, 0.20, 0.15, 0.05, 0.05])
            flow_duration = np.random.exponential(scale=35.0, size=count) + 5.0
            packet_count = np.random.negative_binomial(n=20, p=0.1, size=count) + 30
            avg_packet_size = np.random.normal(loc=420, scale=80, size=count).clip(100, 1100)
            syn_count = np.random.poisson(lam=4, size=count) + 1
            ack_count = (packet_count * 0.42).astype(int)
            rst_count = np.random.poisson(lam=1, size=count)
            fin_count = np.random.poisson(lam=2, size=count)
            failed_logins = np.random.choice([0, 1, 2], size=count, p=[0.75, 0.20, 0.05])
            login_attempts = failed_logins + np.random.choice([0, 1], size=count, p=[0.8, 0.2])
            connection_count = np.random.poisson(lam=18, size=count) + 5
            failed_connections = np.random.poisson(lam=3, size=count)
            unique_dest_ports = np.random.choice([1, 2, 3, 4], size=count, p=[0.60, 0.25, 0.10, 0.05])
            http_requests = np.where(np.isin(dest_port_choices, [80, 8080]), np.random.poisson(lam=8, size=count) + 1, 0)
            dns_requests = np.random.poisson(lam=5, size=count) + 1  # Periodic C2 lookups
            tls_connections = np.where(dest_port_choices == 443, np.random.poisson(lam=4, size=count) + 1, 0)
            data_exfiltration_score = np.random.beta(a=3.0, b=4.0, size=count) * 45
            inter_arrival_time = np.random.normal(loc=1.2, scale=0.08, size=count).clip(0.1, 5.0)  # Regular beaconing
            jitter = np.random.normal(loc=0.003, scale=0.001, size=count).clip(0.0005, 0.01)  # Low jitter clockwork

        elif attack_type == 'Web_Attack':
            proto_choices = np.random.choice(['TCP'], size=count)
            dest_port_choices = np.random.choice([80, 443, 8080, 8443], size=count, p=[0.45, 0.35, 0.15, 0.05])
            flow_duration = np.random.exponential(scale=8.0, size=count) + 0.5
            packet_count = np.random.negative_binomial(n=12, p=0.15, size=count) + 15
            avg_packet_size = np.random.normal(loc=820, scale=190, size=count).clip(250, 1480)
            syn_count = np.random.poisson(lam=2, size=count) + 1
            ack_count = (packet_count * 0.45).astype(int)
            rst_count = np.random.poisson(lam=1, size=count)
            fin_count = np.random.poisson(lam=1, size=count)
            failed_logins = np.random.choice([0, 1, 2, 4], size=count, p=[0.60, 0.25, 0.10, 0.05])
            login_attempts = failed_logins + np.random.choice([1, 2, 3], size=count, p=[0.7, 0.2, 0.1])
            connection_count = np.random.poisson(lam=8, size=count) + 2
            failed_connections = np.random.poisson(lam=2, size=count)
            unique_dest_ports = np.random.choice([1, 2], size=count, p=[0.85, 0.15])
            http_requests = np.random.poisson(lam=14, size=count) + 4  # Heavy web requests
            dns_requests = np.random.poisson(lam=1, size=count)
            tls_connections = np.where(np.isin(dest_port_choices, [443, 8443]), np.random.poisson(lam=5, size=count) + 1, 0)
            data_exfiltration_score = np.random.beta(a=3.5, b=5.0, size=count) * 40
            inter_arrival_time = np.random.exponential(scale=0.04, size=count) + 0.002
            jitter = np.random.normal(loc=0.012, scale=0.004, size=count).clip(0.001, 0.05)

        elif attack_type == 'Data_Exfiltration':
            proto_choices = np.random.choice(['TCP'], size=count)
            dest_port_choices = np.random.choice([443, 80, 22, 53, 8080], size=count, p=[0.55, 0.15, 0.15, 0.10, 0.05])
            flow_duration = np.random.exponential(scale=60.0, size=count) + 15.0  # Prolonged session
            packet_count = np.random.negative_binomial(n=30, p=0.05, size=count) + 150
            avg_packet_size = np.random.normal(loc=1280, scale=120, size=count).clip(750, 1500)
            syn_count = np.random.poisson(lam=2, size=count) + 1
            ack_count = (packet_count * 0.48).astype(int)
            rst_count = np.random.poisson(lam=0.5, size=count)
            fin_count = np.random.poisson(lam=1, size=count)
            failed_logins = np.random.choice([0, 1], size=count, p=[0.90, 0.10])
            login_attempts = failed_logins + 1
            connection_count = np.random.poisson(lam=6, size=count) + 1
            failed_connections = np.random.poisson(lam=0.5, size=count)
            unique_dest_ports = np.random.choice([1, 2], size=count, p=[0.90, 0.10])
            http_requests = np.where(dest_port_choices == 80, np.random.poisson(lam=8, size=count) + 1, 0)
            dns_requests = np.where(dest_port_choices == 53, np.random.poisson(lam=12, size=count) + 2, 0)
            tls_connections = np.where(dest_port_choices == 443, np.random.poisson(lam=6, size=count) + 1, 0)
            data_exfiltration_score = np.random.beta(a=7.5, b=2.0, size=count) * 95  # Obvious high score
            inter_arrival_time = np.random.exponential(scale=0.05, size=count) + 0.005
            jitter = np.random.normal(loc=0.015, scale=0.004, size=count).clip(0.002, 0.06)

        # Realistic background overlap:
        # Legitimate traffic contains noisy events (network audits, backups, password typos, streaming)
        # Attacks contain stealth techniques (low-and-slow, evasive payloads, low-rate probes)
        if attack_type == 'Normal':
            # 3.5% of normal traffic represents heavy admin/backup/developer tasks
            heavy_admin_mask = np.random.rand(count) < 0.035
            if heavy_admin_mask.sum() > 0:
                h_cnt = heavy_admin_mask.sum()
                data_exfiltration_score[heavy_admin_mask] = np.random.uniform(25, 65, size=h_cnt)
                failed_logins[heavy_admin_mask] = np.random.choice([2, 3, 4], size=h_cnt)
                login_attempts[heavy_admin_mask] = failed_logins[heavy_admin_mask] + 2
                unique_dest_ports[heavy_admin_mask] = np.random.randint(5, 25, size=h_cnt)
                connection_count[heavy_admin_mask] = np.random.randint(15, 45, size=h_cnt)
                packet_count[heavy_admin_mask] = np.random.randint(120, 600, size=h_cnt)
        else:
            # 3.5% of attack traffic uses stealth / evasion techniques, blending into normal distributions
            stealth_mask = np.random.rand(count) < 0.038
            if stealth_mask.sum() > 0:
                s_cnt = stealth_mask.sum()
                data_exfiltration_score[stealth_mask] = np.random.uniform(5, 18, size=s_cnt)
                failed_logins[stealth_mask] = np.random.choice([0, 1, 2], size=s_cnt)
                login_attempts[stealth_mask] = failed_logins[stealth_mask] + np.random.choice([0, 1], size=s_cnt)
                unique_dest_ports[stealth_mask] = np.random.choice([1, 2, 3], size=s_cnt)
                connection_count[stealth_mask] = np.random.randint(3, 10, size=s_cnt)
                packet_count[stealth_mask] = np.random.randint(15, 95, size=s_cnt)
                syn_count[stealth_mask] = np.random.randint(1, 4, size=s_cnt)
                avg_packet_size[stealth_mask] = np.random.normal(loc=540, scale=100, size=s_cnt).clip(64, 1400)

        # Derived metrics
        byte_count = (packet_count * avg_packet_size).astype(np.int64)
        packet_rate = np.round(packet_count / flow_duration, 2)
        byte_rate = np.round(byte_count / flow_duration, 2)
        min_packet_size = (avg_packet_size * np.random.uniform(0.1, 0.4, size=count)).astype(int).clip(40, 300)
        max_packet_size = (avg_packet_size * np.random.uniform(1.3, 1.8, size=count)).astype(int).clip(500, 1514)

        tcp_flag_count = syn_count + ack_count + rst_count + fin_count
        forward_packets = (packet_count * np.random.uniform(0.48, 0.65, size=count)).astype(int).clip(1, None)
        backward_packets = (packet_count - forward_packets).clip(0, None)

        forward_bytes = (forward_packets * avg_packet_size * np.random.uniform(0.85, 1.15, size=count)).astype(np.int64)
        backward_bytes = (byte_count - forward_bytes).clip(0, None)

        active_time = (flow_duration * np.random.uniform(0.6, 0.95, size=count)).clip(0.01, None)
        idle_time = (flow_duration - active_time).clip(0.0, None)

        source_entropy = np.random.normal(loc=4.2, scale=0.8, size=count).clip(1.0, 7.8)
        destination_entropy = np.random.normal(loc=4.6, scale=0.7, size=count).clip(1.0, 7.8)
        payload_size = (byte_count * np.random.uniform(0.70, 0.92, size=count)).astype(np.int64)
        retransmission_count = np.random.poisson(lam=0.4 if attack_type == 'Normal' else 2.5, size=count)

        hour = np.random.randint(0, 24, size=count)
        day_of_week = np.random.randint(0, 7, size=count)

        # IP and Flow IDs
        if attack_type == 'Normal':
            src_ips = [f"192.168.1.{np.random.randint(10, 220)}" for _ in range(count)]
            dst_ips = [f"10.0.0.{np.random.randint(2, 60)}" for _ in range(count)]
        else:
            src_ips = [f"{np.random.randint(45, 203)}.{np.random.randint(10, 250)}.{np.random.randint(1, 250)}.{np.random.randint(2, 250)}" for _ in range(count)]
            dst_ips = [f"192.168.1.{np.random.randint(10, 30)}" for _ in range(count)]

        src_ports = np.random.randint(1024, 65535, size=count)
        flow_ids = [f"FLW_{flow_counter + i:07d}" for i in range(count)]
        flow_counter += count

        batch_df = pd.DataFrame({
            'flow_id': flow_ids,
            'source_ip': src_ips,
            'destination_ip': dst_ips,
            'source_port': src_ports,
            'destination_port': dest_port_choices,
            'protocol': proto_choices,
            'packet_count': packet_count,
            'byte_count': byte_count,
            'flow_duration': np.round(flow_duration, 4),
            'packet_rate': packet_rate,
            'byte_rate': byte_rate,
            'avg_packet_size': np.round(avg_packet_size, 2),
            'min_packet_size': min_packet_size,
            'max_packet_size': max_packet_size,
            'tcp_flag_count': tcp_flag_count,
            'syn_count': syn_count,
            'ack_count': ack_count,
            'rst_count': rst_count,
            'fin_count': fin_count,
            'forward_packets': forward_packets,
            'backward_packets': backward_packets,
            'forward_bytes': forward_bytes,
            'backward_bytes': backward_bytes,
            'active_time': np.round(active_time, 4),
            'idle_time': np.round(idle_time, 4),
            'connection_count': connection_count,
            'failed_connections': failed_connections,
            'unique_destination_ports': unique_dest_ports,
            'source_entropy': np.round(source_entropy, 3),
            'destination_entropy': np.round(destination_entropy, 3),
            'payload_size': payload_size,
            'inter_arrival_time': np.round(inter_arrival_time, 6),
            'jitter': np.round(jitter, 6),
            'retransmission_count': retransmission_count,
            'dns_requests': dns_requests,
            'http_requests': http_requests,
            'tls_connections': tls_connections,
            'login_attempts': login_attempts,
            'failed_login_attempts': failed_logins,
            'data_exfiltration_score': np.round(data_exfiltration_score, 2),
            'hour': hour,
            'day_of_week': day_of_week,
            'attack_type': attack_type,
            'is_attack': is_attack
        })
        dfs.append(batch_df)

    df_full = pd.concat(dfs, ignore_index=True)

    # Realistic cross-class overlap:
    # 1. 3.5% of attack flows represent evasive/stealth attacks that mirror normal traffic
    # 2. 3.5% of normal flows represent noisy legitimate operations (network scans, large backups, admin typos)
    numerical_cols = [
        'packet_count', 'byte_count', 'flow_duration', 'packet_rate', 'byte_rate',
        'avg_packet_size', 'min_packet_size', 'max_packet_size', 'tcp_flag_count',
        'syn_count', 'ack_count', 'rst_count', 'fin_count', 'forward_packets',
        'backward_packets', 'forward_bytes', 'backward_bytes', 'active_time',
        'idle_time', 'connection_count', 'failed_connections', 'unique_destination_ports',
        'source_entropy', 'destination_entropy', 'payload_size', 'inter_arrival_time',
        'jitter', 'retransmission_count', 'dns_requests', 'http_requests',
        'tls_connections', 'login_attempts', 'failed_login_attempts',
        'data_exfiltration_score', 'hour', 'day_of_week', 'destination_port'
    ]

    rng = np.random.RandomState(random_state)
    normal_idx = df_full[df_full['is_attack'] == 0].index.values
    attack_idx = df_full[df_full['is_attack'] == 1].index.values

    # Stealth attacks: borrow benign feature profile
    n_stealth = int(0.035 * len(attack_idx))
    stealth_target_idx = rng.choice(attack_idx, size=n_stealth, replace=False)
    benign_donor_idx = rng.choice(normal_idx, size=n_stealth, replace=False)
    df_full.loc[stealth_target_idx, numerical_cols] = df_full.loc[benign_donor_idx, numerical_cols].values

    # Noisy authorized benign operations: borrow attack feature profile
    n_noisy = int(0.035 * len(normal_idx))
    noisy_target_idx = rng.choice(normal_idx, size=n_noisy, replace=False)
    attack_donor_idx = rng.choice(attack_idx, size=n_noisy, replace=False)
    df_full.loc[noisy_target_idx, numerical_cols] = df_full.loc[attack_donor_idx, numerical_cols].values

    # Shuffle randomly
    df_full = df_full.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    return df_full


def main():
    parser = argparse.ArgumentParser(description="CyberLens Dataset Generator")
    parser.add_argument("--rows", type=int, default=150000, help="Number of rows to generate (default: 150000)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducibility (default: 42)")
    parser.add_argument("--output_dir", type=str, default="data", help="Target data directory")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    csv_path = os.path.join(args.output_dir, "network_traffic_dataset.csv")
    sample_path = os.path.join(args.output_dir, "sample_network_traffic.csv")

    print(f"\n=======================================================")
    print(f" CYBERLENS DATASET GENERATION PIPELINE")
    print(f"=======================================================")
    df = generate_network_traffic(num_rows=args.rows, random_state=args.seed)

    print(f"\n[Saving] Writing full dataset to: {csv_path} ...")
    df.to_csv(csv_path, index=False)
    file_size_mb = os.path.getsize(csv_path) / (1024 * 1024)
    print(f"[Done] Full dataset saved: {len(df):,} rows x {len(df.columns)} columns ({file_size_mb:.2f} MB)")

    print(f"\n[Saving] Writing sample preview (1,000 rows) to: {sample_path} ...")
    df.head(1000).to_csv(sample_path, index=False)
    print(f"[Done] Sample preview saved.")

    print("\n---------------- Class Distribution ----------------")
    print(df['attack_type'].value_counts(normalize=False))
    print("\n---------------- Binary Label Distribution ---------")
    print(df['is_attack'].value_counts(normalize=True).apply(lambda x: f"{x * 100:.2f}%"))
    print("\n---------------- Basic Numerical Stats -------------")
    features_to_show = ['packet_count', 'byte_count', 'flow_duration', 'packet_rate', 'unique_destination_ports', 'failed_login_attempts', 'data_exfiltration_score']
    print(df[features_to_show].describe().round(2).T[['mean', 'std', 'min', '50%', 'max']])
    print("=======================================================\n")


if __name__ == '__main__':
    main()
