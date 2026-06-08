"""
=============================================================
  Digital Forensics File Carver
  ─────────────────────────────
  Course: Digital Forensics
  Description: Scans a binary disk image for known file
               signatures, carves complete files, computes
               MD5 hashes, and writes a hashes.txt report.

  Usage:
      python forensic_carver.py <disk_image_path> <LastName>

  Example:
      python forensic_carver.py disk.img Smith
=============================================================
"""

import sys
import os
import hashlib

# ─────────────────────────────────────────────
#  FILE SIGNATURES (header, footer, extension)
#  Add more entries here to support new types.
# ─────────────────────────────────────────────
FILE_SIGNATURES = [
    {
        "type":      "JPG",
        "extension": ".jpg",
        "header":    bytes([0xFF, 0xD8, 0xFF]),
        "footer":    bytes([0xFF, 0xD9]),
    },
    {
        "type":      "PNG",
        "extension": ".png",
        "header":    bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
        "footer":    bytes([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]),
    },
    {
        "type":      "PDF",
        "extension": ".pdf",
        "header":    bytes([0x25, 0x50, 0x44, 0x46]),        # %PDF
        "footer":    bytes([0x25, 0x25, 0x45, 0x4F, 0x46]), # %%EOF
    },
    {
        "type":      "GIF",
        "extension": ".gif",
        "header":    bytes([0x47, 0x49, 0x46, 0x38]),        # GIF8
        "footer":    bytes([0x00, 0x3B]),
    },
]






# Maximum size to carve per file (50 MB safety limit)
MAX_FILE_SIZE = 50 * 1024 * 1024


# ─────────────────────────────────────────────
#  HELPER: compute MD5 of a bytes object
# ─────────────────────────────────────────────
def md5_of_bytes(data: bytes) -> str:
    return hashlib.md5(data).hexdigest().upper()


# ─────────────────────────────────────────────
#  HELPER: find ALL occurrences of a pattern
# ─────────────────────────────────────────────
def find_all(data: bytes, pattern: bytes) -> list:
    positions = []
    start = 0
    while True:
        idx = data.find(pattern, start)
        if idx == -1:
            break
        positions.append(idx)
        start = idx + 1
    return positions


# ─────────────────────────────────────────────
#  CORE: carve files from disk image bytes
# ─────────────────────────────────────────────
def carve_files(image_data: bytes, output_dir: str) -> list:
    """
    Scan image_data for every known signature.
    Returns a list of dicts describing each carved file.
    """
    results = []

    for sig in FILE_SIGNATURES:
        file_type  = sig["type"]
        extension  = sig["extension"]
        header     = sig["header"]
        footer     = sig["footer"]

        print(f"\n  [*] Searching for {file_type} files ...")
        header_positions = find_all(image_data, header)

        if not header_positions:
            print(f"      No {file_type} headers found.")
            continue

        print(f"      Found {len(header_positions)} potential header(s).")
        file_count = 0

        for start_offset in header_positions:

            # ── Determine end offset ──────────────────────────
            if footer is not None:
                # Search for footer AFTER the header
                end_offset = image_data.find(footer, start_offset + len(header))

                if end_offset == -1:
                    print(f"      [!] Header at 0x{start_offset:08X} — no matching footer found. Skipping.")
                    continue

                # Include the footer bytes themselves
                end_offset += len(footer)

            else:
                # No footer defined — carve up to MAX_FILE_SIZE
                end_offset = min(start_offset + MAX_FILE_SIZE, len(image_data))

            # ── Safety: skip unreasonably large chunks ────────
            carved_size = end_offset - start_offset
            if carved_size > MAX_FILE_SIZE:
                print(f"      [!] Segment at 0x{start_offset:08X} exceeds size limit ({carved_size} bytes). Skipping.")
                continue

            if carved_size < 1024:
                continue  # Skip files under 1 KB — likely corrupt fragments

            # ── Per-type minimum size filters ─────────────────
            min_sizes = {
                ".jpg":   2048,   # JPG must be at least 2 KB
                ".png":   1024,   # PNG must be at least 1 KB
            }
            min_size = min_sizes.get(sig["extension"], 1024)
            if carved_size < min_size:
                print(f"      [!] {sig['type']} at 0x{start_offset:08X} too small ({carved_size} bytes < {min_size} bytes). Skipping.")
                continue

            # ── Extract bytes ─────────────────────────────────
            carved_data = image_data[start_offset:end_offset]

            # ── JPG integrity check ───────────────────────────
            # A valid JPG must start with FF D8 FF and end with FF D9
            if sig["extension"] == ".jpg":
                if not (carved_data[:3] == bytes([0xFF, 0xD8, 0xFF]) and
                        carved_data[-2:] == bytes([0xFF, 0xD9])):
                    print(f"      [!] JPG at 0x{start_offset:08X} failed integrity check. Skipping.")
                    continue

            # ── PNG integrity check ───────────────────────────
            if sig["extension"] == ".png":
                if not (carved_data[:8] == bytes([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]) and
                        carved_data[-8:] == bytes([0x49,0x45,0x4E,0x44,0xAE,0x42,0x60,0x82])):
                    print(f"      [!] PNG at 0x{start_offset:08X} failed integrity check. Skipping.")
                    continue

            # ── PDF integrity check ───────────────────────────
            if sig["extension"] == ".pdf":
                if not (carved_data[:4] == bytes([0x25,0x50,0x44,0x46]) and
                        b"%%EOF" in carved_data[-20:]):
                    print(f"      [!] PDF at 0x{start_offset:08X} failed integrity check. Skipping.")
                    continue

            # ── GIF integrity check ───────────────────────────
            if sig["extension"] == ".gif":
                if not (carved_data[:4] == bytes([0x47,0x49,0x46,0x38]) and
                        carved_data[-2:] == bytes([0x00,0x3B])):
                    print(f"      [!] GIF at 0x{start_offset:08X} failed integrity check. Skipping.")
                    continue



            # ── Build filename ────────────────────────────────
            file_count += 1
            filename = f"{file_type.split()[0].lower()}_{file_count:03d}{extension}"
            filepath = os.path.join(output_dir, filename)

            # ── Write file ────────────────────────────────────
            with open(filepath, "wb") as f:
                f.write(carved_data)

            # ── Compute MD5 ───────────────────────────────────
            file_md5 = md5_of_bytes(carved_data)

            # ── Store result ──────────────────────────────────
            result = {
                "filename":     filename,
                "filepath":     filepath,
                "type":         file_type,
                "start_offset": start_offset,
                "end_offset":   end_offset,
                "size_bytes":   carved_size,
                "md5":          file_md5,
            }
            results.append(result)

            # ── Console output ────────────────────────────────
            print(f"      [+] Carved: {filename}")
            print(f"          Type        : {file_type}")
            print(f"          Start offset: 0x{start_offset:08X}  ({start_offset} bytes)")
            print(f"          End offset  : 0x{end_offset:08X}  ({end_offset} bytes)")
            print(f"          File size   : {carved_size:,} bytes  ({carved_size/1024:.2f} KB)")
            print(f"          MD5 hash    : {file_md5}")

    return results


