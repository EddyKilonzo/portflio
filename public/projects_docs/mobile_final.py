import subprocess

def check_adb_connection():
    """Check if an Android device is connected via ADB."""
    result = subprocess.run(["adb", "devices"], capture_output=True, text=True)
    devices = result.stdout.split("\n")[1:]  # Skip the header line
    connected_devices = [line.split("\t")[0] for line in devices if "device" in line]
    
    if connected_devices:
        print(f"Device connected: {connected_devices[0]}")
        return connected_devices[0]
    else:
        print("No devices detected. Please connect a device and enable ADB.")
        return None

def check_root_access(device):
    """Check if the Android device is rooted."""
    result = subprocess.run(["adb", "-s", device, "shell", "su", "-c", "id"], capture_output=True, text=True)
    
    if "uid=0" in result.stdout:
        print("WARNING: Device is rooted!")
    else:
        print("Device does not appear to be rooted.")

def check_outdated_apps(device):
    """Check for outdated applications installed on the Android device."""
    result = subprocess.run(["adb", "-s", device, "shell", "dumpsys", "package"], capture_output=True, text=True)
    
    if "versionCode=" in result.stdout:
        print("Installed apps retrieved. Manually review for outdated apps.")
    else:
        print("Could not retrieve app versions.")

def check_open_ports(device):
    """Scan for open network ports on the Android device."""
    result = subprocess.run(["adb", "-s", device, "shell", "netstat"], capture_output=True, text=True)
    
    if result.stdout:
        print("Open network ports detected:")
        print(result.stdout)
    else:
        print("Could not retrieve network port information.")

def main():
    """Main function to execute the vulnerability scan."""
    device = check_adb_connection()
    if not device:
        return  # Exit if no device is detected

    print("Choose a scan to perform:")
    print("1. Check for root access")
    print("2. Check for outdated apps")
    print("3. Check for open network ports")
    print("4. Run all scans")

    choice = input("Enter your choice (1-4): ").strip()

    if choice == "1":
        check_root_access(device)
    elif choice == "2":
        check_outdated_apps(device)
    elif choice == "3":
        check_open_ports(device)
    elif choice == "4":
        check_root_access(device)
        check_outdated_apps(device)
        check_open_ports(device)
    else:
        print("Invalid choice.")

    print("\nScan complete.")

if __name__ == "__main__":
    main()
