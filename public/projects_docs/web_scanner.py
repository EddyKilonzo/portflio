#!/usr/bin/env python3

"""
Detailed Web Security Scanner
Features: Advanced XSS Detection and Security Header Audit.
"""

import requests
import argparse
import sys
import urllib.parse
from datetime import datetime

# Expanded XSS Payloads
XSS_PAYLOADS = [
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert(1)>",
    "svg/onload=alert(1)",
    "javascript:alert(1)",
    "';alert(1)//",
    "\"><script>alert(1)</script>",
    "<details open ontoggle=alert(1)>",
    "<body onload=alert(1)>"
]

# Security Headers to check
SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "X-XSS-Protection",
    "Referrer-Policy"
]

def check_headers(url):
    """Analyze security headers of the target URL."""
    print(f"\n[+] Auditing Security Headers for: {url}")
    try:
        response = requests.get(url, timeout=5)
        headers = response.headers
        missing = []
        
        for header in SECURITY_HEADERS:
            if header in headers:
                print(f"  [✓] {header}: {headers[header][:50]}...")
            else:
                print(f"  [✗] {header} is MISSING")
                missing.append(header)
        
        return missing
    except Exception as e:
        print(f"  [!] Error auditing headers: {e}")
        return []

def scan_xss(url):
    """Test for reflected XSS vulnerabilities."""
    print(f"\n[+] Scanning for Reflected XSS...")
    vulnerabilities = []
    
    # Common parameters to test
    params_to_test = ['q', 's', 'id', 'user', 'query', 'search', 'input']
    
    for payload in XSS_PAYLOADS:
        for param in params_to_test:
            try:
                test_params = {param: payload}
                response = requests.get(url, params=test_params, timeout=5)
                
                if payload in response.text:
                    print(f"  [!] VULNERABLE: Param '{param}' reflects payload: {payload[:30]}...")
                    vulnerabilities.append({"param": param, "payload": payload})
                    break # Move to next payload once a param is found vulnerable
            except Exception:
                continue
                
    if not vulnerabilities:
        print("  [✓] No simple reflected XSS found.")
    
    return vulnerabilities

def main():
    parser = argparse.ArgumentParser(description="Professional Web Security Scanner")
    parser.add_argument("target", help="Target URL (e.g., http://example.com)")
    args = parser.parse_args()
    
    url = args.target
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url

    print("-" * 60)
    print(f"Web Security Scan: {url}")
    print(f"Time Started: {datetime.now()}")
    print("-" * 60)

    missing_headers = check_headers(url)
    xss_vulns = scan_xss(url)

    print("\n" + "-" * 60)
    print("SUMMARY")
    print("-" * 60)
    print(f"Missing Security Headers: {len(missing_headers)}")
    print(f"XSS Vulnerabilities Found: {len(xss_vulns)}")
    print("-" * 60)

if __name__ == "__main__":
    main()
