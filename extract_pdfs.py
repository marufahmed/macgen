"""
PDF Extraction Script using Docling
Extracts all PDFs in the workspace root to Markdown files in /extracted_docs
Images are saved per-document in /extracted_docs/images/<doc_name>/
and linked inline in the Markdown.
"""

import re
from pathlib import Path

from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling_core.types.doc import ImageRefMode, PictureItem, TableItem

WORKSPACE = Path(__file__).parent
OUTPUT_DIR = WORKSPACE / "extracted_docs"
OUTPUT_DIR.mkdir(exist_ok=True)

# Pipeline options: generate images for every page, picture, and table
pipeline_options = PdfPipelineOptions()
pipeline_options.images_scale = 2.0          # 2× resolution for crisp images
pipeline_options.generate_page_images = False # we only want embedded pictures/tables
pipeline_options.generate_picture_images = True
pipeline_options.generate_table_images = True

converter = DocumentConverter(
    format_options={
        InputFormat.PDF: PdfFormatOption(pipeline_options=pipeline_options)
    }
)

def safe_stem(pdf_path: Path) -> str:
    name = re.sub(r'[^\w\s\-]', '', pdf_path.stem)
    return re.sub(r'\s+', '_', name.strip())

# Find all PDFs in the workspace root (non-recursive)
pdf_files = list(WORKSPACE.glob("*.pdf"))

if not pdf_files:
    print("No PDF files found in workspace root.")
else:
    print(f"Found {len(pdf_files)} PDF(s):\n")
    for p in pdf_files:
        print(f"  - {p.name}")

for pdf_path in pdf_files:
    print(f"\n{'='*60}")
    print(f"Processing: {pdf_path.name}")
    print(f"{'='*60}")
    try:
        result = converter.convert(str(pdf_path))
        doc = result.document
        stem = safe_stem(pdf_path)

        # Create per-document images folder
        img_dir = OUTPUT_DIR / "images" / stem
        img_dir.mkdir(parents=True, exist_ok=True)

        # Save all extracted pictures and tables as PNG files
        img_count = 0
        for element, _level in doc.iterate_items():
            if isinstance(element, (PictureItem, TableItem)):
                img_count += 1
                img_filename = f"{stem}_{img_count:03d}.png"
                img_path = img_dir / img_filename
                with img_path.open("wb") as fp:
                    element.get_image(doc).save(fp, format="PNG")

        # Export markdown with image refs pointing to relative paths
        md_content = doc.export_to_markdown(image_mode=ImageRefMode.REFERENCED)

        # Rewrite the auto-generated image paths to our organised folder
        # Docling uses placeholder refs like <!-- image --> or relative paths;
        # replace any generated relative image refs with our organised paths
        counter = [0]
        def replace_img(match):
            counter[0] += 1
            rel = f"images/{stem}/{stem}_{counter[0]:03d}.png"
            return f"![image {counter[0]}]({rel})"

        # Replace docling's placeholder comments with actual img tags
        md_content = re.sub(r'<!-- image -->', replace_img, md_content)

        out_path = OUTPUT_DIR / f"{stem}.md"
        out_path.write_text(md_content, encoding="utf-8")

        print(f"  ✅ Saved  → extracted_docs/{stem}.md")
        print(f"  🖼️  Images → extracted_docs/images/{stem}/ ({img_count} images)")
        print(f"  📄 Characters: {len(md_content):,}")
    except Exception as e:
        import traceback
        print(f"  ❌ Error processing {pdf_path.name}:")
        traceback.print_exc()

print(f"\n\n✅ Extraction complete. Files saved to: {OUTPUT_DIR}")
