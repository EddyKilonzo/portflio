# System Audit Compliance Script for FinSecure
#
# This script performs three key compliance checks for FinSecure:
# 1. File system permissions on sensitive directories
# 2. Active user session monitoring
# 3. Disk space utilization monitoring

import os
import stat
import subprocess
import shutil
import sys
from typing import List, Tuple, Optional

# -----------------------------------------------------------------------------
# Check file permissions compliance
# -----------------------------------------------------------------------------
def check_file_permissions():
    
    print("Checking file permissions compliance...")
    
    # Path to the sensitive directory that stores confidential data
    # On Windows, this is treated as a directory under the current drive (e.g., C:\secure_data).
    sensitive_directory = os.environ.get("FINSECURE_SENSITIVE_DIR") or os.path.join(os.path.abspath(os.sep), "secure_data")
    
    try:
        if not os.path.isdir(sensitive_directory):
            print(f"Directory '{sensitive_directory}' does not exist.")
            return

        # Note: This check is POSIX-permissions based. Windows uses ACLs, so this will be
        # treated as an informational check on Windows unless enhanced with ACL parsing.
        dir_stat = os.stat(sensitive_directory)

        
        if os.name == "nt":
            print(
                f"Directory '{sensitive_directory}' exists. "
                "Permission compliance on Windows requires ACL review (manual or via icacls)."
            )
            return

        if dir_stat.st_mode & stat.S_IRWXO == 0 and dir_stat.st_mode & stat.S_IRWXG == 0:
            print(f"Permissions for '{sensitive_directory}' are compliant (no group/other access).")
        else:
            print(f"Permissions for '{sensitive_directory}' are NOT compliant (group/other access detected).")
            
    except FileNotFoundError:
        # Handle the case where the directory doesn't exist
        print(f"Directory '{sensitive_directory}' does not exist.")

# -----------------------------------------------------------------------------
# Check active sessions compliance
# -----------------------------------------------------------------------------
def check_active_sessions():
    
    print("Checking active sessions compliance...")
    
    try:
        active_sessions: List[str] = []

        if os.name == "nt":
            
            result = subprocess.run(["query", "user"], capture_output=True, text=True, shell=False)
            output = (result.stdout or "").strip()
            if output:
                lines = [ln.rstrip() for ln in output.splitlines() if ln.strip()]
                # Drop header if present (starts with USERNAME)
                if lines and lines[0].strip().upper().startswith("USERNAME"):
                    lines = lines[1:]
                active_sessions = lines
            else:
                # If `query user` is blocked/unavailable, report unknown rather than crashing.
                active_sessions = []
        else:
            # Unix/Linux: use the `who` command to list all currently logged-in users
            result = subprocess.run(["who"], capture_output=True, text=True)
            active_sessions = [line for line in result.stdout.strip().split("\n") if line]

        session_count = len(active_sessions)
        
        # Display the total number of active sessions
        print(f"Active sessions: {session_count}")
        
        # Check against the compliance threshold
        # More than 5 sessions may indicate unauthorized access
        if session_count > 5:
            print("Too many active sessions: Compliance NOT met.")
        else:
            print("Active sessions compliance is met.")
            
    except Exception as e:
        # Handle any errors (e.g., 'who' command not available)
        print(f"Error checking active sessions: {e}")

# -----------------------------------------------------------------------------
# Check disk space compliance
# -----------------------------------------------------------------------------
def check_disk_space():
    """
    Check disk space utilization on the root partition.
    
    High disk usage can lead to service disruptions or data loss.
    Compliant: Disk usage is 80% or less
    Non-Compliant: Disk usage exceeds 80%
    """
    print("Checking disk space compliance...")
    
    try:
        # Get disk usage statistics for the system/root drive.
        # On Windows, `os.path.abspath(os.sep)` yields the current drive root (e.g., C:\).
        # Returns: (total_bytes, used_bytes, free_bytes)
        target_path = os.path.abspath(os.sep)
        total, used, free = shutil.disk_usage(target_path)
        
        # Calculate the percentage of disk space being used
        usage_percentage = (used / total) * 100
        
        # Display current disk usage with 2 decimal places
        print(f"Disk usage on '{target_path}': {usage_percentage:.2f}%")
        
        # Check against the compliance threshold
        # Organizations typically flag >80% as a warning level
        if usage_percentage > 80:
            print("Disk space utilization is NOT compliant.")
        else:
            print("Disk space utilization is compliant.")
            
    except Exception as e:
        # Handle any errors accessing disk information
        print(f"Error checking disk space: {e}")

# -----------------------------------------------------------------------------
# Main function to run all compliance checks
# -----------------------------------------------------------------------------
def main():
    """
    Main function that orchestrates all compliance checks.
    
    Runs each check in sequence and reports results.
    """
    print("Starting System Audit Compliance Checker...\n")
    
    # Run each compliance check
    check_file_permissions()
    check_active_sessions()
    check_disk_space()
    
    print("\nCompliance check completed.")


# Entry point: Run the script when executed directly
if __name__ == "__main__":
    main()
