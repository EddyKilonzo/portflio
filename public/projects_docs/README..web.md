# <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/globe.svg" width="30" height="30" /> Web Scanner

<img src="https://img.shields.io/badge/Type-Vulnerability--Scanner-red?style=flat-square" /> <img src="https://img.shields.io/badge/Audits-XSS--&--Headers-orange?style=flat-square" />

A comprehensive web security auditor that checks for missing security headers and reflected XSS vulnerabilities.

## ✨ Features

*   🛡️ **Header Audit**: Checks for CSP, HSTS, X-Frame-Options, and more.
*   🧪 **XSS Testing**: Scans multiple parameters using an expanded list of bypass payloads.
*   📈 **Detailed Summary**: Provides a clear count of missing protections and found vulnerabilities.
*   ⚡ **Efficient**: Targeted scanning of common injection points.

## 🚀 Usage

Scan a target website:
```bash
python web_scanner.py https://example.com
```

### Security Headers Audited
*   `Content-Security-Policy`
*   `Strict-Transport-Security` (HSTS)
*   `X-Frame-Options`
*   `X-Content-Type-Options`
*   `X-XSS-Protection`
*   `Referrer-Policy`

## 🧪 XSS Detection Logic
The scanner tests for reflection in common parameters:
`q`, `s`, `id`, `user`, `query`, `search`, `input`

## 📊 Example Output

```text
------------------------------------------------------------
Web Security Scan: http://example.com
Time Started: 2024-05-20 10:05:00.000000
------------------------------------------------------------

[+] Auditing Security Headers for: http://example.com
  [✓] Content-Security-Policy: default-src 'self'...
  [✗] Strict-Transport-Security is MISSING
  [✓] X-Frame-Options: SAMEORIGIN...

[+] Scanning for Reflected XSS...
  [!] VULNERABLE: Param 'q' reflects payload: <script>alert('XSS')</script>...

------------------------------------------------------------
SUMMARY
------------------------------------------------------------
Missing Security Headers: 1
XSS Vulnerabilities Found: 1
------------------------------------------------------------
```
