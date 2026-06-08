"""
OSINT Data Collection Script
=============================
This script gathers publicly available Open-Source Intelligence (OSINT) data
about a target domain. It collects WHOIS registration information, Shodan
network/port data, and saves all results to a JSON file for analysis.

Usage:
    python OSINT_final.py

The user will be prompted to enter a domain name (e.g., microsoft.com).
Results are printed to the console and saved to 'osint_results.json'.
"""

import requests
import json
import whois

# Shodan API key 
SHODAN_API_KEY = "your_shodan_api_key_here"

# User-agent header to avoid being blocked by web security filters
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/114.0.0.0 Safari/537.36"
}


def get_whois_info(domain):
    """
    Fetches WHOIS information for a given domain.

    Queries the WHOIS database to retrieve registration details such as
    registrar, creation date, expiration date, name servers, and contact info.

    Args:
        domain (str): The domain name to look up (e.g., 'example.com').

    Returns:
        str: Raw WHOIS text data, or an error message if the lookup fails.
    """
    try:
        w = whois.whois(domain)
        return w.text
    except Exception as e:
        return f"Error retrieving WHOIS data: {e}"


def get_shodan_info(domain):
    """
    Fetches Shodan information for a given domain.

    First resolves the domain to an IP address using the Shodan DNS API,
    then queries the Shodan host API to retrieve open ports, services,
    vulnerabilities, and other network exposure data for that IP.

    Args:
        domain (str): The domain name to investigate (e.g., 'example.com').

    Returns:
        str: JSON-formatted string of Shodan host data, or an error/info message.
    """
    try:
        # Resolve domain to IP address using Shodan DNS API
        url = f"https://api.shodan.io/dns/resolve?hostnames={domain}&key={SHODAN_API_KEY}"
        response = requests.get(url, headers=HEADERS)
        ip = response.json().get(domain)

        if ip:
            # Query Shodan host endpoint with the resolved IP
            shodan_url = f"https://api.shodan.io/shodan/host/{ip}?key={SHODAN_API_KEY}"
            shodan_response = requests.get(shodan_url, headers=HEADERS)
            return json.dumps(shodan_response.json(), indent=4)
        else:
            return "No IP found for this domain."
    except Exception as e:
        return f"Error retrieving Shodan data: {e}"


def main():
    """
    Main function that orchestrates the OSINT data collection process.

    Prompts the user for a target domain, calls each OSINT function,
    prints the results to the console, and saves all collected data
    to a JSON output file named 'osint_results.json'.
    """
    domain = input("Enter the domain name to investigate: ")

    print("\n" + "=" * 50)
    print(f"  OSINT Reconnaissance Report: {domain}")
    print("=" * 50)

    # --- Task 2: Retrieve and display WHOIS information ---
    print("\n[*] Fetching WHOIS information...")
    whois_data = get_whois_info(domain)
    print(whois_data)

    # --- Task 3: Retrieve and display Shodan information ---
    print("\n[*] Fetching Shodan information...")
    shodan_data = get_shodan_info(domain)
    print(shodan_data)

    # --- Task 4: Save collected data to a JSON file ---
    output = {
        "domain": domain,
        "whois": whois_data,
        "shodan": shodan_data
    }

    output_file = "osint_results.json"
    with open(output_file, "w") as f:
        json.dump(output, f, indent=4)

    print(f"\n[+] OSINT data saved to '{output_file}'")
    print("OSINT data collection complete.")


if __name__ == "__main__":
    main()
