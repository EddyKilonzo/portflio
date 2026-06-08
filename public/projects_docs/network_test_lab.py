#!/usr/bin/env python3
"""
Network Testing Lab Script

This script provides various network diagnostic functions including:
- Local IP address enumeration
- Connectivity testing via ping
- DNS resolution testing
- Local listening port enumeration

Author: Network Testing Lab
Date: 2026-01-17
"""

# Standard library imports
import ctypes
import os
import platform
import socket
import subprocess
import sys
from typing import Dict, List, Tuple


def check_local_listeners() -> None:
    """
    Display details about processes listening on open ports.

    This function enumerates all listening TCP and UDP ports on the local
    machine and displays associated process information.
    """
    print("\n" + "=" * 70)
    print("LOCAL LISTENING PORTS")
    print("=" * 70)

    try:
        import psutil

        # Get all network connections
        connections = psutil.net_connections(kind='inet')

        # Filter for listening connections
        listeners = [
            conn for conn in connections
            if conn.status == 'LISTEN' or conn.type == socket.SOCK_DGRAM
        ]

        if not listeners:
            print("\nNo listening ports found.")
            print("\n" + "=" * 70)
            return

        # Organize by protocol
        tcp_listeners = []
        udp_listeners = []

        for conn in listeners:
            try:
                # Get process information
                if conn.pid:
                    try:
                        proc = psutil.Process(conn.pid)
                        proc_name = proc.name()
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        proc_name = "Unknown"
                else:
                    proc_name = "N/A"

                # Format connection info
                addr = conn.laddr
                port_info = {
                    'address': addr.ip if addr else "N/A",
                    'port': addr.port if addr else "N/A",
                    'pid': conn.pid if conn.pid else "N/A",
                    'process': proc_name
                }

                if conn.type == socket.SOCK_STREAM:
                    tcp_listeners.append(port_info)
                elif conn.type == socket.SOCK_DGRAM:
                    udp_listeners.append(port_info)

            except Exception:
                continue

        # Display TCP listeners
        print("\nTCP Listening Ports:")
        print("-" * 70)
        print(f"{'Port':<8} {'Address':<20} {'PID':<10} {'Process'}")
        print("-" * 70)

        if tcp_listeners:
            for listener in sorted(tcp_listeners, key=lambda x: x['port']):
                print(
                    f"{listener['port']:<8} "
                    f"{listener['address']:<20} "
                    f"{str(listener['pid']):<10} "
                    f"{listener['process']}"
                )
        else:
            print("No TCP listeners found")

        # Display UDP listeners
        print("\nUDP Listening Ports:")
        print("-" * 70)
        print(f"{'Port':<8} {'Address':<20} {'PID':<10} {'Process'}")
        print("-" * 70)

        if udp_listeners:
            for listener in sorted(udp_listeners, key=lambda x: x['port']):
                print(
                    f"{listener['port']:<8} "
                    f"{listener['address']:<20} "
                    f"{str(listener['pid']):<10} "
                    f"{listener['process']}"
                )
        else:
            print("No UDP listeners found")

        print("\n" + "=" * 70)

    except ImportError:
        print("\n✗ ERROR: psutil module is required for this function")
        print("  Install it using: pip install psutil")
        print("\n" + "=" * 70)
    except PermissionError:
        print("\n✗ ERROR: Insufficient permissions to access process "
              "information")
        print("  Run this script with administrative privileges")
        print("\n" + "=" * 70)
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        print("\n" + "=" * 70)


def check_permissions() -> None:
    """
    Check if the script is running with administrative privileges.

    Exits with code 1 and displays an error message if not running as admin.

    Raises:
        SystemExit: If script is not running with admin privileges.
    """
    is_admin = False

    try:
        if platform.system() == "Windows":
            # Check if running as administrator on Windows
            is_admin = ctypes.windll.shell32.IsUserAnAdmin() != 0
        else:
            # Check if running as root on Unix-like systems
            is_admin = os.geteuid() == 0
    except AttributeError:
        # Fallback for systems without proper admin checking
        is_admin = False

    if not is_admin:
        print("=" * 70)
        print("ERROR: Administrative Privileges Required")
        print("=" * 70)
        print("\nThis script requires administrative privileges to run "
              "properly.")
        print("\nUSAGE:")
        if platform.system() == "Windows":
            print("  - Right-click on Command Prompt or PowerShell")
            print("  - Select 'Run as Administrator'")
            print("  - Navigate to the script directory")
            print("  - Run: python network_test_lab.py")
        else:
            print("  - Run: sudo python3 network_test_lab.py")
        print("\n" + "=" * 70)
        sys.exit(1)


def display_header() -> None:
    """Display the script header with title and information."""
    print("\n" + "=" * 70)
    print(" " * 20 + "NETWORK TESTING LAB")
    print("=" * 70)
    print(f"System: {platform.system()} {platform.release()}")
    print(f"Python Version: {sys.version.split()[0]}")
    print("=" * 70)