# ─────────────────────────────────────────────
#  WRITE hashes.txt
# ─────────────────────────────────────────────
def write_hashes_file(results: list, output_dir: str):
    hashes_path = os.path.join(output_dir, "hashes.txt")
    with open(hashes_path, "w") as f:
        f.write("=" * 70 + "\n")
        f.write("  FORENSIC FILE RECOVERY — MD5 HASH LOG\n")
        f.write("=" * 70 + "\n\n")
        f.write(f"  Total files recovered: {len(results)}\n\n")
        f.write("-" * 70 + "\n")

        for r in results:
            f.write(f"  Filename    : {r['filename']}\n")
            f.write(f"  Type        : {r['type']}\n")
            f.write(f"  Start offset: 0x{r['start_offset']:08X}\n")
            f.write(f"  End offset  : 0x{r['end_offset']:08X}\n")
            f.write(f"  File size   : {r['size_bytes']:,} bytes ({r['size_bytes']/1024:.2f} KB)\n")
            f.write(f"  MD5 hash    : {r['md5']}\n")
            f.write("-" * 70 + "\n")

    print(f"\n  [✓] hashes.txt written → {hashes_path}")
    return hashes_path


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────
def main():
    # ── Hardcoded settings (for Thonny) ───────
    # The disk image must be in the SAME folder as this script.
    image_path = "carveit"   # disk image filename
    last_name  = "max"       # output folder name

    if not os.path.isfile(image_path):
        print(f"\n  [ERROR] File not found: '{image_path}'")
        print(f"  Make sure 'carveit' is in the same folder as this script.")
        print(f"  Script is running from: {os.getcwd()}\n")
        sys.exit(1)

    # ── Create output folder ──────────────────
    output_dir = last_name  # folder named after last name
    os.makedirs(output_dir, exist_ok=True)
    print(f"\n  Output folder: {os.path.abspath(output_dir)}")

    # ── Load disk image ───────────────────────
    print(f"  Loading disk image: {image_path} ...")
    with open(image_path, "rb") as f:
        image_data = f.read()

    image_size = len(image_data)
    print(f"  Image size: {image_size:,} bytes ({image_size/1024/1024:.2f} MB)")

    print("\n" + "=" * 60)
    print("  STARTING FILE CARVING")
    print("=" * 60)

    # ── Carve files ───────────────────────────
    results = carve_files(image_data, output_dir)

    # ── Summary ───────────────────────────────
    print("\n" + "=" * 60)
    print(f"  CARVING COMPLETE — {len(results)} file(s) recovered")
    print("=" * 60)

    if results:
        write_hashes_file(results, output_dir)
    else:
        print("\n  [!] No files were recovered from this image.")
        print("      Check that the image path is correct and contains")
        print("      supported file types.\n")

    print(f"\n  All recovered files saved to: ./{output_dir}/\n")


if __name__ == "__main__":
    main()
