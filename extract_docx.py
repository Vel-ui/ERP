"""Extract text from Word documents and save to text files."""
import zipfile
import xml.etree.ElementTree as ET
import os

def extract_docx(path):
    ns = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    texts = []
    for elem in root.iter("{%s}t" % ns):
        if elem.text:
            texts.append(elem.text)
        if elem.tail:
            texts.append(elem.tail)
    return "".join(texts)

base = r"c:\Users\user\OneDrive - Vel CPA\Documents\7-OFFICIAL"
briq = os.path.join(base, "Briq", "Closed")
out_dir = os.path.join(base, "Maximor", "Vel's Dev", "docs")
os.makedirs(out_dir, exist_ok=True)

docs = [
    (os.path.join(briq, "Briq-Rillet Product Documentation.docx"), os.path.join(out_dir, "rillet-doc1.txt")),
    (os.path.join(briq, "Briq-Rillet Product Documentation-2.docx"), os.path.join(out_dir, "rillet-doc2.txt")),
    (os.path.join(briq, "Briq-Rillet Product Documentation-3.docx"), os.path.join(out_dir, "rillet-doc3.txt")),
]

for src, dst in docs:
    try:
        text = extract_docx(src)
        with open(dst, "w", encoding="utf-8") as f:
            f.write(text)
        print("Saved:", dst)
    except Exception as e:
        print("Error:", src, e)
