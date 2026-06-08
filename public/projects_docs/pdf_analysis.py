#!/usr/bin/env python3
"""
Suspicious PDF Analysis Script
Scenario: Analyze suspicious.pdf for potential malicious indicators.
"""
# Step 1: Set Up Your Environment and Import Libraries
import os
import re
import hashlib

# Step 2: Read the PDF File
def read_file(file_path):
    try:
        with open(file_path, 'rb') as f:
            return f.read()
    except IOError:
        print("Error reading file:", file_path)
        return None

# Step 3: Extract Readable Strings
def extract_strings(data, min_length=4):
    pattern = rb'[\x20-\x7E]{' + str(min_length).encode() + rb',}'
    return re.findall(pattern, data)

# Step 4: Compute Cryptographic Hashes
def compute_hashes(data):
    md5_hash = hashlib.md5(data).hexdigest()
    sha256_hash = hashlib.sha256(data).hexdigest()
    return md5_hash, sha256_hash

# Step 5: Detect Suspicious Indicators
def detect_suspicious(strings, suspicious_keywords):
    suspicious_found = []
    for s in strings:
        s_decoded = s.decode('utf-8', errors='ignore')
        for keyword in suspicious_keywords:
            if keyword.lower() in s_decoded.lower():
                suspicious_found.append(s_decoded)
                break
    return suspicious_found

# Step 6: Generate a Report of Findings
def generate_report(file_path, md5_hash, sha256_hash, extracted_strings, suspicious_indicators):
    print("Analysis Report for:", file_path)
    print("MD5 Hash:", md5_hash)
    print("SHA-256 Hash:", sha256_hash)
    print("\nExtracted Strings:")
    for s in extracted_strings:
        print(s.decode('utf-8', errors='ignore'))
    print("\nSuspicious Indicators Found:")
    if suspicious_indicators:
        for indicator in suspicious_indicators:
            print(indicator)
    else:
        print("None found.")

# Final Step: Main Execution Block
if __name__ == "__main__":
    file_path = "suspicious.pdf"
    data = read_file(file_path)
    if data:
        extracted = extract_strings(data)
        md5, sha256 = compute_hashes(data)
        suspicious_keywords = ["javascript", "action", "submit", "malicious", "alert"]
        suspicious = detect_suspicious(extracted, suspicious_keywords)
        generate_report(file_path, md5, sha256, extracted, suspicious)
    else:
        print("Exiting due to read error.")
