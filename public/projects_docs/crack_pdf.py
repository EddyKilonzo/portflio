import pikepdf
import itertools
import sys

def crack_pdf(pdf_path):
    print(f"[*] Starting 6-digit numeric brute-force on: {pdf_path}")
    print(f"[*] Total combinations: 1,000,000 (000000 - 999999)\n")

    for i in range(1_000_000):
        password = f"{i:06d}"  # Zero-padded 6-digit string

        try:
            with pikepdf.open(pdf_path, password=password) as pdf:
                print(f"[+] Password found: {password}")
                # Save unlocked version
                output_path = pdf_path.replace(".pdf", "_unlocked.pdf")
                pdf.save(output_path)
                print(f"[+] Unlocked PDF saved to: {output_path}")
                return password
        except pikepdf.PasswordError:
            continue
        except Exception as e:
            print(f"[-] Unexpected error at {password}: {e}")
            sys.exit(1)

        # Progress update every 10,000 attempts
        if i % 10_000 == 0 and i > 0:
            print(f"    Tried {i:,} / 1,000,000 ({i/10000:.1f}%)")

    print("[-] Password not found.")
    return None

if __name__ == "__main__":
    pdf_file = "crack.pdf"  # Change to your PDF path
    crack_pdf(pdf_file)