# <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" width="30" height="30" /> Port Scanner

<img src="https://img.shields.io/badge/Status-Detailed-success?style=flat-square" /> <img src="https://img.shields.io/badge/Performance-Multi--threaded-blue?style=flat-square" />

A high-performance, multi-threaded TCP port scanner with banner grabbing capabilities.

## ✨ Features

*   🚀 **High Speed**: Utilizes `ThreadPoolExecutor` for concurrent scanning.
*   🔍 **Service Detection**: Automatically maps common ports to services (SSH, HTTP, etc.).
*   📜 **Banner Grabbing**: Attempts to retrieve service identification strings.
*   🎮 **User Friendly**: Simple CLI interface with `argparse`.

## 🚀 Usage

Basic scan of the first 1024 ports:
```bash
python port_scanner.py 192.168.1.1
```

Scan a specific range with 100 threads:
```bash
python port_scanner.py 192.168.1.1 -p 20-443 -t 100
```

### Arguments

| Flag | Long Flag | Description | Default |
| :--- | :--- | :--- | :--- |
| `-p` | `--ports` | Port range (e.g., 1-1000) | 1-1024 |
| `-t` | `--threads` | Number of concurrent threads | 50 |
| `--timeout` | | Socket timeout in seconds | 1.0 |

## 📊 Example Output

```text
------------------------------------------------------------
Scanning Target: 127.0.0.1
Time Started: 2024-05-20 10:00:00.000000
------------------------------------------------------------
PORT       SERVICE         BANNER
------------------------------------------------------------
22         SSH             SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6
80         HTTP            Apache/2.4.52 (Ubuntu)
------------------------------------------------------------
Scan Completed. Found 2 open ports.
------------------------------------------------------------
```