def dns_ping_test(domain: str = "flatironschool.com") -> None:
    """
    Test DNS resolution for a specified domain and ping the resolved address.

    Args:
        domain: Domain name to resolve and ping (default: flatironschool.com)
    """
    print("\n" + "=" * 70)
    print(f"DNS RESOLUTION AND PING TEST - {domain}")
    print("=" * 70)

    try:
        print(f"\nResolving DNS for {domain}...\n")

        # Perform DNS lookup
        addr_info = socket.getaddrinfo(domain, None, socket.AF_INET)

        if not addr_info:
            print(f"✗ FAILURE: Could not resolve {domain}")
            print("\n" + "=" * 70)
            return

        # Get the first IPv4 address
        ip_address = addr_info[0][4][0]
        print(f"✓ DNS Resolution successful: {domain} -> {ip_address}\n")

        # Ping the resolved address
        param = "-n" if platform.system().lower() == "windows" else "-c"
        command = ["ping", param, "4", ip_address]

        print(f"Pinging {ip_address}...\n")

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=30
        )

        print(result.stdout)

        if result.returncode == 0:
            print(f"✓ SUCCESS: {domain} ({ip_address}) is reachable")
        else:
            print(f"✗ FAILURE: {domain} ({ip_address}) is not reachable")

        print("\n" + "=" * 70)

    except socket.gaierror:
        print(f"✗ FAILURE: DNS resolution failed for {domain}")
        print("  Check your DNS settings or internet connection")
        print("\n" + "=" * 70)
    except subprocess.TimeoutExpired:
        print(f"✗ TIMEOUT: Ping to {ip_address} timed out")
        print("\n" + "=" * 70)
    except Exception as e:
        print(f"✗ ERROR: {e}")
        print("\n" + "=" * 70)


def get_local_ips() -> None:
    """
    Display both IPv4 and IPv6 addresses for all network interfaces.

    This function retrieves and displays all network interface addresses
    available on the local machine, organized by interface name.
    """
    print("\n" + "=" * 70)
    print("LOCAL IP ADDRESSES")
    print("=" * 70)

    try:
        # Get hostname
        hostname = socket.gethostname()
        print(f"\nHostname: {hostname}\n")

        # Get all address information
        addr_info = socket.getaddrinfo(hostname, None)

        # Organize addresses by family
        ipv4_addresses = set()
        ipv6_addresses = set()

        for info in addr_info:
            family, _, _, _, sockaddr = info
            ip_address = sockaddr[0]

            if family == socket.AF_INET:
                ipv4_addresses.add(ip_address)
            elif family == socket.AF_INET6:
                # Remove scope ID for cleaner display
                ipv6_addresses.add(ip_address.split('%')[0])

        # Display IPv4 addresses
        print("IPv4 Addresses:")
        print("-" * 40)
        if ipv4_addresses:
            for idx, ip in enumerate(sorted(ipv4_addresses), 1):
                print(f"  {idx}. {ip}")
        else:
            print("  No IPv4 addresses found")

        # Display IPv6 addresses
        print("\nIPv6 Addresses:")
        print("-" * 40)
        if ipv6_addresses:
            for idx, ip in enumerate(sorted(ipv6_addresses), 1):
                print(f"  {idx}. {ip}")
        else:
            print("  No IPv6 addresses found")

        print("\n" + "=" * 70)

    except socket.error as e:
        print(f"Error retrieving IP addresses: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


def main() -> None:
    """
    Main function to orchestrate all network testing operations.

    This function checks permissions and executes all network diagnostic
    functions in sequence.
    """
    # Check administrative privileges first
    check_permissions()

    # Display header
    display_header()

    try:
        # Execute all network tests
        get_local_ips()
        ping_test()
        dns_ping_test()
        check_local_listeners()

        # Display completion message
        print("\n" + "=" * 70)
        print(" " * 20 + "ALL TESTS COMPLETED")
        print("=" * 70 + "\n")

    except KeyboardInterrupt:
        print("\n\n✗ Script interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Unexpected error in main execution: {e}")
        sys.exit(1)


def ping_test(host: str = "8.8.8.8", count: int = 4) -> None:
    """
    Test connectivity to a specified host using ICMP ping.

    Args:
        host: IP address or hostname to ping (default: 8.8.8.8 - Google DNS)
        count: Number of ping packets to send (default: 4)
    """
    print("\n" + "=" * 70)
    print(f"PING TEST - {host}")
    print("=" * 70)

    try:
        # Determine ping command based on OS
        param = "-n" if platform.system().lower() == "windows" else "-c"

        # Build ping command
        command = ["ping", param, str(count), host]

        print(f"\nTesting connectivity to {host}...\n")

        # Execute ping command
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=30
        )

        # Display results
        print(result.stdout)

        if result.returncode == 0:
            print(f"✓ SUCCESS: Host {host} is reachable")
        else:
            print(f"✗ FAILURE: Host {host} is not reachable")

        print("\n" + "=" * 70)

    except subprocess.TimeoutExpired:
        print(f"✗ TIMEOUT: Ping to {host} timed out")
        print("\n" + "=" * 70)
    except FileNotFoundError:
        print("✗ ERROR: Ping command not found on this system")
        print("\n" + "=" * 70)
    except Exception as e:
        print(f"✗ ERROR: {e}")
        print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
