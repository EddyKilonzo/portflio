#!/usr/bin/env python3

"""
Detailed Port Scanner
Features: Multithreading, Banner Grabbing, and Service Detection.
"""

import socket
import argparse
import sys
import threading
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

# Common port to service mapping
COMMON_PORTS = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    3389: "RDP",
    5432: "PostgreSQL",
    8080: "HTTP-Alt"
}

def get_banner(s):
    """Attempt to retrieve a service banner."""
    try:
        s.sendall(b"Hello\r\n")
        banner = s.recv(1024).decode(errors='ignore').strip()
        return banner
    except:
        return None

def scan_port(target, port, timeout):
    """Scan a single port and return its status and banner."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((target, port))
            
            if result == 0:
                service = COMMON_PORTS.get(port, "Unknown")
                banner = get_banner(s)
                return {
                    "port": port,
                    "status": "Open",
                    "service": service,
                    "banner": banner
                }
    except Exception:
        pass
    return None

def main():
    parser = argparse.ArgumentParser(description="Professional Multi-threaded Port Scanner")
    parser.add_argument("target", help="Target IP address or hostname")
    parser.add_argument("-p", "--ports", default="1-1024", help="Port range (default: 1-1024)")
    parser.add_argument("-t", "--threads", type=int, default=50, help="Number of threads (default: 50)")
    parser.add_argument("--timeout", type=float, default=1.0, help="Socket timeout (default: 1.0)")
    
    args = parser.parse_args()
    
    try:
        target_ip = socket.gethostbyname(args.target)
    except socket.gaierror:
        print(f"Error: Could not resolve hostname {args.target}")
        sys.exit(1)
        
    # Parse port range
    try:
        if '-' in args.ports:
            start_port, end_port = map(int, args.ports.split('-'))
        else:
            start_port = end_port = int(args.ports)
    except ValueError:
        print("Error: Invalid port range format. Use 'start-end' or a single number.")
        sys.exit(1)

    print("-" * 60)
    print(f"Scanning Target: {target_ip}")
    print(f"Time Started: {datetime.now()}")
    print("-" * 60)
    print(f"{'PORT':<10} {'SERVICE':<15} {'BANNER'}")
    print("-" * 60)

    open_ports = []
    
    with ThreadPoolExecutor(max_workers=args.threads) as executor:
        futures = [executor.submit(scan_port, target_ip, port, args.timeout) for port in range(start_port, end_port + 1)]
        
        for future in futures:
            res = future.result()
            if res:
                open_ports.append(res)
                banner_str = res['banner'] if res['banner'] else "N/A"
                print(f"{res['port']:<10} {res['service']:<15} {banner_str}")

    print("-" * 60)
    print(f"Scan Completed. Found {len(open_ports)} open ports.")
    print("-" * 60)

if __name__ == "__main__":
    main()
